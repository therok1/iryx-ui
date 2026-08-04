import { tv } from 'tailwind-variants'

/*
 * The delta colour comes from the --iryx-success/danger tokens, which carry
 * their own dark-mode values — no dark: classes needed.
 */
export const statTheme = tv({
  slots: {
    root: 'flex flex-col gap-1',
    label: 'text-sm font-medium text-muted-foreground',
    value: 'font-semibold text-foreground tabular-nums',
    /** Only rendered when a delta is given. */
    delta: 'inline-flex items-center gap-1 text-sm font-medium tabular-nums [&_svg]:size-4',
    hint: 'text-xs text-muted-foreground',
    row: 'flex items-baseline gap-2',
  },
  variants: {
    size: {
      sm: { value: 'text-xl' },
      md: { value: 'text-2xl' },
      lg: { value: 'text-3xl' },
    },
    /**
     * Direction of change. `neutral` is used when the delta is zero, so a flat
     * result does not read as either good or bad.
     */
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
