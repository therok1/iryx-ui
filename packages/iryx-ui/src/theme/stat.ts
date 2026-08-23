import { tv } from 'tailwind-variants'

/*
 * The delta colour comes from the --iryx-success/danger tokens, which carry
 * their own dark-mode values — no dark: classes needed.
 */
export const statTheme = tv({
  slots: {
    root: 'flex flex-col gap-2',
    label: 'text-xs font-medium tracking-wide text-muted-foreground uppercase',
    value: 'font-semibold tracking-tight text-foreground tabular-nums',
    /*
     * Coloured text with an arrow, not a filled pill. The pill competed with
     * the value for attention — the number is the point of a stat, and the
     * delta is a footnote to it. The arrow already encodes direction, so the
     * colour is reinforcement rather than the only signal.
     */
    delta: 'inline-flex items-center gap-0.5 text-xs font-medium tabular-nums [&_svg]:size-3.5',
    hint: 'text-xs text-muted-foreground',
    /*
     * The delta always sits on its own line. Inline reads tighter, but whether
     * it fits depends on how long that particular value is — so a row of cards
     * wraps unevenly, one tile breaking while its neighbours don't. A column
     * is the same shape whatever the number.
     */
    row: 'flex flex-col items-start gap-1.5',
  },
  variants: {
    size: {
      sm: { value: 'text-2xl' },
      md: { value: 'text-3xl' },
      lg: { value: 'text-4xl' },
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
