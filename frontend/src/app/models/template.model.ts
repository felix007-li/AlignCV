/**
 * Template Model and Metadata
 */

export interface TemplateMetadata {
  id: string;
  label: string;
  origin: string;
  source_url: string;
  style_tags: string[];
  industry_tags: string[];
}

export interface TemplateTokens {
  fontFamily: string;
  fontSize: { body: number; heading: number; small: number };
  lineHeight: number;
  palette: { primary: string; text: string; muted: string; bg: string; border: string };
  layout: {
    columns: 1 | 2;
    sidebar?: 'left' | 'right' | null;
    sidebarWidth?: string | null;
    headerAlign: 'left' | 'center' | 'right';
    sectionHeadingStyle: 'rule' | 'caps' | 'pill' | 'bar';
    bulletStyle: 'dot' | 'dash' | 'none';
  };
  spacing: { section: number; item: number };
  letter: { marginTop: number; marginSides: number; signatureGap: number };
}

export interface Template {
  metadata: TemplateMetadata;
  tokens: TemplateTokens;
  thumbnailUrl: string;
}

/**
 * Convert template tokens to CSS custom properties
 */
export function tokensToCssVars(t: TemplateTokens): Record<string, string> {
  return {
    '--font-family': t.fontFamily,
    '--fs-body': t.fontSize.body + 'px',
    '--fs-heading': t.fontSize.heading + 'px',
    '--fs-small': t.fontSize.small + 'px',
    '--lh': String(t.lineHeight),
    '--color-primary': t.palette.primary,
    '--color-text': t.palette.text,
    '--color-muted': t.palette.muted,
    '--color-bg': t.palette.bg,
    '--color-border': t.palette.border,
    '--columns': String(t.layout.columns),
    '--sidebar': String(t.layout.sidebar || ''),
    '--sidebar-width': t.layout.sidebarWidth || '',
    '--header-align': t.layout.headerAlign,
    '--heading-style': t.layout.sectionHeadingStyle,
    '--bullet-style': t.layout.bulletStyle,
    '--space-section': t.spacing.section + 'px',
    '--space-item': t.spacing.item + 'px'
  };
}
