/**
 * Template Model and Metadata
 */
/**
 * Convert template tokens to CSS custom properties
 */
export function tokensToCssVars(t) {
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
//# sourceMappingURL=template.model.js.map