export function tokensToCssVars(tokens) {
    const paletteColors = {
        blue: '#2563eb',
        green: '#059669',
        rose: '#e11d48',
        purple: '#7c3aed',
        orange: '#ea580c',
        teal: '#0d9488'
    };
    return {
        '--font-family': tokens.fontFamily,
        '--font-size': `${tokens.fontSize}px`,
        '--line-height': String(tokens.lineHeight),
        '--color-accent': paletteColors[tokens.palette] || paletteColors.blue,
        '--color-text': '#1f2937',
        '--color-text-secondary': '#6b7280'
    };
}
export function applyCssVars(tokens, element = document.documentElement) {
    const cssVars = tokensToCssVars(tokens);
    Object.entries(cssVars).forEach(([property, value]) => {
        element.style.setProperty(property, value);
    });
}
//# sourceMappingURL=tokens-to-css-vars.js.map