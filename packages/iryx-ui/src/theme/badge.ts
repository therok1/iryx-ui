import { tv } from 'tailwind-variants'

export const badgeTheme = tv({
  slots: {
    root: 'inline-flex shrink-0 items-center rounded-full font-medium whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0',
    dot: 'rounded-full bg-current',
  },
  variants: {
    variant: {
      neutral: {},
      success: {},
      warning: {},
      danger: {},
      info: {},
    },
    /** `soft` is a tinted background; `solid` is a filled block of colour. */
    tone: {
      soft: {},
      solid: {},
    },
    /*
     * Padding tightens on the side an icon sits on, as on Button. The icon
     * marks its own position with `data-icon="inline-start"` / `"inline-end"`,
     * which is what makes this work in CSS: a label is a bare text node, so
     * `:first-child` / `:last-child` would match an adjacent icon as both.
     */
    size: {
      sm: {
        root: 'h-5 gap-1 px-2 text-xs has-[[data-icon=inline-end]]:pr-1.5 has-[[data-icon=inline-start]]:pl-1.5 [&_svg]:size-3',
        dot: 'size-1.5',
      },
      md: {
        root: 'h-6 gap-1.5 px-2.5 text-xs has-[[data-icon=inline-end]]:pr-2 has-[[data-icon=inline-start]]:pl-2 [&_svg]:size-3.5',
        dot: 'size-2',
      },
      lg: {
        root: 'h-7 gap-1.5 px-3 text-sm has-[[data-icon=inline-end]]:pr-2.5 has-[[data-icon=inline-start]]:pl-2.5 [&_svg]:size-4',
        dot: 'size-2',
      },
    },
  },
  compoundVariants: [
    { variant: 'neutral', tone: 'soft', class: { root: 'bg-muted text-muted-foreground' } },
    { variant: 'neutral', tone: 'solid', class: { root: 'bg-foreground text-background' } },
    { variant: 'success', tone: 'soft', class: { root: 'bg-success-muted text-success-muted-foreground' } },
    { variant: 'success', tone: 'solid', class: { root: 'bg-success text-success-foreground' } },
    { variant: 'warning', tone: 'soft', class: { root: 'bg-warning-muted text-warning-muted-foreground' } },
    { variant: 'warning', tone: 'solid', class: { root: 'bg-warning text-warning-foreground' } },
    { variant: 'danger', tone: 'soft', class: { root: 'bg-danger-muted text-danger-muted-foreground' } },
    { variant: 'danger', tone: 'solid', class: { root: 'bg-danger text-danger-foreground' } },
    { variant: 'info', tone: 'soft', class: { root: 'bg-info-muted text-info-muted-foreground' } },
    { variant: 'info', tone: 'solid', class: { root: 'bg-info text-info-foreground' } },
  ],
  defaultVariants: {
    variant: 'neutral',
    tone: 'soft',
    size: 'md',
  },
})

export type BadgeSlots = keyof ReturnType<typeof badgeTheme>
