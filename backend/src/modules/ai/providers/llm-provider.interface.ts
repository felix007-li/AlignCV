/**
 * LLM Provider interface
 * All AI providers must implement this interface
 */

import type { Suggestion, SuggestionParams } from '../ai.schemas.js'

export interface LLMProvider {
  /**
   * Provider name (for logging/debugging)
   */
  readonly name: string

  /**
   * Generate suggestions based on input
   */
  suggest(params: SuggestionParams): Promise<Suggestion[]>

  /**
   * Check if provider is available (has API key configured)
   */
  isAvailable(): boolean
}

/**
 * Build prompt for LLM with emphasis on diversity
 */
export function buildPrompt(params: SuggestionParams): string {
  const { text, locale, keywords, missing, filters } = params

  // Add diversity instructions if requested
  if (filters.diversity) {
    return `Generate 3 COMPLETELY DIFFERENT resume bullet points in ${locale} based on: "${text}".

IMPORTANT: Each suggestion must focus on a DIFFERENT aspect:
1. First bullet: Focus on technical skills and technologies used
2. Second bullet: Focus on measurable impact, results, and metrics
3. Third bullet: Focus on collaboration, leadership, or problem-solving approach

Requirements for ALL bullets:
- Start with different strong action verbs (e.g., Architected, Spearheaded, Optimized, Delivered, Led)
- Keep ${filters.wordMin}-${filters.wordMax} words
- Include specific numbers/metrics when possible
- Use varied sentence structures and phrasing
${keywords.length > 0 ? `- Incorporate these keywords naturally: ${keywords.join(', ')}` : ''}
${missing.length > 0 ? `- Try to include: ${missing.join(', ')}` : ''}

Output format: Plain list, one bullet per line, no numbering or extra text.`
  }

  // Default prompt (backward compatible)
  return `Write 3 concise resume bullet variants in ${locale} for: "${text}".
- Begin with strong action verbs.
- Keep ${filters.wordMin}-${filters.wordMax} words.
- Include a number/metric if missing.
- If possible, include keywords: ${keywords.join(', ')}; and inject missing: ${missing.join(', ')}.
- Output as plain list, one per line, no extra commentary.`
}
