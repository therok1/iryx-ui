import type { IconLike } from './icon'

export interface NavigationMenuLinkItem {
  label: string
  /** Renders an `<a>`. Omit to render a `<button>` and handle `onSelect` yourself. */
  href?: string
  /** `target` on the anchor, e.g. `'_blank'`. Ignored without `href`. */
  target?: string
  icon?: IconLike
  /** Secondary line under the label. Only shown inside a panel. */
  description?: string
  disabled?: boolean
  /** Marks the current page. Reflected as `data-active` and `aria-current`. */
  active?: boolean
  /** Handle navigation yourself, e.g. with a router. */
  onSelect?: () => void
}

export interface NavigationMenuGroupItem extends NavigationMenuLinkItem {
  /** Child links. Turns this entry into a panel trigger. */
  items: NavigationMenuLinkItem[]
  /** Columns for this entry's panel. Defaults to the menu's `columns`. */
  columns?: 1 | 2 | 3
}

/**
 * One top-level entry: a link on its own, or a trigger that opens a panel of
 * links. Which one it is comes from the presence of `items`, the same rule
 * `DropdownMenuEntry` uses.
 */
export type NavigationMenuEntry = NavigationMenuLinkItem | NavigationMenuGroupItem

export function isNavigationGroup(entry: NavigationMenuEntry): entry is NavigationMenuGroupItem {
  return Array.isArray((entry as NavigationMenuGroupItem).items)
    && (entry as NavigationMenuGroupItem).items.length > 0
}
