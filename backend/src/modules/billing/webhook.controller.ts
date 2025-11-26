/**
 * Stripe webhook controller (Fastify plugin)
 * Handles all Stripe webhook events with signature verification
 *
 * CRITICAL: This handler MUST use raw body for signature verification
 */

import type { FastifyPluginAsync } from 'fastify'
import type Stripe from 'stripe'
import { stripeService } from './stripe.service.js'
import { prisma } from '../../shared/database/prisma.service.js'
import { createModuleLogger } from '../../shared/utils/logger.js'
import { StripeWebhookError } from '../../shared/utils/errors.js'
import { WEBHOOK_EVENTS } from './billing.schemas.js'

const logger = createModuleLogger('webhook-controller')

const webhookController: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/stripe/webhook
   * Handle Stripe webhook events
   *
   * IMPORTANT: This route must be configured with fastify-raw-body
   */
  fastify.post('/webhook', {
    config: {
      // Enable raw body for this route
      rawBody: true
    }
  }, async (request, reply) => {
    const signature = request.headers['stripe-signature']

    if (!signature) {
      throw new StripeWebhookError('Missing stripe-signature header')
    }

    // Get raw body (provided by fastify-raw-body plugin)
    const rawBody = (request as any).rawBody

    if (!rawBody) {
      throw new StripeWebhookError('Missing raw body for signature verification')
    }

    // Verify webhook signature and construct event
    let event: Stripe.Event
    try {
      event = stripeService.constructWebhookEvent(rawBody, signature as string)
    } catch (error) {
      logger.error({ error }, 'Webhook signature verification failed')
      throw new StripeWebhookError('Invalid webhook signature')
    }

    logger.info({
      eventId: event.id,
      type: event.type
    }, 'Webhook event received')

    // Log webhook event to database for debugging/replay
    await prisma.webhookEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        payload: event as any,
        processed: false
      }
    }).catch(err => {
      // If duplicate event, that's okay (idempotency)
      if (err.code !== 'P2002') {
        logger.error({ error: err }, 'Failed to log webhook event')
      }
    })

    // Handle event based on type
    try {
      switch (event.type) {
        case WEBHOOK_EVENTS.CHECKOUT_COMPLETED:
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
          break

        case WEBHOOK_EVENTS.INVOICE_PAID:
          await handleInvoicePaid(event.data.object as Stripe.Invoice)
          break

        case WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break

        case WEBHOOK_EVENTS.SUBSCRIPTION_DELETED:
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break

        case WEBHOOK_EVENTS.PAYMENT_FAILED:
          await handlePaymentFailed(event.data.object as Stripe.Invoice)
          break

        default:
          logger.debug({ type: event.type }, 'Unhandled webhook event type')
      }

      // Mark event as processed
      await prisma.webhookEvent.updateMany({
        where: { stripeEventId: event.id },
        data: {
          processed: true,
          processedAt: new Date()
        }
      })

      reply.code(200).send({ received: true })
    } catch (error) {
      logger.error({
        error,
        eventId: event.id,
        type: event.type
      }, 'Webhook handler error')

      // Log error in webhook event
      await prisma.webhookEvent.updateMany({
        where: { stripeEventId: event.id },
        data: {
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      })

      // Still return 200 to prevent Stripe retries for application errors
      reply.code(200).send({ received: true, error: 'Processing failed' })
    }
  })
}

/**
 * Handle checkout.session.completed
 * Create order record and activate subscription/pass
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan

  if (!userId) {
    logger.warn({ sessionId: session.id }, 'Checkout completed without userId in metadata')
    return
  }

  logger.info({
    sessionId: session.id,
    userId,
    mode: session.mode
  }, 'Processing checkout completed')

  // Update order status
  await prisma.order.updateMany({
    where: { stripeSessionId: session.id },
    data: {
      status: 'completed',
      stripeCustomerId: session.customer as string,
      completedAt: new Date()
    }
  })

  // For subscription mode, create/update subscription record
  if (session.mode === 'subscription' && session.subscription) {
    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription.id

    // Fetch full subscription details
    const subscription = await stripeService.getSubscription(subscriptionId)

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      },
      update: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })

    logger.info({ userId, subscriptionId }, 'Subscription activated')
  }

  // For payment mode (14-day pass), license is granted by completed order
  if (session.mode === 'payment') {
    logger.info({ userId, sessionId: session.id }, '14-day pass purchased')
  }
}

/**
 * Handle invoice.paid
 * Confirms subscription payment (renewal)
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.subscription) {
    return // Not a subscription invoice
  }

  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id

  logger.info({
    subscriptionId,
    invoiceId: invoice.id
  }, 'Invoice paid for subscription')

  // Update subscription status
  const subscription = await stripeService.getSubscription(subscriptionId)

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: 'active',
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  })
}

/**
 * Handle customer.subscription.updated
 * Updates subscription status/period
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  logger.info({
    subscriptionId: subscription.id,
    status: subscription.status
  }, 'Subscription updated')

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
    }
  })
}

/**
 * Handle customer.subscription.deleted
 * Marks subscription as canceled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  logger.info({
    subscriptionId: subscription.id
  }, 'Subscription deleted')

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date()
    }
  })
}

/**
 * Handle invoice.payment_failed
 * Marks subscription as past_due
 */
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.subscription) {
    return
  }

  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription.id

  logger.warn({
    subscriptionId,
    invoiceId: invoice.id
  }, 'Payment failed for subscription')

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: 'past_due'
    }
  })
}

export default webhookController
