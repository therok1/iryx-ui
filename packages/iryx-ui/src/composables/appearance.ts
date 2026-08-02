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
    document.documentElement.classList.toggle('dark', resolveDark())
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
