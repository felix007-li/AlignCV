/**
 * Zod schemas for Job Description analysis
 */

import { z } from 'zod'

/**
 * Language detection request
 */
export const detectLanguageSchema = z.object({
  text: z.string().min(10, 'Text too short for language detection')
})

export type DetectLanguageInput = z.infer<typeof detectLanguageSchema>

/**
 * Keyword extraction request
 */
export const extractKeywordsSchema = z.object({
  text: z.string().min(10, 'Text too short for keyword extraction'),
  lang: z.enum(['en', 'es', 'pt', 'fr']).optional(),
  maxKeywords: z.number().min(5).max(50).default(20)
})

export type ExtractKeywordsInput = z.infer<typeof extractKeywordsSchema>

/**
 * Full JD analysis request
 */
export const analyzeJdSchema = z.object({
  jdText: z.string().min(50, 'Job description too short'),
  resumeText: z.string().optional(),
  locale: z.enum(['en', 'es-MX', 'es-AR', 'es-CL', 'pt-BR', 'fr-CA']).default('en')
})

export type AnalyzeJdInput = z.infer<typeof analyzeJdSchema>

/**
 * Language detection response
 */
export interface LanguageDetectionResult {
  language: 'en' | 'es' | 'pt' | 'fr'
  confidence: number
}

/**
 * Keyword extraction response
 */
export interface KeywordExtractionResult {
  keywords: string[]
  language: 'en' | 'es' | 'pt' | 'fr'
}

/**
 * Full JD analysis response
 */
export interface JdAnalysisResult {
  language: 'en' | 'es' | 'pt' | 'fr'
  keywords: string[]
  hardSkills: string[]
  softSkills: string[]
  atsRisks: string[]
  matchScore?: number // 0-100 if resume provided
  missingKeywords?: string[]
}
