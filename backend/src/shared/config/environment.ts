/**
 * Environment configuration with Zod validation
 * All environment variables are validated at startup
 */

// Load dotenv first
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Go up from src/shared/config/ to backend/ root
const envPath = join(__dirname, '..', '..', '..', '.env')
dotenv.config({ path: envPath })

import { z } from 'zod'
import { logger } from '../utils/logger.js'

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),

  // JWT Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Stripe
  STRIPE_SECRET: z.string().startsWith('sk_', 'STRIPE_SECRET must start with sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'STRIPE_WEBHOOK_SECRET must start with whsec_'),

  // Stripe Price IDs - 14-Day Pass (6 currencies)
  PRICE_PASS_14D_USD: z.string().startsWith('price_'),
  PRICE_PASS_14D_CAD: z.string().startsWith('price_'),
  PRICE_PASS_14D_MXN: z.string().startsWith('price_'),
  PRICE_PASS_14D_BRL: z.string().startsWith('price_'),
  PRICE_PASS_14D_CLP: z.string().startsWith('price_'),
  PRICE_PASS_14D_ARS: z.string().startsWith('price_'),

  // Stripe Price IDs - Monthly Subscription (6 currencies)
  PRICE_MONTHLY_USD: z.string().startsWith('price_'),
  PRICE_MONTHLY_CAD: z.string().startsWith('price_'),
  PRICE_MONTHLY_MXN: z.string().startsWith('price_'),
  PRICE_MONTHLY_BRL: z.string().startsWith('price_'),
  PRICE_MONTHLY_CLP: z.string().startsWith('price_'),
  PRICE_MONTHLY_ARS: z.string().startsWith('price_'),

  // AI Services (optional)
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),

  // Application URLs
  APP_BASE_URL: z.string().url('APP_BASE_URL must be a valid URL'),
  CORS_ORIGIN: z.string().default('http://localhost:4200'),

  // File Upload
  MAX_FILE_SIZE: z.string().default('15728640').transform(Number), // 15MB in bytes
  UPLOAD_DIR: z.string().default('/tmp/uploads'),

  // Rate Limiting (optional)
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),
  RATE_LIMIT_WINDOW: z.string().default('60000').transform(Number), // 1 minute in ms
})

export type Config = z.infer<typeof envSchema>

/**
 * Parse and validate environment variables
 * Throws error if validation fails
 */
function loadConfig(): Config {
  try {
    const config = envSchema.parse(process.env)

    // Validate at least one AI provider is configured
    if (!config.ANTHROPIC_API_KEY && !config.OPENAI_API_KEY) {
      logger.warn('No AI provider API keys configured. AI suggestions will use fallback mode only.')
    }

    logger.info({
      env: config.NODE_ENV,
      port: config.PORT,
      hasAnthropicKey: !!config.ANTHROPIC_API_KEY,
      hasOpenAIKey: !!config.OPENAI_API_KEY
    }, 'Environment configuration loaded successfully')

    return config
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error({
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      }, 'Environment validation failed')
      throw new Error('Invalid environment configuration. Check logs for details.')
    }
    throw error
  }
}

export const config = loadConfig()

/**
 * Check if running in production
 */
export const isProduction = config.NODE_ENV === 'production'

/**
 * Check if running in development
 */
export const isDevelopment = config.NODE_ENV === 'development'

/**
 * Check if running in test
 */
export const isTest = config.NODE_ENV === 'test'
