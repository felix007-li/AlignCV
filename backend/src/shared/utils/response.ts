/**
 * Standardized API response formats
 * Ensures consistent response structure across all endpoints
 */

import type { FastifyReply } from 'fastify'

export interface SuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: {
    timestamp?: string
    requestId?: string
    [key: string]: unknown
  }
}

export interface ErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    details?: unknown
    statusCode: number
  }
  meta?: {
    timestamp?: string
    requestId?: string
  }
}

/**
 * Send successful response with data
 */
export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>
): void {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: reply.request.id,
      ...meta
    }
  }

  reply.code(statusCode).send(response)
}

/**
 * Send error response
 */
export function sendError(
  reply: FastifyReply,
  message: string,
  statusCode = 500,
  details?: unknown,
  code?: string
): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
      details,
      statusCode
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: reply.request.id
    }
  }

  reply.code(statusCode).send(response)
}

/**
 * Send paginated response
 */
export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  meta?: {
    timestamp?: string
    requestId?: string
  }
}

export function sendPaginated<T>(
  reply: FastifyReply,
  data: T[],
  page: number,
  limit: number,
  total: number
): void {
  const totalPages = Math.ceil(total / limit)

  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: reply.request.id
    }
  }

  reply.code(200).send(response)
}
