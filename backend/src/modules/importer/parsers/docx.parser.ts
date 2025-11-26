/**
 * DOCX parser for resume import
 */

import mammoth from 'mammoth'
import type { ImportedProfile, ImportedSection } from '../import.schemas.js'
import { createModuleLogger } from '../../../shared/utils/logger.js'
import { FileProcessingError } from '../../../shared/utils/errors.js'

const logger = createModuleLogger('docx-parser')

export class DocxParser {
  async parse(buffer: Buffer): Promise<{ profile: ImportedProfile; sections: ImportedSection[] }> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      const text = result.value

      logger.info({
        textLength: text.length
      }, 'DOCX parsed successfully')

      const profile = this.extractProfile(text)
      const sections = this.extractSections(text)

      return { profile, sections }
    } catch (error) {
      logger.error({ error }, 'DOCX parsing failed')
      throw new FileProcessingError('Failed to parse DOCX file')
    }
  }

  private extractProfile(text: string): ImportedProfile {
    const profile: ImportedProfile = {}

    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)
    if (emailMatch) {
      profile.email = emailMatch[0]
    }

    const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)
    if (phoneMatch) {
      profile.phone = phoneMatch[0]
    }

    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length > 0) {
      profile.name = lines[0].trim()
    }

    return profile
  }

  private extractSections(text: string): ImportedSection[] {
    const sections: ImportedSection[] = []
    const sectionHeaders = /^(experience|education|skills|summary|work history|employment)/im
    const lines = text.split('\n')

    let currentSection: ImportedSection | null = null
    let currentContent: string[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      if (sectionHeaders.test(trimmed)) {
        if (currentSection && currentContent.length > 0) {
          currentSection.content = currentContent.join('\n')
          sections.push(currentSection)
        }

        const type = this.determineSectionType(trimmed)
        currentSection = {
          title: trimmed,
          content: '',
          type
        }
        currentContent = []
      } else if (currentSection) {
        currentContent.push(trimmed)
      }
    }

    if (currentSection && currentContent.length > 0) {
      currentSection.content = currentContent.join('\n')
      sections.push(currentSection)
    }

    return sections
  }

  private determineSectionType(title: string): ImportedSection['type'] {
    const lower = title.toLowerCase()
    if (lower.includes('experience') || lower.includes('work') || lower.includes('employment')) {
      return 'experience'
    }
    if (lower.includes('education')) {
      return 'education'
    }
    if (lower.includes('skill')) {
      return 'skills'
    }
    return 'other'
  }
}

export const docxParser = new DocxParser()
