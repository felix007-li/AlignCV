/**
 * Schemas for resume CRUD operations
 */

import { z } from 'zod'

export const createResumeSchema = z.object({
  title: z.string().min(1).max(200).default('Untitled Resume'),
  content: z.record(z.any()).default({}), // Resume JSON structure
  templateId: z.string().min(1),
  locale: z.enum(['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA']).default('en')
})

export type CreateResumeInput = z.infer<typeof createResumeSchema>

export const updateResumeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.any()).optional(),
  templateId: z.string().optional(),
  locale: z.enum(['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA']).optional()
})

export type UpdateResumeInput = z.infer<typeof updateResumeSchema>

export const listResumesQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
  isActive: z.string().transform(val => val === 'true').optional()
})

export type ListResumesQuery = z.infer<typeof listResumesQuerySchema>
