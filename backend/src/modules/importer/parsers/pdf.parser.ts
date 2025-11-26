/**
 * PDF parser for resume import
 */

import pdfParse from 'pdf-parse'
import type { ImportedProfile, ImportedSection } from '../import.schemas.js'
import { createModuleLogger } from '../../../shared/utils/logger.js'
import { FileProcessingError } from '../../../shared/utils/errors.js'

const logger = createModuleLogger('pdf-parser')

export class PdfParser {
  async parse(buffer: Buffer): Promise<{ profile: ImportedProfile; sections: ImportedSection[] }> {
    try {
      const data = await pdfParse(buffer)
      const text = data.text

      logger.info({
        pages: data.numpages,
        textLength: text.length
      }, 'PDF parsed successfully')

      // Extract profile information
      const profile = this.extractProfile(text)

      // Extract sections
      const sections = this.extractSections(text)

      return { profile, sections }
    } catch (error) {
      logger.error({ error }, 'PDF parsing failed')
      throw new FileProcessingError('Failed to parse PDF file')
    }
  }

  private extractProfile(text: string): ImportedProfile {
    const profile: ImportedProfile = {}

    // Extract email (simple regex)
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)
    if (emailMatch) {
      profile.email = emailMatch[0]
    }

    // Extract phone (simple patterns)
    const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)
    if (phoneMatch) {
      profile.phone = phoneMatch[0]
    }

    // Extract name (first few lines, heuristic)
    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length > 0) {
      profile.name = lines[0].trim()
    }

    return profile
  }

  private extractSections(text: string): ImportedSection[] {
    const sections: ImportedSection[] = []

    // Simple heuristic: split by common section headers
    const sectionHeaders = /^(experience|education|skills|summary|work history|employment)/im
    const lines = text.split('\n')

    let currentSection: ImportedSection | null = null
    let currentContent: string[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      if (sectionHeaders.test(trimmed)) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          currentSection.content = currentContent.join('\n')
          sections.push(currentSection)
        }

        // Start new section
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

    // Save last section
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

export const pdfParser = new PdfParser()
