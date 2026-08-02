import { tv } from 'tailwind-variants'

/*
 * Status colours come from the --iryx-{success,warning,danger,info}-* tokens
 * in theme.css, which carry their own dark-mode values — so no dark: classes
 * are needed here, and applyTheme() can restyle them.
 */
export const progressTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-1.5',
    /** Only rendered when a label or value text is shown. */
    header: 'flex items-baseline justify-between gap-2 text-sm',
    label: 'font-medium text-foreground',
    value: 'text-muted-foreground tabular-nums',
    track: 'relative w-full overflow-hidden rounded-full bg-muted',
    indicator: 'h-full w-full flex-1 rounded-full transition-transform duration-300 ease-out',
  },
  variants: {
    variant: {
      primary: { indicator: 'bg-linear-to-b from-primary-from to-primary-to' },
      success: { indicator: 'bg-success' },
      warning: { indicator: 'bg-warning' },
      danger: { indicator: 'bg-danger' },
      info: { indicator: 'bg-info' },
    },
    size: {
      sm: { track: 'h-1' },
      md: { track: 'h-2' },
      lg: { track: 'h-3' },
    },
    /**
     * Unknown duration: the indicator slides back and forth instead of
     * tracking a value. `animate-progress-indeterminate` is defined in
     * theme.css so consumers get it without extra config.
     */
    indeterminate: {
      true: { indicator: 'w-1/3 animate-progress-indeterminate' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ProgressSlots = keyof ReturnType<typeof progressTheme>
