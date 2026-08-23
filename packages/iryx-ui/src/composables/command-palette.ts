import type { IconLike } from './icon'
import { isApplePlatform } from './kbd'

export interface CommandItem {
  /** What the reader searches for and reads. */
  label: string
  icon?: IconLike
  /**
   * Displayed at the trailing edge, split on spaces into separate keys.
   * Display only — the palette never binds it, because the shortcut belongs
   * to the command itself and works whether or not the palette is open.
   */
  shortcut?: string
  /**
   * Extra search terms that never appear on screen: synonyms, the old name of
   * a renamed page, the word a reader would guess.
   */
  keywords?: string[]
  /** Renders the row as a link, so middle-click and open-in-new-tab work. */
  href?: string
  disabled?: boolean
  onSelect?: () => void
}

export interface CommandGroup {
  label: string
  items: CommandItem[]
}

export type CommandEntry = CommandItem | CommandGroup

export function isCommandGroup(entry: CommandEntry): entry is CommandGroup {
  return Array.isArray((entry as CommandGroup).items)
}

/** Normalise to groups, so the template has a single path to render. */
export function toCommandGroups(entries: CommandEntry[] | undefined): CommandGroup[] {
  const groups: CommandGroup[] = []
  let loose: CommandItem[] | undefined

  for (const entry of entries ?? []) {
    if (isCommandGroup(entry)) {
      groups.push(entry)
      loose = undefined
      continue
    }
    // Commands written before or between groups keep their position rather
    // than being hoisted, so the order the caller wrote is the order rendered.
    if (!loose) {
      loose = []
      groups.push({ label: '', items: loose })
    }
    loose.push(entry)
  }

  return groups
}

/**
 * Everything a query should match against: the label, the group it sits in,
 * and any keywords. Joined rather than tested separately so a query spanning
 * two of them ("settings members") still matches.
 */
export function commandHaystack(item: CommandItem, group: string): string {
  return [item.label, group, ...(item.keywords ?? [])].join(' ')
}

/**
 * Parse a hotkey like `mod+k` into a matcher.
 *
 * `mod` is Command on Apple platforms and Control everywhere else — the same
 * key in muscle memory, a different key on the wire.
 */
export function matchesHotkey(event: KeyboardEvent, hotkey: string): boolean {
  const parts = hotkey.toLowerCase().split('+').map(part => part.trim())
  const key = parts.at(-1) ?? ''

  const wantsMod = parts.includes('mod')
  const wantsCtrl = parts.includes('ctrl') || parts.includes('control')
  const wantsMeta = parts.includes('meta') || parts.includes('cmd')
  const wantsShift = parts.includes('shift')
  const wantsAlt = parts.includes('alt') || parts.includes('option')

  const modHeld = isApplePlatform() ? event.metaKey : event.ctrlKey

  if (wantsMod && !modHeld)
    return false
  if (wantsCtrl && !event.ctrlKey)
    return false
  if (wantsMeta && !event.metaKey)
    return false
  if (wantsShift !== event.shiftKey)
    return false
  if (wantsAlt !== event.altKey)
    return false

  return event.key.toLowerCase() === key
}
