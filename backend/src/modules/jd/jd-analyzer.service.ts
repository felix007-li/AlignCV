/**
 * Job Description analyzer service
 * Language detection, keyword extraction, ATS analysis
 */

import type {
  LanguageDetectionResult,
  KeywordExtractionResult,
  JdAnalysisResult
} from './jd.schemas.js'
import { createModuleLogger } from '../../shared/utils/logger.js'

const logger = createModuleLogger('jd-analyzer')

/**
 * Language-specific stopwords
 */
const STOPWORDS: Record<string, Set<string>> = {
  en: new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'this', 'that', 'these', 'those']),
  es: new Set(['el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'pero', 'es', 'son', 'fue', 'fueron', 'ser', 'estar', 'tener', 'hacer', 'de', 'en', 'para', 'con', 'por', 'como', 'este', 'ese', 'aquel']),
  pt: new Set(['o', 'a', 'os', 'as', 'um', 'uma', 'e', 'ou', 'mas', 'é', 'são', 'foi', 'foram', 'ser', 'estar', 'ter', 'fazer', 'de', 'em', 'para', 'com', 'por', 'como', 'este', 'esse', 'aquele']),
  fr: new Set(['le', 'la', 'les', 'un', 'une', 'et', 'ou', 'mais', 'est', 'sont', 'était', 'étaient', 'être', 'avoir', 'faire', 'de', 'en', 'pour', 'avec', 'par', 'comme', 'ce', 'cet', 'cette'])
}

/**
 * Soft skills dictionary (multilingual)
 */
const SOFT_SKILLS = new Set([
  'communication', 'comunicación', 'comunicação', 'communication',
  'leadership', 'liderazgo', 'liderança', 'leadership',
  'teamwork', 'trabajo en equipo', 'trabalho em equipe', 'travail d\'équipe',
  'problem solving', 'resolución de problemas', 'resolução de problemas', 'résolution de problèmes',
  'adaptability', 'adaptabilidad', 'adaptabilidade', 'adaptabilité',
  'critical thinking', 'pensamiento crítico', 'pensamento crítico', 'pensée critique',
  'collaboration', 'colaboración', 'colaboração', 'collaboration'
])

/**
 * Industry-specific technical skills
 */
const TECH_SKILLS = new Set([
  'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
  'node.js', 'aws', 'azure', 'docker', 'kubernetes', 'sql', 'nosql',
  'git', 'agile', 'scrum', 'ci/cd', 'rest', 'graphql', 'api'
])

export class JdAnalyzerService {
  /**
   * Detect language of text
   */
  detectLanguage(text: string): LanguageDetectionResult {
    const lowerText = text.toLowerCase()

    // Language indicators (common words/patterns)
    const indicators = {
      es: ['experiencia', 'conocimientos', 'requisitos', 'responsabilidades', 'años'],
      pt: ['experiência', 'conhecimentos', 'requisitos', 'responsabilidades', 'anos'],
      fr: ['expérience', 'connaissances', 'exigences', 'responsabilités', 'années'],
      en: ['experience', 'knowledge', 'requirements', 'responsibilities', 'years']
    }

    const scores = {
      en: 0,
      es: 0,
      pt: 0,
      fr: 0
    }

    // Count indicator matches
    for (const [lang, words] of Object.entries(indicators)) {
      for (const word of words) {
        if (lowerText.includes(word)) {
          scores[lang as keyof typeof scores]++
        }
      }
    }

    // Find language with highest score
    const detectedLang = Object.entries(scores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0] as 'en' | 'es' | 'pt' | 'fr'

    const maxScore = Math.max(...Object.values(scores))
    const confidence = maxScore > 0 ? maxScore / 10 : 0.5

    logger.debug({ language: detectedLang, confidence, scores }, 'Language detected')

    return {
      language: detectedLang,
      confidence: Math.min(confidence, 1.0)
    }
  }

  /**
   * Extract keywords using simplified TF-IDF
   */
  extractKeywords(text: string, lang: 'en' | 'es' | 'pt' | 'fr', maxKeywords = 20): string[] {
    // Tokenize and clean
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)

    const stopwords = STOPWORDS[lang] || STOPWORDS.en

    // Filter stopwords
    const filtered = tokens.filter(word => !stopwords.has(word))

    // Count term frequency
    const termFreq = new Map<string, number>()
    for (const token of filtered) {
      termFreq.set(token, (termFreq.get(token) || 0) + 1)
    }

    // Sort by frequency and take top N
    const keywords = Array.from(termFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word)

    logger.debug({ count: keywords.length, lang }, 'Keywords extracted')

    return keywords
  }

  /**
   * Full JD analysis
   */
  async analyze(jdText: string, resumeText?: string): Promise<JdAnalysisResult> {
    // Detect language
    const { language } = this.detectLanguage(jdText)

    // Extract keywords
    const keywords = this.extractKeywords(jdText, language, 30)

    // Identify hard skills (technical)
    const hardSkills = keywords.filter(kw =>
      TECH_SKILLS.has(kw) || this.isTechnicalTerm(kw)
    )

    // Identify soft skills
    const jdLower = jdText.toLowerCase()
    const softSkills = Array.from(SOFT_SKILLS)
      .filter(skill => jdLower.includes(skill.toLowerCase()))
      .slice(0, 10)

    // ATS risk detection
    const atsRisks = this.detectAtsRisks(jdText)

    // If resume provided, calculate match score
    let matchScore: number | undefined
    let missingKeywords: string[] | undefined

    if (resumeText) {
      const resumeTokens = new Set(
        resumeText.toLowerCase().split(/\s+/)
      )

      const matched = keywords.filter(kw => resumeTokens.has(kw))
      matchScore = Math.round((matched.length / keywords.length) * 100)

      missingKeywords = keywords.filter(kw => !resumeTokens.has(kw)).slice(0, 15)
    }

    logger.info({
      language,
      keywordCount: keywords.length,
      hardSkillsCount: hardSkills.length,
      matchScore
    }, 'JD analysis completed')

    return {
      language,
      keywords: keywords.slice(0, 20),
      hardSkills: hardSkills.slice(0, 15),
      softSkills,
      atsRisks,
      matchScore,
      missingKeywords
    }
  }

  /**
   * Check if term is technical
   */
  private isTechnicalTerm(term: string): boolean {
    // Common patterns for technical terms
    return /^[a-z]+\.[a-z]+$/.test(term) || // node.js, asp.net
           /^[a-z]+\d+$/.test(term) || // python3, angular17
           term.includes('++') // c++
  }

  /**
   * Detect ATS (Applicant Tracking System) risks
   */
  private detectAtsRisks(text: string): string[] {
    const risks: string[] = []

    // Check length
    if (text.length < 200) {
      risks.push('Job description is very short')
    }

    // Check for specific requirements
    if (!text.toLowerCase().includes('year') && !text.toLowerCase().includes('experience')) {
      risks.push('No clear experience requirements')
    }

    // Check for buzzwords without substance
    const buzzwordCount = (text.match(/innovative|dynamic|passionate|rockstar|ninja/gi) || []).length
    if (buzzwordCount > 5) {
      risks.push('Too many buzzwords, lacks specific requirements')
    }

    return risks
  }
}

export const jdAnalyzerService = new JdAnalyzerService()
