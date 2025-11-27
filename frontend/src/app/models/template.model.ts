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
    // Typography
    '--font-family': t.fontFamily,
    '--font-size-body': t.fontSize.body + 'px',
    '--font-size-heading': t.fontSize.heading + 'px',
    '--font-size-small': t.fontSize.small + 'px',
    '--line-height': String(t.lineHeight),

    // Colors
    '--color-primary': t.palette.primary,
    '--color-text': t.palette.text,
    '--color-muted': t.palette.muted,
    '--color-bg': t.palette.bg,
    '--color-border': t.palette.border,

    // Layout
    '--layout-columns': String(t.layout.columns),
    '--sidebar-position': t.layout.sidebar || 'none',
    '--sidebar-width': t.layout.sidebarWidth || '0',
    '--header-align': t.layout.headerAlign,
    '--section-heading-style': t.layout.sectionHeadingStyle,
    '--bullet-style': t.layout.bulletStyle,

    // Spacing
    '--spacing-section': t.spacing.section + 'px',
    '--spacing-item': t.spacing.item + 'px'
  };
}
