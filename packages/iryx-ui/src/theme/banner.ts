import { tv } from 'tailwind-variants'

export const bannerTheme = tv({
  slots: {
    /*
     * Full-bleed by design: a banner spans the viewport, so it carries a rule
     * on one edge rather than a box. Rounding or bordering it all round would
     * make it read as an alert that happens to be wide.
     */
    root: 'w-full border-b',
    /** Keeps the text off the viewport edge without constraining the fill. */
    container: 'mx-auto flex w-full items-center gap-3 px-4 py-2.5',
    icon: 'shrink-0 [&_svg]:size-4',
    content: 'min-w-0 flex-1 text-sm',
    title: 'font-medium',
    actions: 'flex shrink-0 items-center gap-2',
    close: '-mr-1 shrink-0 rounded-lg p-1 opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50 [&_svg]:size-4',
  },
  variants: {
    variant: {
      neutral: { root: 'border-border bg-muted text-foreground', icon: 'text-muted-foreground' },
      info: { root: 'border-info-border bg-info-muted text-info-muted-foreground', icon: 'text-info' },
      success: { root: 'border-success-border bg-success-muted text-success-muted-foreground', icon: 'text-success' },
      warning: { root: 'border-warning-border bg-warning-muted text-warning-muted-foreground', icon: 'text-warning' },
      danger: { root: 'border-danger-border bg-danger-muted text-danger-muted-foreground', icon: 'text-danger' },
      /** Brand-coloured, for announcements rather than status. */
      primary: { root: 'border-transparent bg-linear-to-b from-primary-from to-primary-to text-primary-foreground', icon: 'text-primary-foreground' },
    },
    position: {
      static: {},
      /** Sticks under the top of the scroll container. */
      top: { root: 'sticky top-0 z-30' },
      /** Pinned to the bottom of the viewport; the rule moves to the top edge. */
      bottom: { root: 'fixed inset-x-0 bottom-0 z-30 border-t border-b-0' },
    },
    /** Constrains the text while the fill still spans the viewport. */
    contained: {
      true: { container: 'max-w-5xl' },
      false: {},
    },
    align: {
      start: {},
      center: { content: 'text-center' },
    },
  },
  defaultVariants: {
    variant: 'neutral',
    position: 'static',
    contained: false,
    align: 'start',
  },
})

export type BannerSlots = keyof ReturnType<typeof bannerTheme>
