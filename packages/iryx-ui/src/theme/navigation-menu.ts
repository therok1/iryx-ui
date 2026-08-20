import { tv } from 'tailwind-variants'

/*
 * Panels live in a single `NavigationMenuViewport` that all triggers share,
 * rather than one popup per item. That is what lets the panel resize and slide
 * between triggers instead of tearing down and rebuilding: Reka reports the
 * active content's box as --reka-navigation-menu-viewport-width/-height and its
 * offset from the root as -left/-top, and the viewport eases between them.
 *
 * The viewport therefore has `overflow-hidden` and the content inside it is
 * absolutely positioned — without that, the content would set the viewport's
 * size and the animation would have nothing to animate towards.
 *
 * Two sizing traps, both invisible in tests and both found by measuring the
 * rendered box:
 *
 * - The viewport is a flex item in a wrapper no wider than the nav, so it
 *   shrinks to that width and clips the panel. It needs `shrink-0`.
 * - Reka reports the content's `offsetWidth`, but Tailwind's default
 *   `border-box` then subtracts the viewport's own 1px border from it, so the
 *   panel loses a pixel of padding on the right and bottom. `box-content`
 *   makes the reported number the content width and puts the border outside
 *   it, which is what Reka measured.
 */
export const navigationMenuTheme = tv({
  slots: {
    root: 'relative z-10 flex max-w-max',
    list: 'flex list-none items-center gap-1',
    item: 'relative',
    /**
     * A plain link and a panel trigger share their chrome, so the two kinds of
     * top-level entry read as one row. `group` is here for the chevron.
     */
    link: 'group inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 data-[active]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
    /** Pushed to the trailing edge and flipped while the panel is open. */
    triggerIcon: 'transition-transform duration-200 group-data-[state=open]:rotate-180',
    /**
     * Spans the root so the viewport has a stable origin; Reka's -left/-top
     * vars then place it against the active trigger, so this must NOT also
     * centre with flex — the two would fight and the panel would land off by
     * half its own width.
     */
    viewportWrapper: 'absolute flex items-start',
    viewport: 'relative box-content h-(--reka-navigation-menu-viewport-height) w-(--reka-navigation-menu-viewport-width) shrink-0 origin-top overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-lg transition-[width,height,translate] duration-200 ease-out data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    /**
     * Absolute inside the viewport so the viewport measures it without being
     * sized by it. `w-max` lets the grid decide its own width.
     */
    content: 'absolute top-0 left-0 grid w-max gap-1 p-2',
    /** One row inside a panel: label on top, optional description under it. */
    panelLink: 'flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    panelLabel: 'block font-medium text-foreground',
    panelDescription: 'mt-0.5 block text-xs leading-snug text-muted-foreground',
    /** Sits under the icon so a bare glyph does not float in the row. */
    panelIcon: 'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground',
  },
  variants: {
    orientation: {
      horizontal: {
        viewportWrapper: 'top-full left-0 w-full pt-2',
        viewport: 'translate-x-(--reka-navigation-menu-viewport-left)',
      },
      vertical: {
        list: 'flex-col items-stretch',
        link: 'justify-start',
        viewportWrapper: 'top-0 left-full h-full pl-2',
        viewport: 'origin-left translate-y-(--reka-navigation-menu-viewport-top)',
      },
    },
    /** Panels wider than one column. Only affects the grid inside the viewport. */
    columns: {
      1: { content: 'grid-cols-1' },
      2: { content: 'grid-cols-2' },
      3: { content: 'grid-cols-3' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    columns: 1,
  },
})

export type NavigationMenuSlots = keyof ReturnType<typeof navigationMenuTheme>
