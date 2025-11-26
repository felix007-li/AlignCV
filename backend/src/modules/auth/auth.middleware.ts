/**
 * JWT authentication middleware for Fastify
 * Verifies access token and attaches user to request
 */

import type { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '../../shared/utils/errors.js'
import { authService } from './auth.service.js'
import type { AuthUser } from './auth.schemas.js'

/**
 * Extend Fastify request type to include user
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser
  }
}

/**
 * Extract Bearer token from Authorization header
 */
function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

/**
 * Authentication middleware
 * Verifies JWT and attaches user to request
 */
export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const token = extractToken(request.headers.authorization)

  if (!token) {
    throw new UnauthorizedError('Missing authentication token')
  }

  try {
    const payload = await authService.verifyAccessToken(token)

    // Attach user to request
    request.user = {
      userId: payload.userId,
      email: payload.email
    }
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token')
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't throw error if missing
 */
export async function optionalAuthenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const token = extractToken(request.headers.authorization)

  if (!token) {
    return // No token, continue without user
  }

  try {
    const payload = await authService.verifyAccessToken(token)

    request.user = {
      userId: payload.userId,
      email: payload.email
    }
  } catch (error) {
    // Token invalid, continue without user
    return
  }
}
