/**
 * Authentication controller (Fastify plugin)
 * Handles registration, login, token refresh, and user info
 */

import type { FastifyPluginAsync } from 'fastify'
import { authService } from './auth.service.js'
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.schemas.js'
import { sendSuccess } from '../../shared/utils/response.js'
import { authenticateUser } from './auth.middleware.js'
import { createModuleLogger } from '../../shared/utils/logger.js'
import { prisma } from '../../shared/database/prisma.service.js'

const logger = createModuleLogger('auth-controller')

const authController: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          name: { type: 'string' },
          locale: { type: 'string', enum: ['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA'] }
        }
      }
    }
  }, async (request, reply) => {
    const input = registerSchema.parse(request.body)

    const result = await authService.register(input)

    logger.info({ userId: result.user.id }, 'User registered')

    sendSuccess(reply, result, 201)
  })

  /**
   * POST /api/auth/login
   * Login user and return tokens
   */
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const input = loginSchema.parse(request.body)

    const result = await authService.login(input)

    logger.info({ userId: result.user.id }, 'User logged in')

    sendSuccess(reply, result)
  })

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token
   */
  fastify.post('/refresh', {
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const input = refreshTokenSchema.parse(request.body)

    const result = await authService.refreshToken(input.refreshToken)

    logger.info({ userId: result.user.id }, 'Token refreshed')

    sendSuccess(reply, result)
  })

  /**
   * POST /api/auth/logout
   * Revoke refresh token (logout)
   */
  fastify.post('/logout', {
    preHandler: authenticateUser,
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string }

    await authService.revokeRefreshToken(refreshToken)

    logger.info({ userId: request.user?.userId }, 'User logged out')

    sendSuccess(reply, { message: 'Logged out successfully' })
  })

  /**
   * GET /api/auth/me
   * Get current user information
   */
  fastify.get('/me', {
    preHandler: authenticateUser
  }, async (request, reply) => {
    const userId = request.user!.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        locale: true,
        createdAt: true,
        subscription: {
          select: {
            status: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true
          }
        }
      }
    })

    sendSuccess(reply, user)
  })
}

export default authController
