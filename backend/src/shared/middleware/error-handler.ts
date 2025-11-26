/**
 * Global error handler for Fastify
 * Catches all errors and formats them consistently
 */

import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../utils/errors.js'
import { logger } from '../utils/logger.js'
import { sendError } from '../utils/response.js'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Log the error
  logger.error({
    err: error,
    req: request,
    requestId: request.id
  }, 'Request error occurred')

  // Handle known application errors
  if (error instanceof AppError) {
    return sendError(
      reply,
      error.message,
      error.statusCode,
      error.details,
      error.name
    )
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message
    }))
    return sendError(
      reply,
      'Validation failed',
      400,
      details,
      'VALIDATION_ERROR'
    )
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error, reply)
  }

  // Handle Fastify validation errors
  if (error.validation) {
    return sendError(
      reply,
      'Request validation failed',
      400,
      error.validation,
      'FASTIFY_VALIDATION_ERROR'
    )
  }

  // Handle Stripe errors (they have a type property)
  if ((error as any).type?.startsWith('Stripe')) {
    return sendError(
      reply,
      error.message || 'Payment processing error',
      402,
      { type: (error as any).type },
      'STRIPE_ERROR'
    )
  }

  // Handle 404 Not Found
  if (error.statusCode === 404) {
    return sendError(
      reply,
      'Resource not found',
      404,
      undefined,
      'NOT_FOUND'
    )
  }

  // Default to 500 Internal Server Error
  const statusCode = error.statusCode || 500
  const message = statusCode === 500
    ? 'Internal server error'
    : error.message || 'An error occurred'

  return sendError(
    reply,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? error.stack : undefined,
    'INTERNAL_ERROR'
  )
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError,
  reply: FastifyReply
): void {
  switch (error.code) {
    case 'P2002': // Unique constraint violation
      return sendError(
        reply,
        'A record with this value already exists',
        409,
        { field: (error.meta?.target as string[])?.join(', ') },
        'DUPLICATE_RECORD'
      )

    case 'P2025': // Record not found
      return sendError(
        reply,
        'Record not found',
        404,
        undefined,
        'NOT_FOUND'
      )

    case 'P2003': // Foreign key constraint violation
      return sendError(
        reply,
        'Related record not found',
        400,
        { field: error.meta?.field_name },
        'FOREIGN_KEY_VIOLATION'
      )

    case 'P2014': // Invalid relation
      return sendError(
        reply,
        'Invalid relation in query',
        400,
        undefined,
        'INVALID_RELATION'
      )

    default:
      logger.error({ code: error.code, meta: error.meta }, 'Unhandled Prisma error')
      return sendError(
        reply,
        'Database operation failed',
        500,
        process.env.NODE_ENV === 'development' ? { code: error.code, meta: error.meta } : undefined,
        'DATABASE_ERROR'
      )
  }
}
