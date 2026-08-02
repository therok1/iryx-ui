import { tv } from 'tailwind-variants'

/*
 * Status colours come from the --iryx-{success,warning,danger,info}-* tokens
 * in theme.css, which carry their own dark-mode values — so no dark: classes
 * are needed here, and applyTheme() can restyle them.
 */
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
    size: {
      sm: { root: 'h-5 gap-1 px-2 text-xs [&_svg]:size-3', dot: 'size-1.5' },
      md: { root: 'h-6 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5', dot: 'size-2' },
      lg: { root: 'h-7 gap-1.5 px-3 text-sm [&_svg]:size-4', dot: 'size-2' },
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
