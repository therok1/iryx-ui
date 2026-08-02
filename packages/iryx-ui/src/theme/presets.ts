export interface ThemeColors {
  background?: string
  foreground?: string
  primary?: string
  primaryForeground?: string
  /** Top stop of the solid button's vertical gradient. */
  primaryFrom?: string
  /** Bottom stop of the solid button's vertical gradient. */
  primaryTo?: string
  accent?: string
  accentForeground?: string
  muted?: string
  mutedForeground?: string
  border?: string
}

/** A theme provides token values per appearance mode. Omitted tokens keep the defaults from theme.css. */
export interface Theme {
  light: ThemeColors
  dark: ThemeColors
}

const TOKEN_VARS: Record<keyof ThemeColors, string> = {
  background: '--iryx-background',
  foreground: '--iryx-foreground',
  primary: '--iryx-primary',
  primaryForeground: '--iryx-primary-foreground',
  primaryFrom: '--iryx-primary-from',
  primaryTo: '--iryx-primary-to',
  accent: '--iryx-accent',
  accentForeground: '--iryx-accent-foreground',
  muted: '--iryx-muted',
  mutedForeground: '--iryx-muted-foreground',
  border: '--iryx-border',
}

/**
 * Built-in theme presets. Each swaps only the brand primary (solid colour +
 * gradient stops); neutral surfaces stay on the shadcn-style palette from
 * theme.css, so every theme shares the same chrome.
 */
export const themes = {
  violet: {
    light: {
      primary: 'oklch(0.59 0.2 277.19)',
      primaryForeground: 'oklch(0.985 0.005 248)',
      primaryFrom: 'oklch(0.59 0.2 277.19)',
      primaryTo: 'oklch(0.51 0.23 276.99)',
    },
    dark: {
      primary: 'oklch(0.62 0.22 293)',
      primaryForeground: 'oklch(0.985 0.005 248)',
      primaryFrom: 'oklch(0.62 0.22 293)',
      primaryTo: 'oklch(0.54 0.24 293)',
    },
  },
  emerald: {
    light: {
      primary: 'oklch(0.596 0.145 163)',
      primaryForeground: 'oklch(0.985 0.005 248)',
      primaryFrom: 'oklch(0.596 0.145 163)',
      primaryTo: 'oklch(0.52 0.155 163)',
    },
    dark: {
      primary: 'oklch(0.7 0.15 162)',
      primaryForeground: 'oklch(0.17 0.04 165)',
      primaryFrom: 'oklch(0.7 0.15 162)',
      primaryTo: 'oklch(0.62 0.16 162)',
    },
  },
  rose: {
    light: {
      primary: 'oklch(0.586 0.222 17)',
      primaryForeground: 'oklch(0.985 0.005 248)',
      primaryFrom: 'oklch(0.586 0.222 17)',
      primaryTo: 'oklch(0.51 0.235 17)',
    },
    dark: {
      primary: 'oklch(0.65 0.22 16)',
      primaryForeground: 'oklch(0.985 0.005 248)',
      primaryFrom: 'oklch(0.65 0.22 16)',
      primaryTo: 'oklch(0.57 0.235 16)',
    },
  },
  amber: {
    light: {
      primary: 'oklch(0.666 0.157 58)',
      primaryForeground: 'oklch(0.16 0.03 80)',
      primaryFrom: 'oklch(0.666 0.157 58)',
      primaryTo: 'oklch(0.59 0.165 56)',
    },
    dark: {
      primary: 'oklch(0.77 0.16 70)',
      primaryForeground: 'oklch(0.18 0.04 75)',
      primaryFrom: 'oklch(0.77 0.16 70)',
      primaryTo: 'oklch(0.7 0.17 68)',
    },
  },
  sky: {
    light: {
      primary: 'oklch(0.588 0.13 242)',
      primaryForeground: 'oklch(0.985 0.005 248)',
      primaryFrom: 'oklch(0.588 0.13 242)',
      primaryTo: 'oklch(0.51 0.14 242)',
    },
    dark: {
      primary: 'oklch(0.685 0.14 237)',
      primaryForeground: 'oklch(0.15 0.04 240)',
      primaryFrom: 'oklch(0.685 0.14 237)',
      primaryTo: 'oklch(0.6 0.15 237)',
    },
  },
} satisfies Record<string, Theme>

export type ThemePresetName = keyof typeof themes

const STYLE_ID = 'iryx-ui-theme'

function declarations(colors: ThemeColors): string {
  return (Object.keys(colors) as (keyof ThemeColors)[])
    .filter(token => colors[token] != null)
    .map(token => `${TOKEN_VARS[token]}: ${colors[token]};`)
    .join(' ')
}

/**
 * Apply a theme at runtime by injecting a stylesheet that overrides the
 * Iryx token variables for both light (`:root`) and dark (`.dark`) modes.
 * Pass a preset name or a custom {@link Theme}. No-op during SSR.
 */
export function applyTheme(theme: Theme | ThemePresetName): void {
  if (typeof document === 'undefined')
    return
  const resolved = typeof theme === 'string' ? themes[theme] : theme
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }
  style.textContent = `:root { ${declarations(resolved.light)} }\n.dark { ${declarations(resolved.dark)} }`
}

/** Remove a theme applied with {@link applyTheme}, restoring theme.css defaults. */
export function clearTheme(): void {
  if (typeof document === 'undefined')
    return
  document.getElementById(STYLE_ID)?.remove()
}
