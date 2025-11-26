/**
 * Stripe price configuration
 * Maps plans and currencies to Stripe Price IDs
 */

import { config } from '../../shared/config/environment.js'

export type PlanType = 'pass14' | 'monthly'
export type Currency = 'USD' | 'CAD' | 'MXN' | 'BRL' | 'CLP' | 'ARS'

/**
 * Price mapping: plan -> currency -> Stripe Price ID
 */
export const PRICE_MAP: Record<PlanType, Record<Currency, string>> = {
  pass14: {
    USD: config.PRICE_PASS_14D_USD,
    CAD: config.PRICE_PASS_14D_CAD,
    MXN: config.PRICE_PASS_14D_MXN,
    BRL: config.PRICE_PASS_14D_BRL,
    CLP: config.PRICE_PASS_14D_CLP,
    ARS: config.PRICE_PASS_14D_ARS
  },
  monthly: {
    USD: config.PRICE_MONTHLY_USD,
    CAD: config.PRICE_MONTHLY_CAD,
    MXN: config.PRICE_MONTHLY_MXN,
    BRL: config.PRICE_MONTHLY_BRL,
    CLP: config.PRICE_MONTHLY_CLP,
    ARS: config.PRICE_MONTHLY_ARS
  }
}

/**
 * Checkout session mode based on plan type
 */
export const CHECKOUT_MODE: Record<PlanType, 'payment' | 'subscription'> = {
  pass14: 'payment',
  monthly: 'subscription'
}

/**
 * Plan display names (for metadata)
 */
export const PLAN_NAMES: Record<PlanType, string> = {
  pass14: '14-Day Pass',
  monthly: 'Monthly Subscription'
}

/**
 * Get Stripe Price ID for plan and currency
 */
export function getPriceId(plan: PlanType, currency: Currency): string {
  const priceId = PRICE_MAP[plan]?.[currency]

  if (!priceId) {
    throw new Error(`No price configured for plan: ${plan}, currency: ${currency}`)
  }

  return priceId
}

/**
 * Validate plan type
 */
export function isValidPlan(plan: string): plan is PlanType {
  return plan === 'pass14' || plan === 'monthly'
}

/**
 * Validate currency
 */
export function isValidCurrency(currency: string): currency is Currency {
  return ['USD', 'CAD', 'MXN', 'BRL', 'CLP', 'ARS'].includes(currency)
}
