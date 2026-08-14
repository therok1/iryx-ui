import { tv } from 'tailwind-variants'

export const alertTheme = tv({
  slots: {
    /*
     * A neutral surface rather than a wash of the status colour. The saturated
     * block is what dates an alert — it shouts before it is read, and a stack
     * of them turns a page into a traffic light. The colour lives in the icon
     * instead, and the hierarchy comes from type weight, matching how IBadge
     * puts its colour in the dot.
     */
    root: 'flex w-full gap-3 rounded-xl border border-border bg-background p-4 shadow-xs',
    icon: 'mt-px shrink-0 [&_svg]:size-4.5',
    content: 'min-w-0 flex-1',
    title: 'text-sm font-medium text-foreground',
    description: 'text-sm text-muted-foreground',
    /** Buttons or links under the body — "Retry", "Undo", "View invoice". */
    actions: 'mt-3 flex flex-wrap items-center gap-2',
    close: '-m-1 shrink-0 self-start rounded-lg p-1 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
  },
  variants: {
    variant: {
      info: { icon: 'text-info' },
      success: { icon: 'text-success' },
      warning: { icon: 'text-warning' },
      danger: { icon: 'text-danger' },
    },
    /** Tightens the title/description gap when both are present. */
    withTitle: {
      true: { description: 'mt-1' },
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

export type AlertSlots = keyof ReturnType<typeof alertTheme>
