/**
 * AI controller (Fastify plugin)
 * Handles AI suggestion requests
 */

import type { FastifyPluginAsync } from 'fastify'
import { suggestionService } from './suggestion.service.js'
import { suggestionRequestSchema } from './ai.schemas.js'
import { sendSuccess } from '../../shared/utils/response.js'
import { optionalAuthenticateUser } from '../auth/auth.middleware.js'
import { createModuleLogger } from '../../shared/utils/logger.js'

const logger = createModuleLogger('ai-controller')

const aiController: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/ai/suggest
   * Generate AI-powered resume suggestions
   */
  fastify.post('/suggest', {
    preHandler: optionalAuthenticateUser, // Optional auth - can work for anonymous users
    schema: {
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', minLength: 1, maxLength: 2000 },
          locale: {
            type: 'string',
            enum: ['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA'],
            default: 'en'
          },
          industry: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' }, default: [] },
          missing: { type: 'array', items: { type: 'string' }, default: [] },
          refresh: { type: 'boolean', default: false },
          temperature: { type: 'number', minimum: 0, maximum: 2 },
          seed: { type: 'integer' },
          filters: {
            type: 'object',
            properties: {
              requireNumber: { type: 'boolean', default: true },
              requireVerb: { type: 'boolean', default: true },
              wordMin: { type: 'number', minimum: 5, maximum: 30, default: 10 },
              wordMax: { type: 'number', minimum: 10, maximum: 40, default: 22 },
              star: { type: 'boolean', default: false },
              injectMissingKeywords: { type: 'boolean', default: true }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const input = suggestionRequestSchema.parse(request.body)

    logger.info({
      userId: request.user?.userId,
      locale: input.locale,
      industry: input.industry,
      textLength: input.text.length
    }, 'AI suggestion request')

    const result = await suggestionService.suggest({
      text: input.text,
      locale: input.locale,
      industry: input.industry,
      title: input.title,
      description: input.description,
      keywords: input.keywords,
      missing: input.missing,
      refresh: input.refresh,
      temperature: input.temperature,
      seed: input.seed,
      filters: input.filters
    })

    logger.info({
      provider: result.provider,
      cached: result.cached,
      count: result.suggestions.length
    }, 'AI suggestions generated')

    sendSuccess(reply, result)
  })

  /**
   * GET /api/ai/cache/stats
   * Get cache statistics (admin/debug endpoint)
   */
  fastify.get('/cache/stats', async (request, reply) => {
    const stats = suggestionService.getCacheStats()

    sendSuccess(reply, stats)
  })

  /**
   * DELETE /api/ai/cache
   * Clear suggestion cache (admin endpoint)
   */
  fastify.delete('/cache', async (request, reply) => {
    suggestionService.clearCache()

    sendSuccess(reply, { message: 'Cache cleared successfully' })
  })
}

export default aiController
