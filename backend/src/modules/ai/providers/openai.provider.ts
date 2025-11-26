/**
 * OpenAI provider
 * Uses GPT-4o-mini for resume suggestions (cost-effective fallback)
 */

import type { LLMProvider } from './llm-provider.interface.js'
import { buildPrompt } from './llm-provider.interface.js'
import type { Suggestion, SuggestionParams } from '../ai.schemas.js'
import { config } from '../../../shared/config/environment.js'
import { createModuleLogger } from '../../../shared/utils/logger.js'
import { ExternalServiceError } from '../../../shared/utils/errors.js'

const logger = createModuleLogger('openai-provider')

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenAIRequest {
  model: string
  messages: OpenAIMessage[]
  temperature?: number
  max_tokens?: number
  seed?: number
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class OpenAIProvider implements LLMProvider {
  readonly name = 'openai'
  private apiKey: string | undefined

  constructor() {
    this.apiKey = config.OPENAI_API_KEY
  }

  isAvailable(): boolean {
    return !!this.apiKey
  }

  async suggest(params: SuggestionParams): Promise<Suggestion[]> {
    if (!this.isAvailable()) {
      throw new ExternalServiceError('OpenAI', 'API key not configured')
    }

    try {
      const prompt = buildPrompt(params)

      const requestBody: OpenAIRequest = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: params.temperature ?? 0.8, // Use provided temperature or default to 0.8 for diversity
        max_tokens: 250,
        ...(params.seed !== undefined && { seed: params.seed }) // Add seed if provided
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey!}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error({
          status: response.status,
          error: errorText
        }, 'OpenAI API error')
        throw new ExternalServiceError('OpenAI', `API returned ${response.status}`)
      }

      const data: OpenAIResponse = await response.json()

      const text = data?.choices?.[0]?.message?.content || ''
      const lines = text
        .split(/\n+/)
        .map(l => l.replace(/^[-•*]\s?/, '').trim())
        .filter(Boolean)
        .slice(0, 5)

      logger.debug({
        count: lines.length,
        locale: params.locale
      }, 'OpenAI suggestions generated')

      return lines.map((text, idx) => ({
        id: `openai-${Date.now()}-${idx}`,
        text,
        toneTag: this.detectTone(text)
      }))
    } catch (error) {
      if (error instanceof ExternalServiceError) {
        throw error
      }

      logger.error({ error }, 'OpenAI provider error')
      throw new ExternalServiceError('OpenAI', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  private detectTone(text: string): 'professional' | 'friendly' | 'concise' {
    const wordCount = text.split(/\s+/).length

    if (wordCount <= 12) {
      return 'concise'
    }

    if (text.match(/\b(help|support|collaborate|team)\b/i)) {
      return 'friendly'
    }

    return 'professional'
  }
}
