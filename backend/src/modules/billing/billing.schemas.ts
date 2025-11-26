/**
 * Zod schemas for billing/checkout endpoints
 */

import { z } from 'zod'

/**
 * Create checkout session request
 */
export const createCheckoutSchema = z.object({
  plan: z.enum(['pass14', 'monthly'], {
    errorMap: () => ({ message: 'Plan must be either "pass14" or "monthly"' })
  }),
  currency: z.enum(['USD', 'CAD', 'MXN', 'BRL', 'CLP', 'ARS'], {
    errorMap: () => ({ message: 'Invalid currency' })
  }),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
})

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>

/**
 * Checkout session response
 */
export interface CheckoutSessionResponse {
  sessionId: string
  url: string
  expiresAt: number
}

/**
 * Stripe webhook event types we handle
 */
export const WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  INVOICE_PAID: 'invoice.paid',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  PAYMENT_FAILED: 'invoice.payment_failed'
} as const

export type WebhookEventType = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS]
