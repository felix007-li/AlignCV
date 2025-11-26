/**
 * Zod schemas for authentication endpoints
 */

import { z } from 'zod'

/**
 * Registration schema
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(1, 'Name is required').max(100).optional(),
  locale: z.enum(['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA']).default('en')
})

export type RegisterInput = z.infer<typeof registerSchema>

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Refresh token schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>

/**
 * Auth response (tokens + user info)
 */
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string | null
    locale: string
  }
  expiresIn: string
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

/**
 * Authenticated user (attached to request)
 */
export interface AuthUser {
  userId: string
  email: string
}
