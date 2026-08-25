import { tv } from 'tailwind-variants'

export const badgeTheme = tv({
  slots: {
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
    withDot: {
      true: { root: 'border-border bg-background text-foreground' },
      false: {},
    },
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
    { variant: 'neutral', withDot: false, class: { root: 'border-border bg-muted text-muted-foreground' } },
    { variant: 'success', withDot: false, class: { root: 'border-success-border bg-success-muted text-success-muted-foreground' } },
    { variant: 'warning', withDot: false, class: { root: 'border-warning-border bg-warning-muted text-warning-muted-foreground' } },
    { variant: 'danger', withDot: false, class: { root: 'border-danger-border bg-danger-muted text-danger-muted-foreground' } },
    { variant: 'info', withDot: false, class: { root: 'border-info-border bg-info-muted text-info-muted-foreground' } },

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
