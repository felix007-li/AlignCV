/**
 * Pino logger configuration with structured logging
 * Automatically redacts sensitive fields
 */

import pino from 'pino'

const isProduction = process.env.NODE_ENV === 'production'

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),

  // Pretty print in development
  transport: isProduction ? undefined : {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false
    }
  },

  // Redact sensitive fields to prevent logging PII/secrets
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'passwordHash',
      'token',
      'refreshToken',
      'apiKey',
      'stripe.customer.email',
      'stripe.*.email',
      '*.card_number',
      '*.cvv',
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'STRIPE_SECRET',
      'JWT_SECRET'
    ],
    remove: true
  },

  // Serializers for common objects
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err
  },

  // Add timestamp
  timestamp: pino.stdTimeFunctions.isoTime,

  // Format for production (JSON) vs development (pretty)
  formatters: isProduction ? {
    level: (label) => {
      return { level: label }
    }
  } : undefined
})

/**
 * Create child logger with additional context
 */
export function createModuleLogger(module: string) {
  return logger.child({ module })
}

/**
 * Log levels:
 * - trace: Very detailed logs (e.g., function entry/exit)
 * - debug: Detailed diagnostic information
 * - info: General informational messages (default)
 * - warn: Warning messages for unexpected but handled situations
 * - error: Error messages for failures
 * - fatal: Critical errors that require immediate attention
 */
