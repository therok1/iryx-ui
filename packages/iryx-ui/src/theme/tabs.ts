import { tv } from 'tailwind-variants'

/*
 * The active marker is a single `TabsIndicator` that slides between triggers,
 * rather than a background on each one — that is what lets it animate. Reka
 * exposes its geometry as --reka-tabs-indicator-position / -size, and only
 * `translate` and the size transition, so nothing else eases.
 */
export const tabsTheme = tv({
  slots: {
    root: 'flex flex-col gap-4',
    list: 'relative flex shrink-0 items-center gap-1',
    indicator: 'absolute left-0 transition-[translate,width,height] duration-200 ease-out',
    trigger: 'relative z-10 inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    content: 'outline-none',
  },
  variants: {
    variant: {
      solid: {
        list: 'rounded-xl bg-muted p-1',
        indicator: 'top-1 h-[calc(100%---spacing(2))] rounded-lg bg-background shadow-sm',
        trigger: 'rounded-lg px-3 py-1.5 text-muted-foreground data-[state=active]:text-foreground',
      },
      /**
       * Underline for page-level navigation. The trigger is square: a rounded
       * corner would bend the bar that sits under it.
       */
      line: {
        list: 'gap-4 border-b border-border',
        indicator: 'bottom-0 h-0.5 rounded-none bg-primary',
        trigger: 'rounded-none px-1 py-2 text-muted-foreground data-[state=active]:text-foreground',
      },
    },
    orientation: {
      horizontal: { indicator: 'w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position)' },
      vertical: {
        root: 'flex-row',
        list: 'flex-col items-stretch',
        indicator: 'h-(--reka-tabs-indicator-size) translate-y-(--reka-tabs-indicator-position)',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      orientation: 'vertical',
      class: { indicator: 'top-0 left-1 w-[calc(100%---spacing(2))]' },
    },
    {
      variant: 'line',
      orientation: 'vertical',
      class: {
        list: 'border-r border-b-0',
        indicator: 'right-0 bottom-auto h-(--reka-tabs-indicator-size) w-0.5',
        trigger: 'text-left',
      },
    },
  ],
  defaultVariants: {
    variant: 'solid',
    orientation: 'horizontal',
  },
})

export type TabsSlots = keyof ReturnType<typeof tabsTheme>
