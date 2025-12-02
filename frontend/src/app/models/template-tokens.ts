import { TemplateTokens } from './template.model';
import { TEMPLATE_TOKENS as TEMPLATE_TOKEN_MAP } from './template-tokens.data';

// Re-export tokens and type so callers can import from a single location
export type { TemplateTokens };
export const TEMPLATE_TOKENS: Record<string, TemplateTokens> = TEMPLATE_TOKEN_MAP;
