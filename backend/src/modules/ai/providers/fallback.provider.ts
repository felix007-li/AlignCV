/**
 * Fallback provider
 * Template-based suggestions when LLM APIs are unavailable
 */

import type { LLMProvider } from './llm-provider.interface.js'
import type { Suggestion, SuggestionParams } from '../ai.schemas.js'
import { createModuleLogger } from '../../../shared/utils/logger.js'

const logger = createModuleLogger('fallback-provider')

/**
 * Action verb templates by industry
 */
const ACTION_VERBS = {
  tech: ['Developed', 'Implemented', 'Architected', 'Optimized', 'Engineered', 'Built', 'Designed', 'Deployed', 'Refactored', 'Automated'],
  business: ['Managed', 'Led', 'Coordinated', 'Executed', 'Delivered', 'Achieved', 'Spearheaded', 'Orchestrated', 'Directed', 'Supervised'],
  finance: ['Analyzed', 'Forecasted', 'Audited', 'Assessed', 'Evaluated', 'Calculated', 'Modeled', 'Reconciled', 'Optimized', 'Projected'],
  marketing: ['Launched', 'Created', 'Designed', 'Promoted', 'Increased', 'Drove', 'Executed', 'Orchestrated', 'Expanded', 'Amplified'],
  healthcare: ['Provided', 'Administered', 'Improved', 'Maintained', 'Monitored', 'Ensured', 'Coordinated', 'Delivered', 'Enhanced', 'Facilitated'],
  sales: ['Generated', 'Closed', 'Negotiated', 'Secured', 'Exceeded', 'Achieved', 'Cultivated', 'Expanded', 'Converted', 'Drove'],
  education: ['Taught', 'Mentored', 'Developed', 'Facilitated', 'Designed', 'Evaluated', 'Coached', 'Guided', 'Instructed', 'Trained'],
  default: ['Performed', 'Handled', 'Managed', 'Completed', 'Contributed', 'Supported', 'Executed', 'Delivered', 'Achieved', 'Improved']
}

/**
 * Context templates by role/title keywords
 */
const ROLE_CONTEXTS = {
  engineer: ['complex technical solutions', 'scalable systems', 'high-performance applications', 'innovative features', 'robust architectures'],
  developer: ['user-facing features', 'application functionality', 'code quality improvements', 'technical implementations', 'software solutions'],
  manager: ['cross-functional teams', 'strategic initiatives', 'operational excellence', 'business objectives', 'team performance'],
  analyst: ['data-driven insights', 'comprehensive reports', 'analytical frameworks', 'business intelligence', 'actionable recommendations'],
  designer: ['user experiences', 'visual interfaces', 'design systems', 'creative solutions', 'brand consistency'],
  consultant: ['client solutions', 'strategic recommendations', 'business transformations', 'best practices', 'process improvements'],
  lead: ['technical direction', 'team mentorship', 'architectural decisions', 'project delivery', 'quality standards'],
  senior: ['advanced solutions', 'strategic initiatives', 'technical excellence', 'industry best practices', 'complex challenges'],
  specialist: ['domain expertise', 'specialized solutions', 'technical proficiency', 'subject matter knowledge', 'expert guidance'],
  coordinator: ['project logistics', 'stakeholder alignment', 'workflow optimization', 'team coordination', 'resource management'],
  director: ['organizational strategy', 'departmental leadership', 'business growth', 'executive alignment', 'strategic vision']
}

/**
 * Achievement templates by role level
 */
const ACHIEVEMENTS = {
  junior: ['contributing to team success', 'learning and applying new technologies', 'delivering quality work', 'supporting project goals', 'collaborating effectively'],
  mid: ['driving project outcomes', 'improving team processes', 'mentoring junior members', 'solving complex problems', 'delivering measurable results'],
  senior: ['leading strategic initiatives', 'architecting scalable solutions', 'driving organizational impact', 'establishing best practices', 'delivering transformative results']
}

/**
 * Metrics templates with variety
 */
const METRICS = [
  'by 25%',
  'by 40%',
  'for 100+ users',
  'for 500+ customers',
  'resulting in $50K savings',
  'resulting in $200K revenue increase',
  'across 3 teams',
  'across 5 departments',
  'within 6 months',
  'within 3 weeks',
  'improving efficiency by 30%',
  'reducing costs by 20%',
  'increasing productivity by 35%',
  'enhancing user satisfaction by 45%'
]

export class FallbackProvider implements LLMProvider {
  readonly name = 'fallback'

  isAvailable(): boolean {
    return true // Always available
  }

  async suggest(params: SuggestionParams): Promise<Suggestion[]> {
    logger.info({
      locale: params.locale,
      industry: params.industry,
      title: params.title,
      hasDescription: !!params.description
    }, 'Using fallback provider for suggestions')

    const industry = params.industry?.toLowerCase() || 'default'
    const verbs = ACTION_VERBS[industry as keyof typeof ACTION_VERBS] || ACTION_VERBS.default

    // Extract role context from title
    const roleContext = this.extractRoleContext(params.title)
    const achievementLevel = this.extractLevel(params.title)

    // Extract additional context from description
    const descriptionContext = this.extractDescriptionKeywords(params.description)

    const suggestions: Suggestion[] = []

    // Generate 3 diverse, title-aware suggestions
    for (let i = 0; i < 3; i++) {
      let text = this.generateSuggestion({
        originalText: params.text,
        verb: verbs[i * 3 % verbs.length], // More variety in verb selection
        metric: METRICS[i * 2 % METRICS.length],
        roleContext: roleContext[i % roleContext.length],
        achievement: achievementLevel ? achievementLevel[i % achievementLevel.length] : null,
        keywords: params.keywords,
        missing: params.missing,
        descriptionContext,
        filters: params.filters,
        variant: i
      })

      // Ensure word count is within range
      text = this.adjustWordCount(text, params.filters.wordMin || 10, params.filters.wordMax || 22)

      suggestions.push({
        id: `fallback-${Date.now()}-${i}`,
        text,
        toneTag: i === 0 ? 'professional' : i === 1 ? 'concise' : 'friendly'
      })
    }

    return suggestions
  }

