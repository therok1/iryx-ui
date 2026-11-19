import type { InjectionKey, Ref } from 'vue'
import type { IconLike } from './icon'
import { inject, ref, watch } from 'vue'

export interface SidebarLink {
  label: string
  /** Renders an `<a>`. Omit to render a `<button>` and handle `onSelect` yourself. */
  href?: string
  icon?: IconLike
  /** Count or status at the trailing edge, e.g. an unread total. */
  badge?: string | number
  disabled?: boolean
  /** Marks the current page. Reflected as `data-active` and `aria-current`. */
  active?: boolean
  /** Handle navigation yourself, e.g. with a router. */
  onSelect?: () => void
  /** Child links. Turns this entry into a collapsible group. */
  items?: SidebarLink[]
  /** Start the group open. Ignored without `items`. */
  defaultOpen?: boolean
}

/**
 * A labelled run of links under a small heading.
 *
 * The heading lives under its own `section` key rather than `label`, because a
 * collapsible group link carries `items` too — with one shared key the two
 * would be told apart by guessing at which other fields are present, and an
 * icon-less group would silently become a heading.
 */
export interface SidebarSection {
  section: string
  items: SidebarLink[]
  /** Push to the bottom of the column, above the footer. Pass `section: ''` for no heading. */
  pinned?: boolean
}

export type SidebarItems = (SidebarLink | SidebarSection)[]

/** Provided by `IAppShell` around each copy of its sidebar slot. */
export const sidebarPlacementKey: InjectionKey<'column' | 'drawer'> = Symbol.for('iryx-ui:sidebar-placement')

export function isSidebarSection(item: SidebarLink | SidebarSection): item is SidebarSection {
  return typeof (item as SidebarSection).section === 'string'
}

/** Normalise to sections, so the template has a single path to render. */
export function toSidebarSections(items: SidebarItems | undefined): SidebarSection[] {
  const sections: SidebarSection[] = []
  let loose: SidebarLink[] | undefined

  for (const item of items ?? []) {
    if (isSidebarSection(item)) {
      sections.push(item)
      loose = undefined
      continue
    }
    // Links before or between sections keep their position rather than being
    // hoisted, so the order the caller wrote is the order that renders.
    if (!loose) {
      loose = []
      sections.push({ section: '', items: loose })
    }
    loose.push(item)
  }

  return [...sections.filter(s => !s.pinned), ...sections.filter(s => s.pinned)]
}

export function isSidebarGroup(link: SidebarLink): boolean {
  return Array.isArray(link.items) && link.items.length > 0
}

export const sidebarCollapsedCookie = 'iryx-ui-sidebar-collapsed'

/**
 * Provide a ref read from the request cookie so the server renders the sidebar
 * the way the user left it. The Nuxt module does this for you.
 */
export const sidebarCollapsedKey: InjectionKey<Ref<boolean>> = Symbol.for('iryx-ui:sidebar-collapsed')

/** Collapsed state remembered in a cookie. Bind it with `v-model:collapsed`. */
export function useSidebarCollapsed(): Ref<boolean> {
  const provided = inject(sidebarCollapsedKey, null)
  if (provided)
    return provided

  if (typeof document === 'undefined')
    return ref(false)

  const match = document.cookie.match(new RegExp(`(?:^|; )${sidebarCollapsedCookie}=([^;]*)`))
  const collapsed = ref(match?.[1] === 'true')
  watch(collapsed, (value) => {
    document.cookie = `${sidebarCollapsedCookie}=${value}; path=/; max-age=31536000; samesite=lax`
  })
  return collapsed
}
