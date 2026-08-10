import { tv } from 'tailwind-variants'

/*
 * The delta colour comes from the --iryx-success/danger tokens, which carry
 * their own dark-mode values — no dark: classes needed.
 */
export const statTheme = tv({
  slots: {
    root: 'flex flex-col gap-2',
    /** Small, uppercase and tracked out, so the value carries the weight. */
    label: 'text-xs font-medium tracking-wide text-muted-foreground uppercase',
    value: 'font-semibold tracking-tight text-foreground tabular-nums',
    /*
     * A pill rather than loose text, so the change reads at a glance. Padding
     * tightens on the side the arrow sits on, as on Button and Badge.
     */
    delta: 'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums has-[[data-icon=inline-end]]:pe-1 has-[[data-icon=inline-start]]:ps-1 [&_svg]:size-3.5',
    hint: 'text-xs text-muted-foreground',
    /** Column, so the delta always sits on its own line under the value. */
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
      up: { delta: 'bg-success-muted text-success-muted-foreground' },
      down: { delta: 'bg-danger-muted text-danger-muted-foreground' },
      neutral: { delta: 'bg-muted text-muted-foreground' },
    },
  },
  defaultVariants: {
    size: 'md',
    trend: 'neutral',
  },
})

export type StatSlots = keyof ReturnType<typeof statTheme>
