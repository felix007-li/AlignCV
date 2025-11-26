/**
 * Resume controller (Fastify plugin)
 * CRUD operations for resume management
 */

import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../../shared/database/prisma.service.js'
import { createResumeSchema, updateResumeSchema, listResumesQuerySchema } from './resume.schemas.js'
import { sendSuccess, sendPaginated } from '../../shared/utils/response.js'
import { authenticateUser } from '../auth/auth.middleware.js'
import { createModuleLogger } from '../../shared/utils/logger.js'
import { NotFoundError, ForbiddenError } from '../../shared/utils/errors.js'

const logger = createModuleLogger('resume-controller')

const resumeController: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /api/resumes
   * List all resumes for authenticated user
   */
  fastify.get('/', {
    preHandler: authenticateUser,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', default: '1' },
          limit: { type: 'string', default: '10' },
          isActive: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user!.userId
    const query = listResumesQuerySchema.parse(request.query)

    const where = {
      userId,
      ...(query.isActive !== undefined && { isActive: query.isActive })
    }

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          templateId: true,
          locale: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.resume.count({ where })
    ])

    logger.info({
      userId,
      page: query.page,
      count: resumes.length,
      total
    }, 'Resumes listed')

    sendPaginated(reply, resumes, query.page, query.limit, total)
  })

  /**
   * POST /api/resumes
   * Create new resume
   */
  fastify.post('/', {
    preHandler: authenticateUser,
    schema: {
      body: {
        type: 'object',
        required: ['templateId'],
        properties: {
          title: { type: 'string', maxLength: 200 },
          content: { type: 'object' },
          templateId: { type: 'string' },
          locale: { type: 'string', enum: ['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA'] }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user!.userId
    const input = createResumeSchema.parse(request.body)

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: input.title,
        content: input.content,
        templateId: input.templateId,
        locale: input.locale
      }
    })

    logger.info({
      userId,
      resumeId: resume.id
    }, 'Resume created')

    sendSuccess(reply, resume, 201)
  })

  /**
   * GET /api/resumes/:id
   * Get single resume by ID
   */
  fastify.get('/:id', {
    preHandler: authenticateUser,
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.userId

    const resume = await prisma.resume.findUnique({
      where: { id }
    })

    if (!resume) {
      throw new NotFoundError('Resume')
    }

    // Ensure user owns this resume
    if (resume.userId !== userId) {
      throw new ForbiddenError('You do not have access to this resume')
    }

    sendSuccess(reply, resume)
  })

  /**
   * PATCH /api/resumes/:id
   * Update resume
   */
  fastify.patch('/:id', {
    preHandler: authenticateUser,
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'object' },
          templateId: { type: 'string' },
          locale: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.userId
    const input = updateResumeSchema.parse(request.body)

    // Verify ownership
    const existing = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!existing) {
      throw new NotFoundError('Resume')
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('You do not have access to this resume')
    }

    // Update
    const resume = await prisma.resume.update({
      where: { id },
      data: input
    })

    logger.info({
      userId,
      resumeId: id
    }, 'Resume updated')

    sendSuccess(reply, resume)
  })

  /**
   * DELETE /api/resumes/:id
   * Delete resume (soft delete by setting isActive = false)
   */
  fastify.delete('/:id', {
    preHandler: authenticateUser,
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.userId

    const existing = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!existing) {
      throw new NotFoundError('Resume')
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('You do not have access to this resume')
    }

    // Soft delete
    await prisma.resume.update({
      where: { id },
      data: { isActive: false }
    })

    logger.info({
      userId,
      resumeId: id
    }, 'Resume deleted (soft)')

    sendSuccess(reply, { message: 'Resume deleted successfully' })
  })
}

export default resumeController
