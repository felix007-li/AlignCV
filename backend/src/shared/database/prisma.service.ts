/**
 * Prisma client service with connection management
 * Singleton pattern to avoid multiple client instances
 */

import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger.js'

/**
 * Prisma client with query logging in development
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    errorFormat: 'minimal',
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

/**
 * Connect to database
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect()
    logger.info('Database connected successfully')
  } catch (error) {
    logger.error({ error }, 'Database connection failed')
    throw error
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect()
    logger.info('Database disconnected successfully')
  } catch (error) {
    logger.error({ error }, 'Database disconnection failed')
    throw error
  }
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    logger.error({ error }, 'Database health check failed')
    return false
  }
}

/**
 * Transaction helper
 * Use this for operations that require atomicity
 */
export const transaction = prisma.$transaction.bind(prisma)

/**
 * Cleanup expired refresh tokens (run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    logger.info(`Cleaned up ${result.count} expired refresh tokens`)
    return result.count
  } catch (error) {
    logger.error({ error }, 'Failed to cleanup expired tokens')
    return 0
  }
}
