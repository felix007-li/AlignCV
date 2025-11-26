/**
 * AlignCV Backend - Fastify Server
 * Production-ready Node.js backend with Stripe, AI, and resume management
 */

// Load environment variables first
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env')

console.log('Attempting to load .env from:', envPath)
console.log('.env file exists:', existsSync(envPath))

const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error('Failed to load .env file:', result.error)
} else {
  console.log('Successfully loaded .env file')
  console.log('Sample env vars:', {
    hasDatabase: !!process.env.DATABASE_URL,
    hasStripe: !!process.env.STRIPE_SECRET,
    hasOpenAI: !!process.env.OPENAI_API_KEY
  })
}

import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import rawBody from 'fastify-raw-body'
import { config, isProduction } from './shared/config/environment.js'
import { logger } from './shared/utils/logger.js'
import { errorHandler } from './shared/middleware/error-handler.js'
import { connectDatabase, prisma, checkDatabaseHealth } from './shared/database/prisma.service.js'

// Import all controllers
import authController from './modules/auth/auth.controller.js'
import checkoutController from './modules/billing/checkout.controller.js'
import webhookController from './modules/billing/webhook.controller.js'
import aiController from './modules/ai/ai.controller.js'
import jdController from './modules/jd/jd.controller.js'
import importController from './modules/importer/import.controller.js'
import resumeController from './modules/resume/resume.controller.js'

/**
 * Create and configure Fastify server
 */
async function createServer() {
  const fastify = Fastify({
    logger: logger,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
    disableRequestLogging: false,
    trustProxy: isProduction
  })

  // Decorate fastify with prisma client
  fastify.decorate('prisma', prisma)

  // Register plugins
  await fastify.register(cors, {
    origin: config.CORS_ORIGIN.split(',').map(o => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })

  // Raw body plugin (required for Stripe webhook signature verification)
  await fastify.register(rawBody, {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true
  })

  // Multipart plugin for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: config.MAX_FILE_SIZE,
      files: 1
    }
  })

  // Register routes
  await fastify.register(authController, { prefix: '/api/auth' })
  await fastify.register(checkoutController, { prefix: '/api/checkout' })
  await fastify.register(webhookController, { prefix: '/api/stripe' })
  await fastify.register(aiController, { prefix: '/api/ai' })
  await fastify.register(jdController, { prefix: '/api/jd' })
  await fastify.register(importController, { prefix: '/api/import' })
  await fastify.register(resumeController, { prefix: '/api/resumes' })

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    const dbHealthy = await checkDatabaseHealth()

    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      database: dbHealthy ? 'connected' : 'disconnected'
    }

    reply.code(dbHealthy ? 200 : 503).send(health)
  })

  // Root endpoint
  fastify.get('/', async (request, reply) => {
    reply.send({
      name: 'AlignCV Backend API',
      version: '1.0.0',
      environment: config.NODE_ENV,
      endpoints: {
        health: '/health',
        auth: '/api/auth',
        checkout: '/api/checkout',
        webhooks: '/api/stripe/webhook',
        ai: '/api/ai',
        jd: '/api/jd',
        import: '/api/import',
        resumes: '/api/resumes'
      }
    })
  })

  // Set global error handler
  fastify.setErrorHandler(errorHandler)

  // Not found handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      success: false,
      error: {
        message: 'Route not found',
        statusCode: 404
      }
    })
  })

  return fastify
}

/**
 * Start server
 */
async function start() {
  try {
    // Connect to database
    await connectDatabase()

    // Create server
    const server = await createServer()

    // Start listening
    await server.listen({
      port: config.PORT,
      host: '0.0.0.0'
    })

    logger.info({
      port: config.PORT,
      environment: config.NODE_ENV,
      nodeVersion: process.version
    }, 'Server started successfully')

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown`)

      try {
        await server.close()
        logger.info('Server closed successfully')
        process.exit(0)
      } catch (error) {
        logger.error({ error }, 'Error during shutdown')
        process.exit(1)
      }
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  } catch (error) {
    logger.error({ error }, 'Failed to start server')
    process.exit(1)
  }
}

// Start server if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  start()
}

export { createServer }
