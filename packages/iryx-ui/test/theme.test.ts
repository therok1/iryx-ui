import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { applyTheme, clearTheme, themes, useAppearance } from '../src'

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
 * A token is only usable if it is declared for both modes and exposed to
 * Tailwind. Miss any of the three and the class silently resolves to nothing.
 */
describe('theme.css tokens', () => {
  it('declares every :root token in .dark too', () => {
    expect(tokensIn(block('\\.dark')).sort()).toEqual(tokensIn(block(':root')).sort())
  })

  it('maps every token into @theme inline', () => {
    const mapped = block('@theme inline')
    for (const token of tokensIn(block(':root')))
      expect(mapped).toContain(`var(${token})`)
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
    applyTheme('emerald')
    const style = document.getElementById('iryx-ui-theme')
    expect(style).toBeTruthy()
    expect(style!.textContent).toContain(':root')
    expect(style!.textContent).toContain('.dark')
    expect(style!.textContent).toContain(`--iryx-primary: ${themes.emerald.light.primary};`)
  })

  it('replaces a previously applied theme instead of stacking', () => {
    applyTheme('emerald')
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
