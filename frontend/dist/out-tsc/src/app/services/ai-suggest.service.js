var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let AiSuggestService = class AiSuggestService {
    constructor() {
        this.openaiApiKey = '';
        // Get OpenAI API key from localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
            this.openaiApiKey = localStorage.getItem('OPENAI_API_KEY') || '';
        }
    }
    async suggest(req) {
        // Analytics tracking
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
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
                window.dataLayer.push({
                    event: 'ai_suggest_view',
                    count: (data.suggestions || []).length
                });
                return data.suggestions || [];
            }
        }
        catch (error) {
            console.warn('Backend API failed, trying OpenAI directly', error);
        }
        // Fallback to OpenAI direct call
        return this.getOpenAISuggestions(req);
    }
    async getOpenAISuggestions(req) {
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
            window.dataLayer.push({
                event: 'ai_suggest_view',
                count: suggestions.length,
                source: 'openai'
            });
            return suggestions;
        }
        catch (error) {
            console.error('OpenAI API call failed', error);
            return this.getFallbackSuggestions(req);
        }
    }
    buildPrompt(req) {
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
    getFallbackSuggestions(req) {
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
};
AiSuggestService = __decorate([
    Injectable({ providedIn: 'root' })
], AiSuggestService);
export { AiSuggestService };
//# sourceMappingURL=ai-suggest.service.js.map