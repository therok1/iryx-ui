import { onMounted, ref } from 'vue'

/**
 * Whether the reader is on an Apple platform, resolved **after mount**.
 *
 * It cannot be resolved during render: there is no `navigator` on the server,
 * so server markup would say "Ctrl" and the client would say "⌘" — a
 * hydration mismatch on every page carrying a shortcut. Starting `false` and
 * correcting on mount means the worst case is one frame of the wrong glyph
 * rather than a mismatched tree.
 */
export function useApplePlatform() {
  const isApple = ref(false)
  onMounted(() => {
    isApple.value = isApplePlatform()
  })
  return isApple
}

/** The same check, for code that already runs in the browser. */
export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined')
    return false
  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent)
}

/**
 * How each modifier is drawn, and what it is called out loud.
 *
 * The glyphs are unreadable to a screen reader — `⌘` announces as nothing
 * useful — so every key carries a spoken name alongside its symbol.
 */
const MODIFIERS: Record<string, { apple: string, other: string, spoken: string, spokenOther?: string }> = {
  mod: { apple: '⌘', other: 'Ctrl', spoken: 'Command', spokenOther: 'Control' },
  meta: { apple: '⌘', other: 'Win', spoken: 'Command', spokenOther: 'Windows' },
  cmd: { apple: '⌘', other: 'Ctrl', spoken: 'Command', spokenOther: 'Control' },
  ctrl: { apple: '⌃', other: 'Ctrl', spoken: 'Control' },
  control: { apple: '⌃', other: 'Ctrl', spoken: 'Control' },
  shift: { apple: '⇧', other: 'Shift', spoken: 'Shift' },
  alt: { apple: '⌥', other: 'Alt', spoken: 'Option', spokenOther: 'Alt' },
  option: { apple: '⌥', other: 'Alt', spoken: 'Option', spokenOther: 'Alt' },
}

/** Named keys that have a conventional glyph. Anything else prints as given. */
const NAMED: Record<string, { symbol: string, spoken: string }> = {
  enter: { symbol: '↵', spoken: 'Enter' },
  return: { symbol: '↵', spoken: 'Return' },
  escape: { symbol: 'Esc', spoken: 'Escape' },
  esc: { symbol: 'Esc', spoken: 'Escape' },
  backspace: { symbol: '⌫', spoken: 'Backspace' },
  delete: { symbol: '⌦', spoken: 'Delete' },
  tab: { symbol: '⇥', spoken: 'Tab' },
  space: { symbol: '␣', spoken: 'Space' },
  capslock: { symbol: '⇪', spoken: 'Caps lock' },
  win: { symbol: '⊞', spoken: 'Windows' },
  pageup: { symbol: '⇞', spoken: 'Page up' },
  pagedown: { symbol: '⇟', spoken: 'Page down' },
  home: { symbol: '↖', spoken: 'Home' },
  end: { symbol: '↘', spoken: 'End' },
  up: { symbol: '↑', spoken: 'Up arrow' },
  down: { symbol: '↓', spoken: 'Down arrow' },
  left: { symbol: '←', spoken: 'Left arrow' },
  right: { symbol: '→', spoken: 'Right arrow' },
  // `KeyboardEvent.key` spells the arrows this way, so both forms are taken.
  arrowup: { symbol: '↑', spoken: 'Up arrow' },
  arrowdown: { symbol: '↓', spoken: 'Down arrow' },
  arrowleft: { symbol: '←', spoken: 'Left arrow' },
  arrowright: { symbol: '→', spoken: 'Right arrow' },
}

export interface KbdKey {
  /** What is drawn in the chip. */
  symbol: string
  /** What a screen reader says instead. */
  spoken: string
}

/**
 * Turn a hotkey into the keys to draw — `mod+k` becomes `⌘` and `K` on a Mac,
 * `Ctrl` and `K` elsewhere.
 *
 * Accepts the same vocabulary as `matchesHotkey`, so the shortcut you bind and
 * the shortcut you show are written the same way.
 */
export function parseHotkey(hotkey: string | string[], apple: boolean): KbdKey[] {
  const parts = Array.isArray(hotkey)
    ? hotkey
    : hotkey.split('+').map(part => part.trim()).filter(Boolean)

  return parts.map((part) => {
    const lower = part.toLowerCase()

    const modifier = MODIFIERS[lower]
    if (modifier) {
      return {
        symbol: apple ? modifier.apple : modifier.other,
        spoken: apple ? modifier.spoken : (modifier.spokenOther ?? modifier.spoken),
      }
    }

    const named = NAMED[lower]
    if (named)
      return named

    // A bare letter reads better capitalised; longer words keep their casing.
    return { symbol: part.length === 1 ? part.toUpperCase() : part, spoken: part.toUpperCase() }
  })
}
