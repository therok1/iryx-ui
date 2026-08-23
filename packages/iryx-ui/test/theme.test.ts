import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { applyTheme, clearTheme, progressTheme, themes, useAppearance } from '../src'

// Resolved from the package root: under happy-dom `import.meta.url` is an
// http URL, so it can't be turned into a file path.
const themeCss = readFileSync(resolve(process.cwd(), 'theme.css'), 'utf8')

/** Grab the body of a top-level block, e.g. `:root { … }`. */
function block(selector: string): string {
  const match = themeCss.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`))
  if (!match)
    throw new Error(`no ${selector} block in theme.css`)
  return match[1]!
}

function tokensIn(source: string): string[] {
  return [...source.matchAll(/(--iryx-[\w-]+):/g)].map(m => m[1]!)
}

/**
 * Tokens that are deliberately mode-independent: a typeface does not change
 * between light and dark, so redeclaring it under `.dark` would be noise that
 * every future theme has to keep in sync for no benefit.
 */
const modeAgnosticTokens = ['--iryx-font-sans']

/**
 * A token is only usable if it is declared for both modes and exposed to
 * Tailwind. Miss any of the three and the class silently resolves to nothing.
 */
describe('theme.css tokens', () => {
  it('declares every :root colour token in .dark too', () => {
    const rootTokens = tokensIn(block(':root')).filter(t => !modeAgnosticTokens.includes(t))
    expect(tokensIn(block('\\.dark')).sort()).toEqual(rootTokens.sort())
  })

  it('maps every token into @theme inline', () => {
    const mapped = block('@theme inline')
    for (const token of tokensIn(block(':root')))
      expect(mapped).toContain(`var(${token})`)
  })

  /**
   * The chart slots were chosen against the dataviz validator — lightness
   * band, chroma floor, protan/deutan separation, contrast on each surface.
   * These assertions cannot re-run that maths, but they do catch the two ways
   * the palette silently rots: a slot going missing, and dark quietly becoming
   * a copy of light instead of its own validated steps.
   */
  it('declares eight chart slots per mode, with dark on its own steps', () => {
    const light = tokensIn(block(':root')).filter(token => token.startsWith('--iryx-chart-'))
    const dark = tokensIn(block('\\.dark')).filter(token => token.startsWith('--iryx-chart-'))

    const expected = Array.from({ length: 8 }, (_, index) => `--iryx-chart-${index + 1}`)
    expect(light).toEqual(expected)
    expect(dark).toEqual(expected)

    for (const slot of expected) {
      const lightValue = themeCss.match(new RegExp(`${slot}: (oklch\\([^)]+\\))`))![1]
      const darkValue = [...themeCss.matchAll(new RegExp(`${slot}: (oklch\\([^)]+\\))`, 'g'))][1]![1]
      // Only slot 3 legitimately shares a step across modes.
      if (slot !== '--iryx-chart-3')
        expect(darkValue, `${slot} should have dark-specific steps`).not.toBe(lightValue)
    }
  })

  it('keeps status colours out of the chart slots', () => {
    // A series that happens to be slot 4 must not read as a warning.
    const chartValues = [...themeCss.matchAll(/--iryx-chart-\d: (oklch\([^)]+\))/g)].map(m => m[1])
    const statusValues = [...themeCss.matchAll(/--iryx-(?:success|warning|danger|info): (oklch\([^)]+\))/g)].map(m => m[1])

    for (const value of statusValues)
      expect(chartValues).not.toContain(value)
  })

  it('covers all five roles for each status colour', () => {
    const declared = tokensIn(block(':root'))
    for (const status of ['success', 'warning', 'danger', 'info']) {
      for (const role of ['', '-foreground', '-muted', '-muted-foreground', '-border'])
        expect(declared).toContain(`--iryx-${status}${role}`)
    }
  })
})

describe('applyTheme', () => {
  it('injects token overrides for both light and dark modes', () => {
    applyTheme('violet')
    const style = document.getElementById('iryx-ui-theme')
    expect(style).toBeTruthy()
    expect(style!.textContent).toContain(':root')
    expect(style!.textContent).toContain('.dark')
    expect(style!.textContent).toContain(`--iryx-primary: ${themes.violet.light.primary};`)
  })

  it('replaces a previously applied theme instead of stacking', () => {
    applyTheme('violet')
    applyTheme({ light: { primary: 'red' }, dark: { primary: 'pink' } })
    const styles = document.querySelectorAll('#iryx-ui-theme')
    expect(styles.length).toBe(1)
    expect(styles[0]!.textContent).toContain('--iryx-primary: red;')
    expect(styles[0]!.textContent).not.toContain('oklch')
  })

  it('clearTheme removes the override stylesheet', () => {
    applyTheme('rose')
    clearTheme()
    expect(document.getElementById('iryx-ui-theme')).toBeNull()
  })
})

describe('useAppearance', () => {
  it('toggles the dark class on the document element', async () => {
    const { setAppearance, isDark } = useAppearance()

    setAppearance('dark')
    await nextTick()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    setAppearance('light')
    await nextTick()
    expect(isDark.value).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  /*
   * The light and dark border tokens are far apart (opaque grey vs. white at
   * 10% alpha), so letting the colour transition run on a theme switch flashes
   * a near-white border around every bordered element.
   */
  it('suppresses transitions while switching, then restores them', async () => {
    const { setAppearance } = useAppearance()
    const suppressing = () => [...document.head.querySelectorAll('style')]
      .some(s => s.textContent?.includes('transition-duration:0s'))

    setAppearance('dark')
    await nextTick()
    expect(suppressing()).toBe(true)

    // The guard style is removed on the next frame, not left behind.
    await new Promise(resolve => requestAnimationFrame(() => resolve(null)))
    await nextTick()
    expect(suppressing()).toBe(false)
  })

  it('persists the selection', async () => {
    const { setAppearance } = useAppearance()
    setAppearance('dark')
    await nextTick()
    expect(window.localStorage.getItem('iryx-ui:appearance')).toBe('dark')
  })

  it('toggleAppearance flips the effective mode', async () => {
    const { setAppearance, toggleAppearance, isDark } = useAppearance()
    setAppearance('light')
    await nextTick()
    toggleAppearance()
    await nextTick()
    expect(isDark.value).toBe(true)
  })
})

/*
 * The reduced-motion guard is CSS, so nothing else in the suite would notice
 * it disappearing — or, worse, being "tidied" into `animation: none`, which
 * strands every Reka `Presence` that unmounts on `animationend`.
 */
describe('reduced motion', () => {
  const guard = themeCss.slice(themeCss.indexOf('@media (prefers-reduced-motion: reduce)'))

  it('ships a guard at all', () => {
    expect(themeCss).toContain('@media (prefers-reduced-motion: reduce)')
  })

  it('shortens animations rather than removing them', () => {
    expect(guard).toContain('animation-duration: 0.01ms !important')
    expect(guard).toContain('transition-duration: 0.01ms !important')
  })

  it('does not disable animation globally, which would strand Presence', () => {
    const blanket = guard.slice(guard.indexOf('*,'), guard.indexOf('.iryx-progress-indeterminate'))
    expect(blanket).not.toContain('animation: none')
  })

  it('parks the indeterminate progress bar instead of running it once', () => {
    expect(guard).toContain('.iryx-progress-indeterminate')
    expect(progressTheme({ indeterminate: true }).indicator())
      .toContain('iryx-progress-indeterminate')
  })

  it('keeps the table loading bar visible as a steady rule', () => {
    expect(themeCss).toContain('animation: none !important')
  })
})

/*
 * The switch guard is removed on the next frame — except there is no next
 * frame in a background tab, and a system appearance change fires there just
 * the same. Found in the wild: the suppressor still in `<head>` minutes after
 * the switch, with every transition and animation on the page dead.
 */
describe('appearance switch guard', () => {
  it('removes itself without a frame', async () => {
    const { setAppearance } = useAppearance()
    const suppressing = () => [...document.head.querySelectorAll('style')]
      .some(s => s.textContent?.includes('transition-duration:0s'))

    const raf = window.requestAnimationFrame
    // A hidden tab: the callback is registered and never invoked.
    window.requestAnimationFrame = (() => 0) as typeof window.requestAnimationFrame

    try {
      setAppearance(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
      await nextTick()
      expect(suppressing()).toBe(true)

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(suppressing()).toBe(false)
    }
    finally {
      window.requestAnimationFrame = raf
    }
  })

  it('shortens animations rather than removing them, so animationend still fires', async () => {
    const { setAppearance } = useAppearance()
    setAppearance(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
    await nextTick()

    const guard = [...document.head.querySelectorAll('style')]
      .map(s => s.textContent ?? '')
      .find(text => text.includes('animation-duration'))

    expect(guard).toBeDefined()
    expect(guard).not.toContain('animation:none')
  })
})
