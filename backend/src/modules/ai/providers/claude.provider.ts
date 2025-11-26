/**
 * Claude (Anthropic) AI provider
 * Uses Claude 3.5 Sonnet for resume suggestions
 */

import type { LLMProvider } from './llm-provider.interface.js'
import { buildPrompt } from './llm-provider.interface.js'
import type { Suggestion, SuggestionParams } from '../ai.schemas.js'
import { config } from '../../../shared/config/environment.js'
import { createModuleLogger } from '../../../shared/utils/logger.js'
import { ExternalServiceError } from '../../../shared/utils/errors.js'

const logger = createModuleLogger('claude-provider')

interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ClaudeRequest {
  model: string
  max_tokens: number
  messages: ClaudeMessage[]
  temperature?: number
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>
  stop_reason: string
}

export class ClaudeProvider implements LLMProvider {
  readonly name = 'claude'
  private apiKey: string | undefined

  constructor() {
    this.apiKey = config.ANTHROPIC_API_KEY
  }

  isAvailable(): boolean {
    return !!this.apiKey
  }

  async suggest(params: SuggestionParams): Promise<Suggestion[]> {
    if (!this.isAvailable()) {
      throw new ExternalServiceError('Claude', 'API key not configured')
    }

    try {
      const prompt = buildPrompt(params)

      // Claude API supports temperature 0-1, clamp if needed
      const temperature = Math.min(1.0, params.temperature ?? 0.8)

      const requestBody: ClaudeRequest = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature // Use provided temperature (clamped to 0-1) or default to 0.8
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error({
          status: response.status,
          error: errorText
        }, 'Claude API error')
        throw new ExternalServiceError('Claude', `API returned ${response.status}`)
      }

      const data: ClaudeResponse = await response.json()

      const text = data?.content?.[0]?.text || ''
      const lines = text
        .split(/\n+/)
        .map(l => l.replace(/^[-•*]\s?/, '').trim())
        .filter(Boolean)
        .slice(0, 5) // Take up to 5 suggestions

      logger.debug({
        count: lines.length,
        locale: params.locale
      }, 'Claude suggestions generated')

      return lines.map((text, idx) => ({
        id: `claude-${Date.now()}-${idx}`,
        text,
        toneTag: this.detectTone(text)
      }))
    } catch (error) {
      if (error instanceof ExternalServiceError) {
        throw error
      }

      logger.error({ error }, 'Claude provider error')
      throw new ExternalServiceError('Claude', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Detect tone of suggestion (simple heuristic)
   */
  private detectTone(text: string): 'professional' | 'friendly' | 'concise' {
    const wordCount = text.split(/\s+/).length

    if (wordCount <= 12) {
      return 'concise'
    }

    // Check for friendly indicators
    if (text.match(/\b(help|support|collaborate|team)\b/i)) {
      return 'friendly'
    }

    return 'professional'
  }
}
