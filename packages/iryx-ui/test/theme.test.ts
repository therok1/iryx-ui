import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { applyTheme, clearTheme, themes, useAppearance } from '../src'

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
