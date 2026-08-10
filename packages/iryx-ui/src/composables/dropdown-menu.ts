import type { IconLike } from './icon'

export interface DropdownMenuItemOption {
  label: string
  /** Leading icon component. */
  icon?: IconLike
  disabled?: boolean
  /** Style the item as destructive. */
  danger?: boolean
  /** Run when the item is chosen. Omit on an entry that opens a submenu. */
  onSelect?: () => void
  /** Nested entries. Turns this item into a submenu trigger. */
  items?: DropdownMenuEntry[]
}

/**
 * One row of a menu.
 *
 * `'-'` renders a separator. An option with `items` opens a submenu, and one
 * with neither `items` nor `onSelect` is a non-interactive group label.
 */
export type DropdownMenuEntry = DropdownMenuItemOption | '-'

export function isSeparator(entry: DropdownMenuEntry): entry is '-' {
  return entry === '-'
}

export function isSubmenu(entry: DropdownMenuItemOption): boolean {
  return Array.isArray(entry.items) && entry.items.length > 0
}