  /**
   * Generate a single suggestion with enhanced context
   */
  private generateSuggestion(options: {
    originalText: string
    verb: string
    metric: string
    roleContext: string
    achievement: string | null
    keywords: string[]
    missing: string[]
    descriptionContext: string[]
    filters: SuggestionParams['filters']
    variant: number
  }): string {
    const { originalText, verb, metric, roleContext, achievement, keywords, missing, descriptionContext, filters, variant } = options

    let text = originalText.trim()

    // Variant 0: Enhanced with role context and description
    if (variant === 0) {
      if (!this.startsWithVerb(text)) {
        text = `${verb} ${text.toLowerCase()}`
      }

      // Add description-specific context if available
      if (descriptionContext.length > 0) {
        const contextWord = descriptionContext[0]
        if (!text.toLowerCase().includes(contextWord.toLowerCase())) {
          text = `${text} for ${contextWord}`
        }
      } else if (!text.includes(roleContext)) {
        // Fallback to role context
        text = `${text} focusing on ${roleContext}`
      }

      // Add metric if required
      if (filters.requireNumber && !this.hasNumber(text)) {
        text = `${text} ${metric}`
      }
    }
    // Variant 1: Achievement-focused with description insights
    else if (variant === 1) {
      if (!this.startsWithVerb(text)) {
        text = `${verb} ${text.toLowerCase()}`
      }

      // Incorporate description context into achievement
      if (descriptionContext.length > 1 && !text.toLowerCase().includes(descriptionContext[1].toLowerCase())) {
        text = `${text} in ${descriptionContext[1]}`
      } else if (achievement && !text.includes('result') && !text.includes('achiev')) {
        text = `${text}, ${achievement}`
      }

      // Add metric
      if (filters.requireNumber && !this.hasNumber(text)) {
        text = `${text} ${metric}`
      }
    }
    // Variant 2: Keyword-rich with description integration
    else {
      if (!this.startsWithVerb(text)) {
        text = `${verb} ${text.toLowerCase()}`
      }

      // Prioritize description context over missing keywords
      if (descriptionContext.length > 0) {
        const descContext = descriptionContext[variant % descriptionContext.length]
        if (!text.toLowerCase().includes(descContext.toLowerCase())) {
          text = `${text} leveraging ${descContext}`
        }
      } else if (filters.injectMissingKeywords && missing.length > 0) {
        const keyword = missing[variant % missing.length]
        if (!text.toLowerCase().includes(keyword.toLowerCase())) {
          text = `${text} leveraging ${keyword}`
        }
      }

      // Add context and metric
      if (filters.requireNumber && !this.hasNumber(text)) {
        text = `${text} for ${roleContext} ${metric}`
      }
    }

    return text
  }

  /**
   * Extract role context from title
   */
  private extractRoleContext(title?: string): string[] {
    if (!title) {
      return ['business initiatives', 'project outcomes', 'team objectives']
    }

    const titleLower = title.toLowerCase()

    // Check for role keywords
    for (const [roleKey, contexts] of Object.entries(ROLE_CONTEXTS)) {
      if (titleLower.includes(roleKey)) {
        return contexts
      }
    }

    // Default contexts
    return ['key projects', 'business goals', 'strategic outcomes']
  }

  /**
   * Extract seniority level from title
   */
  private extractLevel(title?: string): string[] | null {
    if (!title) return null

    const titleLower = title.toLowerCase()

    if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('director')) {
      return ACHIEVEMENTS.senior
    } else if (titleLower.includes('junior') || titleLower.includes('entry') || titleLower.includes('associate')) {
      return ACHIEVEMENTS.junior
    } else {
      return ACHIEVEMENTS.mid
    }
  }

  /**
   * Extract meaningful keywords from session description
   * This provides additional context beyond title and industry
   */
  private extractDescriptionKeywords(description?: string): string[] {
    if (!description || description.trim().length === 0) {
      return []
    }

    // Common stop words to filter out
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i',
      'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'our'
    ])

    // Extract words
    const words = description
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ') // Remove punctuation except hyphens
      .split(/\s+/)
      .filter(word =>
        word.length > 3 && // At least 4 characters
        !stopWords.has(word) &&
        !/^\d+$/.test(word) // Not just numbers
      )

    // Count frequency
    const frequency = new Map<string, number>()
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    })

    // Get top keywords by frequency, max 5
    const topKeywords = Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)

    return topKeywords
  }

  /**
   * Check if text starts with action verb
   */
  private startsWithVerb(text: string): boolean {
    const allVerbs = Object.values(ACTION_VERBS).flat()
    const firstWord = text.split(/\s+/)[0]
    return allVerbs.some(verb =>
      firstWord.toLowerCase().startsWith(verb.toLowerCase())
    )
  }

  /**
   * Check if text contains numbers
   */
  private hasNumber(text: string): boolean {
    return /\d+/.test(text)
  }

  /**
   * Adjust text to fit word count range
   */
  private adjustWordCount(text: string, min: number, max: number): string {
    const words = text.split(/\s+/)

    if (words.length < min) {
      // Too short - already enhanced with metrics/keywords
      return text
    }

    if (words.length > max) {
      // Too long - truncate intelligently
      return words.slice(0, max).join(' ')
    }

    return text
  }
}
