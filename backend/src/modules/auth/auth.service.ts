/**
 * Authentication service
 * Handles user registration, login, token management
 */

import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { prisma } from '../../shared/database/prisma.service.js'
import { config } from '../../shared/config/environment.js'
import { UnauthorizedError, ValidationError } from '../../shared/utils/errors.js'
import { createModuleLogger } from '../../shared/utils/logger.js'
import type { AuthResponse, JwtPayload, RegisterInput, LoginInput } from './auth.schemas.js'

const logger = createModuleLogger('auth')

const SALT_ROUNDS = 12

export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    })

    if (existingUser) {
      throw new ValidationError('User with this email already exists')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        locale: input.locale || 'en'
      },
      select: {
        id: true,
        email: true,
        name: true,
        locale: true
      }
    })

    logger.info({ userId: user.id, email: user.email }, 'User registered successfully')

    // Generate tokens
    return this.generateAuthResponse(user)
  }

  /**
   * Login user
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: {
        id: true,
        email: true,
        name: true,
        locale: true,
        passwordHash: true
      }
    })

    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash)

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    logger.info({ userId: user.id }, 'User logged in successfully')

    // Generate tokens
    const { passwordHash, ...userWithoutPassword } = user
    return this.generateAuthResponse(userWithoutPassword)
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as JwtPayload

      // Check if refresh token exists in database and is not revoked
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
      })

      if (!storedToken || storedToken.revokedAt) {
        throw new UnauthorizedError('Invalid or revoked refresh token')
      }

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedError('Refresh token expired')
      }

      // Get fresh user data
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          locale: true
        }
      })

      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      logger.info({ userId: user.id }, 'Access token refreshed')

      // Generate new tokens
      return this.generateAuthResponse(user)
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token')
      }
      throw error
    }
  }

  /**
   * Revoke refresh token (logout)
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date() }
    })

    logger.info('Refresh token revoked')
  }

  /**
   * Verify access token and return user data
   */
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload
      return payload
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Access token expired')
      }
      throw new UnauthorizedError('Invalid access token')
    }
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateAuthResponse(user: {
    id: string
    email: string
    name: string | null
    locale: string
  }): Promise<AuthResponse> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email
    }

    // Generate access token (short-lived)
    const accessTokenOptions: SignOptions = {
      expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn']
    }
    const accessToken = jwt.sign(payload, config.JWT_SECRET, accessTokenOptions)

    // Generate refresh token (long-lived)
    const refreshTokenOptions: SignOptions = {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']
    }
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, refreshTokenOptions)

    // Store refresh token in database
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt
      }
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        locale: user.locale
      },
      expiresIn: config.JWT_EXPIRES_IN
    }
  }
}

export const authService = new AuthService()
