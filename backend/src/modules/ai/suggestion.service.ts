/**
 * AI Suggestion service
 * Orchestrates multiple LLM providers with fallback strategy and caching
 */

import type { Suggestion, SuggestionParams, SuggestionResponse } from './ai.schemas.js'
import { ClaudeProvider } from './providers/claude.provider.js'
import { OpenAIProvider } from './providers/openai.provider.js'
import { FallbackProvider } from './providers/fallback.provider.js'
import type { LLMProvider } from './providers/llm-provider.interface.js'
import { createModuleLogger } from '../../shared/utils/logger.js'
import { ExternalServiceError } from '../../shared/utils/errors.js'

const logger = createModuleLogger('ai-suggestion')

/**
 * Simple in-memory cache for suggestions
 * Key: hash of params, Value: { suggestions, timestamp }
 */
interface CacheEntry {
  suggestions: Suggestion[]
  provider: 'claude' | 'openai' | 'fallback'
  timestamp: number
}

const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds
const cache = new Map<string, CacheEntry>()

export class SuggestionService {
  private providers: {
    claude: ClaudeProvider
    openai: OpenAIProvider
    fallback: FallbackProvider
  }

  constructor() {
    this.providers = {
      claude: new ClaudeProvider(),
      openai: new OpenAIProvider(),
      fallback: new FallbackProvider()
    }

    logger.info({
      claudeAvailable: this.providers.claude.isAvailable(),
      openaiAvailable: this.providers.openai.isAvailable()
    }, 'AI Suggestion service initialized')
  }

  /**
   * Generate suggestions with provider fallback
   */
  async suggest(params: SuggestionParams): Promise<SuggestionResponse> {
    // Check cache first (unless refresh is requested)
    const cacheKey = this.getCacheKey(params)

    if (!params.refresh) {
      const cached = this.getFromCache(cacheKey)

      if (cached) {
        logger.debug({ cacheKey }, 'Returning cached suggestions')
        return {
          suggestions: cached.suggestions,
          provider: cached.provider,
          cached: true
        }
      }
    } else {
      logger.info('Cache bypass requested (refresh=true)')
    }

    // Try providers in order: Claude -> OpenAI -> Fallback
    const providers: Array<{ name: 'claude' | 'openai' | 'fallback'; instance: LLMProvider }> = [
      { name: 'claude', instance: this.providers.claude },
      { name: 'openai', instance: this.providers.openai },
      { name: 'fallback', instance: this.providers.fallback }
    ]

    for (const { name, instance } of providers) {
      if (!instance.isAvailable()) {
        logger.debug(`Provider ${name} not available, skipping`)
        continue
      }

      try {
        logger.info({
          provider: name,
          locale: params.locale,
          textLength: params.text.length
        }, 'Attempting suggestions with provider')

        const suggestions = await instance.suggest(params)

        // Validate we got at least one suggestion
        if (!suggestions || suggestions.length === 0) {
          logger.warn(`Provider ${name} returned no suggestions`)
          continue
        }

        // Cache the result
        this.setCache(cacheKey, {
          suggestions,
          provider: name,
          timestamp: Date.now()
        })

        logger.info(`Successfully generated ${suggestions.length} suggestions with ${name}`)

        return {
          suggestions,
          provider: name,
          cached: false
        }
      } catch (error) {
        logger.error({
          provider: name,
          error: error instanceof Error ? error.message : String(error)
        }, 'Provider failed')

        // If this is the last provider (fallback), re-throw
        if (name === 'fallback') {
          throw error
        }

        // Otherwise continue to next provider
        continue
      }
    }

    // Should never reach here because fallback always succeeds
    throw new ExternalServiceError('AI', 'All providers failed')
  }

  /**
   * Clear entire cache
   */
  clearCache(): void {
    cache.clear()
    logger.info('Suggestion cache cleared')
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now()
    let cleared = 0

    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        cache.delete(key)
        cleared++
      }
    }

    if (cleared > 0) {
      logger.debug(`Cleared ${cleared} expired cache entries`)
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: cache.size,
      ttl: CACHE_TTL
    }
  }

  /**
   * Generate cache key from params
   */
  private getCacheKey(params: SuggestionParams): string {
    // Simple hash based on key params including temperature and seed for diversity
    return JSON.stringify({
      text: params.text.toLowerCase().trim(),
      locale: params.locale,
      industry: params.industry,
      keywords: params.keywords.sort(),
      missing: params.missing.sort(),
      temperature: params.temperature ?? 'default',
      seed: params.seed ?? 'random'
    })
  }

  /**
   * Get from cache if not expired
   */
  private getFromCache(key: string): CacheEntry | null {
    const entry = cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      cache.delete(key)
      return null
    }

    return entry
  }

  /**
   * Set cache entry
   */
  private setCache(key: string, entry: CacheEntry): void {
    cache.set(key, entry)

    // Periodically clean expired entries
    if (Math.random() < 0.1) { // 10% chance
      this.clearExpiredCache()
    }
  }
}

export const suggestionService = new SuggestionService()
