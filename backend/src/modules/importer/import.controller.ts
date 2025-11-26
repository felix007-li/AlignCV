/**
 * Import controller (Fastify plugin)
 * Handles resume file uploads and parsing
 */

import type { FastifyPluginAsync } from 'fastify'
import type { MultipartFile } from '@fastify/multipart'
import { pdfParser } from './parsers/pdf.parser.js'
import { docxParser } from './parsers/docx.parser.js'
import type { ImportResult } from './import.schemas.js'
import { sendSuccess } from '../../shared/utils/response.js'
import { optionalAuthenticateUser } from '../auth/auth.middleware.js'
import { createModuleLogger } from '../../shared/utils/logger.js'
import { FileProcessingError, ValidationError } from '../../shared/utils/errors.js'
import { config } from '../../shared/config/environment.js'

const logger = createModuleLogger('import-controller')

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])

const importController: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/import/resume
   * Upload and parse PDF or DOCX resume
   */
  fastify.post('/resume', {
    preHandler: optionalAuthenticateUser
  }, async (request, reply) => {
    const data = await request.file()

    if (!data) {
      throw new ValidationError('No file uploaded')
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.has(data.mimetype)) {
      throw new ValidationError('Invalid file type. Only PDF and DOCX are supported.')
    }

    // Validate file size
    const buffer = await data.toBuffer()
    if (buffer.length > config.MAX_FILE_SIZE) {
      throw new ValidationError(`File too large. Maximum size is ${config.MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    logger.info({
      filename: data.filename,
      mimetype: data.mimetype,
      size: buffer.length,
      userId: request.user?.userId
    }, 'Resume upload received')

    // Parse based on file type
    let profile, sections
    let source: 'pdf' | 'docx'

    if (data.mimetype === 'application/pdf') {
      ({ profile, sections } = await pdfParser.parse(buffer))
      source = 'pdf'
    } else {
      ({ profile, sections } = await docxParser.parse(buffer))
      source = 'docx'
    }

    const result: ImportResult = {
      profile,
      sections,
      meta: {
        source,
        importedAt: new Date().toISOString(),
        fileName: data.filename
      }
    }

    logger.info({
      source,
      sectionCount: sections.length,
      hasEmail: !!profile.email
    }, 'Resume parsed successfully')

    sendSuccess(reply, result)
  })

  /**
   * POST /api/import/linkedin
   * Parse LinkedIn PDF export (specialized parser)
   */
  fastify.post('/linkedin', {
    preHandler: optionalAuthenticateUser
  }, async (request, reply) => {
    const data = await request.file()

    if (!data) {
      throw new ValidationError('No file uploaded')
    }

    if (data.mimetype !== 'application/pdf') {
      throw new ValidationError('LinkedIn export must be PDF format')
    }

    const buffer = await data.toBuffer()

    if (buffer.length > config.MAX_FILE_SIZE) {
      throw new ValidationError(`File too large. Maximum size is ${config.MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    logger.info({
      filename: data.filename,
      size: buffer.length,
      userId: request.user?.userId
    }, 'LinkedIn PDF upload received')

    // Use same PDF parser for now (could enhance with LinkedIn-specific logic)
    const { profile, sections } = await pdfParser.parse(buffer)

    const result: ImportResult = {
      profile,
      sections,
      meta: {
        source: 'linkedin',
        importedAt: new Date().toISOString(),
        fileName: data.filename
      }
    }

    logger.info({
      sectionCount: sections.length
    }, 'LinkedIn PDF parsed successfully')

    sendSuccess(reply, result)
  })
}

export default importController
