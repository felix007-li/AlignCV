import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface AISuggestion {
  id: string;
  text: string;
  type: 'improve' | 'expand' | 'simplify' | 'professional';
}

export interface AISuggestionRequest {
  section: string;
  currentText: string;
  jobDescription?: string;
  locale?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiSuggestionService {
  private apiUrl = '/api/ai/suggest';  // Your backend endpoint

  // Fallback to direct OpenAI call if backend not available
  private openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  private openaiApiKey = '';  // Will be set from environment

  constructor(private http: HttpClient) {
    // Try to get API key from environment or local storage
    this.openaiApiKey = this.getOpenAIKey();
  }

  private getOpenAIKey(): string {
    // Check if running in browser and get from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('OPENAI_API_KEY') || '';
    }
    return '';
  }

  /**
   * Get AI-powered suggestions for resume content
   */
  getSuggestions(request: AISuggestionRequest): Observable<AISuggestion[]> {
    // Try backend API first
    return this.http.post<{ suggestions: AISuggestion[] }>(this.apiUrl, request).pipe(
      map(response => response.suggestions),
      catchError(error => {
        console.warn('Backend API failed, falling back to direct OpenAI call', error);
        return this.getDirectOpenAISuggestions(request);
      })
    );
  }

  /**
   * Direct OpenAI API call (fallback)
   */
  private getDirectOpenAISuggestions(request: AISuggestionRequest): Observable<AISuggestion[]> {
    if (!this.openaiApiKey) {
      console.error('OpenAI API key not found');
      return of(this.getFallbackSuggestions(request));
    }

    const prompt = this.buildPrompt(request);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.openaiApiKey}`
    });

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer helping users improve their resume content. Provide 3-4 alternative suggestions for the given text, each with a different tone or approach. Return ONLY a JSON array of suggestions in this format: [{"id": "1", "text": "suggestion text", "type": "improve"}]'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    return this.http.post<any>(this.openaiApiUrl, body, { headers }).pipe(
      map(response => {
        try {
          const content = response.choices[0].message.content;
          const suggestions = JSON.parse(content);
          return suggestions.map((s: any, index: number) => ({
            id: s.id || String(index + 1),
            text: s.text,
            type: s.type || 'improve'
          }));
        } catch (e) {
          console.error('Failed to parse OpenAI response', e);
          return this.getFallbackSuggestions(request);
        }
      }),
      catchError(error => {
        console.error('OpenAI API call failed', error);
        return of(this.getFallbackSuggestions(request));
      })
    );
  }

  /**
   * Build prompt for OpenAI
   */
  private buildPrompt(request: AISuggestionRequest): string {
    let prompt = `Section: ${request.section}\n\nCurrent text:\n${request.currentText}\n\n`;

    if (request.jobDescription) {
      prompt += `Job description context:\n${request.jobDescription}\n\n`;
    }

    prompt += `Please provide 3-4 improved versions of this ${request.section} content. `;
    prompt += `Each suggestion should be:\n`;
    prompt += `1. Professional and concise\n`;
    prompt += `2. Action-oriented with strong verbs\n`;
    prompt += `3. Quantifiable when possible\n`;
    prompt += `4. Tailored to the job description if provided\n\n`;
    prompt += `Return suggestions as a JSON array.`;

    return prompt;
  }

  /**
   * Fallback suggestions (template-based)
   */
  private getFallbackSuggestions(request: AISuggestionRequest): AISuggestion[] {
    const templates: Record<string, string[]> = {
      summary: [
        'Results-driven professional with expertise in delivering high-impact solutions',
        'Experienced specialist focused on driving business growth and operational excellence',
        'Dynamic professional with a proven track record of achieving measurable results'
      ],
      experience: [
        'Led cross-functional team to deliver [project], resulting in [quantifiable outcome]',
        'Spearheaded initiative that improved [metric] by [percentage]',
        'Collaborated with stakeholders to implement [solution], achieving [result]'
      ],
      skills: [
        'Advanced proficiency in [skill] with [X] years of hands-on experience',
        'Expert-level knowledge of [technology/tool] applied in [context]',
        'Certified in [certification] with demonstrated expertise in [area]'
      ],
      education: [
        'Bachelor of Science in [Field], [University Name] - GPA: [X.XX]',
        'Master of [Degree] with focus on [Specialization]',
        'Relevant coursework: [Course 1], [Course 2], [Course 3]'
      ]
    };

    const sectionKey = request.section.toLowerCase();
    const templateTexts = templates[sectionKey] || templates.summary;

    return templateTexts.map((text, index) => ({
      id: String(index + 1),
      text,
      type: index === 0 ? 'professional' : index === 1 ? 'improve' : 'expand'
    }));
  }

  /**
   * Improve specific text with AI
   */
  improveText(text: string, context?: string): Observable<string> {
    const request: AISuggestionRequest = {
      section: 'general',
      currentText: text,
      jobDescription: context
    };

    return this.getSuggestions(request).pipe(
      map(suggestions => suggestions.length > 0 ? suggestions[0].text : text)
    );
  }

  /**
   * Generate bullet points from description
   */
  generateBulletPoints(description: string, count: number = 3): Observable<string[]> {
    if (!this.openaiApiKey) {
      return of(this.getFallbackBulletPoints(description, count));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.openaiApiKey}`
    });

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Convert the given description into concise, action-oriented bullet points. Start each bullet with a strong action verb. Return ONLY a JSON array of strings.'
        },
        {
          role: 'user',
          content: `Convert this description into ${count} professional bullet points:\n\n${description}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    };

    return this.http.post<any>(this.openaiApiUrl, body, { headers }).pipe(
      map(response => {
        try {
          const content = response.choices[0].message.content;
          return JSON.parse(content);
        } catch (e) {
          return this.getFallbackBulletPoints(description, count);
        }
      }),
      catchError(() => of(this.getFallbackBulletPoints(description, count)))
    );
  }

  private getFallbackBulletPoints(description: string, count: number): string[] {
    const bullets = [
      'Achieved measurable results through strategic initiatives',
      'Collaborated with cross-functional teams to deliver solutions',
      'Implemented process improvements that enhanced efficiency'
    ];
    return bullets.slice(0, count);
  }

  /**
   * Analyze resume against job description
   */
  analyzeMatch(resumeText: string, jobDescription: string): Observable<{
    score: number;
    missingKeywords: string[];
    suggestions: string[];
  }> {
    // This would ideally call your backend
    // For now, return a simple analysis
    return of({
      score: 75,
      missingKeywords: ['Python', 'AWS', 'Machine Learning'],
      suggestions: [
        'Add more quantifiable achievements',
        'Include relevant technical skills',
        'Tailor experience descriptions to job requirements'
      ]
    });
  }
}
