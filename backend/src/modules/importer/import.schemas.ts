/**
 * Schemas for resume import
 */

import { z } from 'zod'

export interface ImportedProfile {
  name?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
}

export interface ImportedSection {
  title: string
  content: string
  type: 'experience' | 'education' | 'skills' | 'other'
  startDate?: string
  endDate?: string
  organization?: string
}

export interface ImportResult {
  profile: ImportedProfile
  sections: ImportedSection[]
  meta: {
    source: 'pdf' | 'docx' | 'linkedin'
    importedAt: string
    fileName?: string
  }
}
