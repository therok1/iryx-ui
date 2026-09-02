export interface ThemeColors {
  background?: string
  foreground?: string
  primary?: string
  primaryForeground?: string
  primaryFrom?: string
  primaryTo?: string
  accent?: string
  accentForeground?: string
  muted?: string
  mutedForeground?: string
  border?: string
  /*
   * Status colours. Each has five roles: the solid fill, text on that fill,
   * a tinted surface, text on that surface, and a border. Presets leave these
   * alone, but a custom theme can override them.
   */
  success?: string
  successForeground?: string
  successMuted?: string
  successMutedForeground?: string
  successBorder?: string
  warning?: string
  warningForeground?: string
  warningMuted?: string
  warningMutedForeground?: string
  warningBorder?: string
  danger?: string
  dangerForeground?: string
  dangerMuted?: string
  dangerMutedForeground?: string
  dangerBorder?: string
  info?: string
  infoForeground?: string
  infoMuted?: string
  infoMutedForeground?: string
  infoBorder?: string
}

/** A theme provides token values per appearance mode. Omitted tokens keep the defaults from theme.css. */
export interface Theme {
  light?: ThemeColors
  dark?: ThemeColors
  /**
   * Corner radius for the whole library — what `rounded-lg` resolves to, with
   * the rest of the scale derived from it. One value rather than one per mode:
   * corners do not change between light and dark.
   */
  radius?: string
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
  success: '--iryx-success',
  successForeground: '--iryx-success-foreground',
  successMuted: '--iryx-success-muted',
  successMutedForeground: '--iryx-success-muted-foreground',
  successBorder: '--iryx-success-border',
  warning: '--iryx-warning',
  warningForeground: '--iryx-warning-foreground',
  warningMuted: '--iryx-warning-muted',
  warningMutedForeground: '--iryx-warning-muted-foreground',
  warningBorder: '--iryx-warning-border',
  danger: '--iryx-danger',
  dangerForeground: '--iryx-danger-foreground',
  dangerMuted: '--iryx-danger-muted',
  dangerMutedForeground: '--iryx-danger-muted-foreground',
  dangerBorder: '--iryx-danger-border',
  info: '--iryx-info',
  infoForeground: '--iryx-info-foreground',
  infoMuted: '--iryx-info-muted',
  infoMutedForeground: '--iryx-info-muted-foreground',
  infoBorder: '--iryx-info-border',
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
  const resolved: Theme = typeof theme === 'string' ? themes[theme] : theme
  const radius = resolved.radius == null ? '' : `--iryx-radius: ${resolved.radius}; `
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }
  style.textContent = `:root { ${radius}${declarations(resolved.light ?? {})} }\n.dark { ${declarations(resolved.dark ?? {})} }`
}

/** Remove a theme applied with {@link applyTheme}, restoring theme.css defaults. */
export function clearTheme(): void {
  if (typeof document === 'undefined')
    return
  document.getElementById(STYLE_ID)?.remove()
}
