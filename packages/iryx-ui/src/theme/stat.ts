import { tv } from 'tailwind-variants'

export const statTheme = tv({
  slots: {
    root: 'flex flex-col gap-2',
    label: 'text-xs font-medium tracking-wide text-muted-foreground uppercase',
    value: 'font-semibold tracking-tight text-foreground tabular-nums',
    delta: 'inline-flex shrink-0 items-center gap-0.5 text-xs font-medium tabular-nums [&_svg]:size-3.5',
    hint: 'text-xs text-muted-foreground',
    row: 'flex flex-wrap items-baseline gap-x-2 gap-y-1',
  },
  variants: {
    size: {
      sm: { value: 'text-2xl' },
      md: { value: 'text-3xl' },
      lg: { value: 'text-4xl' },
    },
    trend: {
      up: { delta: 'text-success' },
      down: { delta: 'text-danger' },
      neutral: { delta: 'text-muted-foreground' },
    },
  },
  defaultVariants: {
    size: 'md',
    trend: 'neutral',
  },
})

export type StatSlots = keyof ReturnType<typeof statTheme>
