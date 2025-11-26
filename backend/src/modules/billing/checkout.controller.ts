/**
 * Checkout controller (Fastify plugin)
 * Handles Stripe checkout session creation
 */

import type { FastifyPluginAsync } from 'fastify'
import { stripeService } from './stripe.service.js'
import { createCheckoutSchema } from './billing.schemas.js'
import { sendSuccess } from '../../shared/utils/response.js'
import { authenticateUser } from '../auth/auth.middleware.js'
import { createModuleLogger } from '../../shared/utils/logger.js'
import { prisma } from '../../shared/database/prisma.service.js'
import { NotFoundError } from '../../shared/utils/errors.js'

const logger = createModuleLogger('checkout-controller')

const checkoutController: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/checkout/session
   * Create Stripe checkout session
   */
  fastify.post('/session', {
    preHandler: authenticateUser,
    schema: {
      body: {
        type: 'object',
        required: ['plan', 'currency'],
        properties: {
          plan: { type: 'string', enum: ['pass14', 'monthly'] },
          currency: { type: 'string', enum: ['USD', 'CAD', 'MXN', 'BRL', 'CLP', 'ARS'] },
          successUrl: { type: 'string', format: 'uri' },
          cancelUrl: { type: 'string', format: 'uri' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user!.userId
    const input = createCheckoutSchema.parse(request.body)

    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    // Create checkout session
    const session = await stripeService.createCheckoutSession({
      userId,
      userEmail: user.email,
      plan: input.plan,
      currency: input.currency,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl
    })

    // Create pending order record
    await prisma.order.create({
      data: {
        userId,
        stripeSessionId: session.id,
        stripeCustomerId: session.customer as string | null,
        mode: session.mode,
        status: 'pending',
        amount: session.amount_total || 0,
        currency: input.currency,
        plan: input.plan,
        metadata: {
          planName: session.metadata?.planName
        }
      }
    })

    logger.info({
      userId,
      sessionId: session.id,
      plan: input.plan,
      currency: input.currency
    }, 'Checkout session created')

    sendSuccess(reply, {
      sessionId: session.id,
      url: session.url,
      expiresAt: session.expires_at
    })
  })

  /**
   * GET /api/checkout/session/:sessionId
   * Retrieve checkout session details
   */
  fastify.get('/session/:sessionId', {
    preHandler: authenticateUser,
    schema: {
      params: {
        type: 'object',
        required: ['sessionId'],
        properties: {
          sessionId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string }
    const userId = request.user!.userId

    // Verify this session belongs to the user
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId }
    })

    if (!order || order.userId !== userId) {
      throw new NotFoundError('Checkout session')
    }

    const session = await stripeService.getCheckoutSession(sessionId)

    sendSuccess(reply, {
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency,
      expiresAt: session.expires_at
    })
  })
}

export default checkoutController
