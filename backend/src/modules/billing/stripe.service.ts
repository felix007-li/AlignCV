/**
 * Stripe service
 * Encapsulates all Stripe SDK interactions
 */

import Stripe from 'stripe'
import { config } from '../../shared/config/environment.js'
import { createModuleLogger } from '../../shared/utils/logger.js'
import { PaymentError } from '../../shared/utils/errors.js'
import type { PlanType, Currency } from './price-config.js'
import { getPriceId, CHECKOUT_MODE, PLAN_NAMES } from './price-config.js'

const logger = createModuleLogger('stripe')

export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(config.STRIPE_SECRET, {
      apiVersion: '2024-06-20',
      typescript: true
    })

    logger.info('Stripe service initialized')
  }

  /**
   * Create checkout session
   */
  async createCheckoutSession(params: {
    userId: string
    userEmail: string
    plan: PlanType
    currency: Currency
    successUrl?: string
    cancelUrl?: string
  }): Promise<Stripe.Checkout.Session> {
    try {
      const priceId = getPriceId(params.plan, params.currency)
      const mode = CHECKOUT_MODE[params.plan]

      // Generate idempotency key for this specific checkout
      const idempotencyKey = `checkout-${params.userId}-${params.plan}-${Date.now()}`

      const session = await this.stripe.checkout.sessions.create({
        mode,
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        customer_email: params.userEmail,
        client_reference_id: params.userId,
        success_url: params.successUrl || `${config.APP_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: params.cancelUrl || `${config.APP_BASE_URL}/pricing`,
        metadata: {
          userId: params.userId,
          plan: params.plan,
          planName: PLAN_NAMES[params.plan]
        },
        // Enable tax calculation if configured in Stripe
        automatic_tax: { enabled: false },
        // Allow promotion codes
        allow_promotion_codes: true,
        // Subscription-specific settings
        ...(mode === 'subscription' && {
          subscription_data: {
            metadata: {
              userId: params.userId,
              plan: params.plan
            }
          }
        })
      }, {
        idempotencyKey
      })

      logger.info({
        sessionId: session.id,
        userId: params.userId,
        plan: params.plan,
        currency: params.currency,
        mode
      }, 'Checkout session created')

      return session
    } catch (error) {
      logger.error({ error, userId: params.userId }, 'Failed to create checkout session')
      throw new PaymentError('Failed to create checkout session', error)
    }
  }

  /**
   * Retrieve checkout session
   */
  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['customer', 'subscription', 'line_items']
      })
    } catch (error) {
      logger.error({ error, sessionId }, 'Failed to retrieve checkout session')
      throw new PaymentError('Failed to retrieve checkout session')
    }
  }

  /**
   * Retrieve subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId)
    } catch (error) {
      logger.error({ error, subscriptionId }, 'Failed to retrieve subscription')
      throw new PaymentError('Failed to retrieve subscription')
    }
  }

  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      })

      logger.info({ subscriptionId }, 'Subscription canceled at period end')
      return subscription
    } catch (error) {
      logger.error({ error, subscriptionId }, 'Failed to cancel subscription')
      throw new PaymentError('Failed to cancel subscription')
    }
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })

      logger.info({ subscriptionId }, 'Subscription reactivated')
      return subscription
    } catch (error) {
      logger.error({ error, subscriptionId }, 'Failed to reactivate subscription')
      throw new PaymentError('Failed to reactivate subscription')
    }
  }

  /**
   * Construct webhook event from raw body and signature
   * CRITICAL: This verifies the webhook is from Stripe
   */
  constructWebhookEvent(
    rawBody: Buffer,
    signature: string
  ): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.STRIPE_WEBHOOK_SECRET
      )
    } catch (error) {
      logger.error({ error }, 'Webhook signature verification failed')
      throw new PaymentError('Invalid webhook signature')
    }
  }

  /**
   * Get Stripe instance (for advanced use cases)
   */
  getStripeInstance(): Stripe {
    return this.stripe
  }
}

export const stripeService = new StripeService()
