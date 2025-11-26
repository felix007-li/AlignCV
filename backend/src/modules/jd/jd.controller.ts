/**
 * JD (Job Description) controller (Fastify plugin)
 * Handles language detection, keyword extraction, and full JD analysis
 */

import type { FastifyPluginAsync } from 'fastify'
import { jdAnalyzerService } from './jd-analyzer.service.js'
import { detectLanguageSchema, extractKeywordsSchema, analyzeJdSchema } from './jd.schemas.js'
import { sendSuccess } from '../../shared/utils/response.js'
import { optionalAuthenticateUser } from '../auth/auth.middleware.js'
import { createModuleLogger } from '../../shared/utils/logger.js'

const logger = createModuleLogger('jd-controller')

const jdController: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/jd/detect
   * Detect language of job description
   */
  fastify.post('/detect', {
    preHandler: optionalAuthenticateUser,
    schema: {
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', minLength: 10 }
        }
      }
    }
  }, async (request, reply) => {
    const input = detectLanguageSchema.parse(request.body)

    const result = jdAnalyzerService.detectLanguage(input.text)

    logger.info({
      language: result.language,
      confidence: result.confidence
    }, 'Language detected')

    sendSuccess(reply, result)
  })

  /**
   * POST /api/jd/keywords
   * Extract keywords from job description
   */
  fastify.post('/keywords', {
    preHandler: optionalAuthenticateUser,
    schema: {
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', minLength: 10 },
          lang: { type: 'string', enum: ['en', 'es', 'pt', 'fr'] },
          maxKeywords: { type: 'number', minimum: 5, maximum: 50, default: 20 }
        }
      }
    }
  }, async (request, reply) => {
    const input = extractKeywordsSchema.parse(request.body)

    // Auto-detect language if not provided
    const lang = input.lang || jdAnalyzerService.detectLanguage(input.text).language

    const keywords = jdAnalyzerService.extractKeywords(
      input.text,
      lang,
      input.maxKeywords
    )

    logger.info({
      lang,
      count: keywords.length
    }, 'Keywords extracted')

    sendSuccess(reply, {
      keywords,
      language: lang
    })
  })

  /**
   * POST /api/jd/analyze
   * Full job description analysis
   */
  fastify.post('/analyze', {
    preHandler: optionalAuthenticateUser,
    schema: {
      body: {
        type: 'object',
        required: ['jdText'],
        properties: {
          jdText: { type: 'string', minLength: 50 },
          resumeText: { type: 'string' },
          locale: {
            type: 'string',
            enum: ['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA'],
            default: 'en'
          }
        }
      }
    }
  }, async (request, reply) => {
    const input = analyzeJdSchema.parse(request.body)

    const result = await jdAnalyzerService.analyze(
      input.jdText,
      input.resumeText
    )

    logger.info({
      language: result.language,
      matchScore: result.matchScore,
      keywordCount: result.keywords.length
    }, 'JD analysis completed')

    sendSuccess(reply, result)
  })
}

export default jdController
