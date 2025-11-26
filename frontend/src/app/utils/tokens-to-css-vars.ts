export interface TemplateTokens {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  palette: string;
}

export function tokensToCssVars(tokens: TemplateTokens): Record<string, string> {
  const paletteColors: Record<string, string> = {
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

export function applyCssVars(tokens: TemplateTokens, element: HTMLElement = document.documentElement): void {
  const cssVars = tokensToCssVars(tokens);
  
  Object.entries(cssVars).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
}