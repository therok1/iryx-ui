import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watchEffect } from 'vue'

export type Appearance = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'iryx-ui:appearance'

const appearance: Ref<Appearance> = ref('system')
const systemDark = ref(false)
let started = false

function resolveDark(): boolean {
  return appearance.value === 'dark' || (appearance.value === 'system' && systemDark.value)
}

/**
 * Flip the theme with transitions switched off for one frame.
 *
 * Components transition their colours, and the light and dark border tokens
 * sit far apart (opaque grey vs. white at 10% alpha). Interpolating between
 * them runs through a near-white, partly opaque border — a visible flash
 * around every bordered element on each switch.
 */
function applyWithoutTransitions(dark: boolean): void {
  const style = document.createElement('style')
  style.textContent = '*,*::before,*::after{transition:none !important;animation:none !important}'
  document.head.appendChild(style)

  document.documentElement.classList.toggle('dark', dark)

  // Force a style recalculation so the new colours are committed while
  // transitions are still suppressed.
  void document.body?.offsetHeight

  requestAnimationFrame(() => style.remove())
}

function start(): void {
  if (started || typeof window === 'undefined')
    return
  started = true

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system')
    appearance.value = stored

  if (typeof window.matchMedia === 'function') {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = query.matches
    query.addEventListener('change', (event) => {
      systemDark.value = event.matches
    })
  }

  watchEffect(() => {
    applyWithoutTransitions(resolveDark())
    window.localStorage.setItem(STORAGE_KEY, appearance.value)
  })
}

/**
 * Set the startup appearance, unless the user already has a stored
 * preference (their choice wins). Used by the plugin/module options;
 * no-op during SSR.
 */
export function initAppearance(defaultAppearance: Appearance): void {
  if (typeof window === 'undefined')
    return
  const hasStored = window.localStorage.getItem(STORAGE_KEY) !== null
  start()
  if (!hasStored)
    appearance.value = defaultAppearance
}

export interface UseAppearanceReturn {
  /** The selected mode: `light`, `dark`, or `system`. Shared app-wide. */
  appearance: Ref<Appearance>
  /** Whether dark mode is effectively active (resolves `system`). */
  isDark: ComputedRef<boolean>
  setAppearance: (value: Appearance) => void
  /** Flip between light and dark based on the currently effective mode. */
  toggleAppearance: () => void
}

/**
 * Light/dark mode for the app. Persists to localStorage, follows the OS
 * preference in `system` mode, and toggles the `dark` class on `<html>`
 * (which drives the `.dark` token block in theme.css).
 */
export function useAppearance(): UseAppearanceReturn {
  start()
  return {
    appearance,
    isDark: computed(() => resolveDark()),
    setAppearance: (value) => {
      appearance.value = value
    },
    toggleAppearance: () => {
      appearance.value = resolveDark() ? 'light' : 'dark'
    },
  }
}
