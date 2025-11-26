/**
 * Zod schemas for AI suggestions
 */

import { z } from 'zod'

/**
 * AI suggestion request
 */
export const suggestionRequestSchema = z.object({
  text: z.string().min(1, 'Text is required').max(2000, 'Text too long'),
  locale: z.enum(['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA']).default('en'),
  industry: z.string().optional(),
  title: z.string().optional(), // Job title for more contextual suggestions
  description: z.string().optional(), // Session/experience description for enhanced context
  keywords: z.array(z.string()).default([]),
  missing: z.array(z.string()).default([]),
  refresh: z.boolean().optional(), // Force bypass cache to generate new suggestions
  temperature: z.number().min(0).max(2).optional(), // LLM temperature for diversity (0-2)
  seed: z.number().int().optional(), // Random seed for reproducibility/diversity
  filters: z.object({
    requireNumber: z.boolean().default(true),
    requireVerb: z.boolean().default(true),
    wordMin: z.number().min(5).max(30).default(10),
    wordMax: z.number().min(10).max(40).default(22),
    star: z.boolean().default(false),
    injectMissingKeywords: z.boolean().default(true),
    diversity: z.boolean().optional() // Flag to request diverse suggestions
  }).default({
    requireNumber: true,
    requireVerb: true,
    wordMin: 10,
    wordMax: 22,
    star: false,
    injectMissingKeywords: true
  })
})

export type SuggestionRequest = z.infer<typeof suggestionRequestSchema>

/**
 * Single suggestion
 */
export interface Suggestion {
  id: string
  text: string
  toneTag: 'professional' | 'friendly' | 'concise'
}

/**
 * Suggestion response
 */
export interface SuggestionResponse {
  suggestions: Suggestion[]
  provider: 'claude' | 'openai' | 'fallback'
  cached: boolean
}

/**
 * Provider configuration
 */
export interface SuggestionParams {
  text: string
  locale: string
  industry?: string
  title?: string
  description?: string
  keywords: string[]
  missing: string[]
  refresh?: boolean
  temperature?: number
  seed?: number
  filters: {
    requireNumber?: boolean
    requireVerb?: boolean
    wordMin?: number
    wordMax?: number
    star?: boolean
    injectMissingKeywords?: boolean
    diversity?: boolean
  }
}
