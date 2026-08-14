import { tv } from 'tailwind-variants'

export const badgeTheme = tv({
  slots: {
    /*
     * Softly rounded rather than a full pill — at badge height a pill reads as
     * a different family from the surrounding controls, which all sit on the
     * shared radius. The dot stays a true circle.
     */
    root: 'inline-flex shrink-0 items-center rounded-md border font-medium whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0',
    dot: 'rounded-full',
  },
  variants: {
    variant: {
      neutral: {},
      success: {},
      warning: {},
      danger: {},
      info: {},
    },
    /*
     * The two looks. Without a dot the badge carries its status in the fill,
     * border and text. With one, the chrome goes neutral and the dot alone
     * carries the colour — so a row of mixed statuses reads as one family
     * instead of five competing blocks.
     */
    withDot: {
      true: { root: 'border-border bg-background text-foreground' },
      false: {},
    },
    /*
     * Padding tightens on the side an icon sits on, as on Button. The icon
     * marks its own position with `data-icon="inline-start"` / `"inline-end"`,
     * which is what makes this work in CSS: a label is a bare text node, so
     * `:first-child` / `:last-child` would match an adjacent icon as both.
     */
    size: {
      sm: {
        root: 'h-5 gap-1 px-1.5 text-xs has-[[data-icon=inline-end]]:pr-1 has-[[data-icon=inline-start]]:pl-1 [&_svg]:size-3',
        dot: 'size-1.5',
      },
      md: {
        root: 'h-6 gap-1.5 px-2 text-xs has-[[data-icon=inline-end]]:pr-1.5 has-[[data-icon=inline-start]]:pl-1.5 [&_svg]:size-3.5',
        dot: 'size-2',
      },
      lg: {
        root: 'h-7 gap-1.5 px-2.5 text-sm has-[[data-icon=inline-end]]:pr-2 has-[[data-icon=inline-start]]:pl-2 [&_svg]:size-4',
        dot: 'size-2',
      },
    },
  },
  compoundVariants: [
    // Undotted: tinted surface, matching border, matching text.
    { variant: 'neutral', withDot: false, class: { root: 'border-border bg-muted text-muted-foreground' } },
    { variant: 'success', withDot: false, class: { root: 'border-success-border bg-success-muted text-success-muted-foreground' } },
    { variant: 'warning', withDot: false, class: { root: 'border-warning-border bg-warning-muted text-warning-muted-foreground' } },
    { variant: 'danger', withDot: false, class: { root: 'border-danger-border bg-danger-muted text-danger-muted-foreground' } },
    { variant: 'info', withDot: false, class: { root: 'border-info-border bg-info-muted text-info-muted-foreground' } },

    // Dotted: neutral chrome, so only the dot is coloured.
    { variant: 'neutral', withDot: true, class: { dot: 'bg-muted-foreground' } },
    { variant: 'success', withDot: true, class: { dot: 'bg-success' } },
    { variant: 'warning', withDot: true, class: { dot: 'bg-warning' } },
    { variant: 'danger', withDot: true, class: { dot: 'bg-danger' } },
    { variant: 'info', withDot: true, class: { dot: 'bg-info' } },
  ],
  defaultVariants: {
    variant: 'neutral',
    withDot: false,
    size: 'md',
  },
})

export type BadgeSlots = keyof ReturnType<typeof badgeTheme>
