import { Injectable } from '@angular/core';

export interface SuggestFilters {
  requireNumber?: boolean;
  requireVerb?: boolean;
  wordMin?: number;
  wordMax?: number;
  star?: boolean;
  injectMissingKeywords?: boolean;
}

export interface SuggestReq {
  lang?: 'en' | 'es' | 'pt' | 'fr';
  text: string;
  keywords?: string[];
  missing?: string[];
  filters?: SuggestFilters;
}

@Injectable({ providedIn: 'root' })
export class AiSuggestService {
  private openaiApiKey: string = '';

  constructor() {
    // Get OpenAI API key from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      this.openaiApiKey = localStorage.getItem('OPENAI_API_KEY') || '';
    }
  }

  async suggest(req: SuggestReq): Promise<string[]> {
    // Analytics tracking
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'ai_suggest_generate',
      filters: req.filters || {},
      len: (req.text || '').length
    });

    try {
      // Try backend API first (use localhost:3000 for development)
      const apiUrl = 'http://localhost:3000/api/ai/suggest';
      const r = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });

      if (r.ok) {
        const data = await r.json();
        (window as any).dataLayer.push({
          event: 'ai_suggest_view',
          count: (data.suggestions || []).length
        });
        return data.suggestions || [];
      }
    } catch (error) {
      console.warn('Backend API failed, trying OpenAI directly', error);
    }

    // Fallback to OpenAI direct call
    return this.getOpenAISuggestions(req);
  }

  private async getOpenAISuggestions(req: SuggestReq): Promise<string[]> {
    if (!this.openaiApiKey) {
      console.error('OpenAI API key not configured');
      return this.getFallbackSuggestions(req);
    }

    try {
      const prompt = this.buildPrompt(req);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume writer. Create improved, action-oriented bullet points for resume content. Return ONLY a JSON array of strings, each being a complete suggestion. Example: ["Led team of 5 engineers to deliver project 2 weeks ahead of schedule", "Improved system performance by 40% through optimization"]'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Parse JSON array from response
      const suggestions = JSON.parse(content);

      (window as any).dataLayer.push({
        event: 'ai_suggest_view',
        count: suggestions.length,
        source: 'openai'
      });

      return suggestions;
    } catch (error) {
      console.error('OpenAI API call failed', error);
      return this.getFallbackSuggestions(req);
    }
  }

  private buildPrompt(req: SuggestReq): string {
    let prompt = `Improve this resume content:\n"${req.text}"\n\n`;

    if (req.keywords && req.keywords.length > 0) {
      prompt += `Important keywords to incorporate: ${req.keywords.join(', ')}\n\n`;
    }

    if (req.missing && req.missing.length > 0) {
      prompt += `Try to naturally include these missing skills/keywords: ${req.missing.join(', ')}\n\n`;
    }

    prompt += 'Requirements:\n';
    if (req.filters?.requireVerb) {
      prompt += '- Start with strong action verbs (Led, Managed, Developed, Implemented, etc.)\n';
    }
    if (req.filters?.requireNumber) {
      prompt += '- Include quantifiable metrics and numbers\n';
    }
    if (req.filters?.wordMin || req.filters?.wordMax) {
      prompt += `- Keep length between ${req.filters.wordMin || 10} and ${req.filters.wordMax || 50} words\n`;
    }
    if (req.filters?.star) {
      prompt += '- Use STAR format (Situation, Task, Action, Result)\n';
    }

    prompt += '\nProvide 3-4 professional alternative versions.';

    return prompt;
  }

  private getFallbackSuggestions(req: SuggestReq): string[]  {
    const templates = [
      'Led cross-functional team to deliver high-impact project, resulting in 30% efficiency improvement',
      'Spearheaded initiative that increased user engagement by 45% through strategic implementation',
      'Collaborated with stakeholders to optimize processes, achieving measurable business outcomes'
    ];

    return templates.map(t => {
      if (req.keywords && req.keywords.length > 0) {
        return `${t} using ${req.keywords[0]}`;
      }
      return t;
    });
  }
}