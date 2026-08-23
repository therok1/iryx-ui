import { tv } from 'tailwind-variants'

export const progressTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-1.5',
    /** Only rendered when a label or value text is shown. */
    header: 'flex items-baseline justify-between gap-2 text-sm',
    label: 'font-medium text-foreground',
    value: 'text-muted-foreground tabular-nums',
    track: 'relative w-full overflow-hidden rounded-full bg-muted',
    indicator: 'h-full w-full flex-1 rounded-full transition-transform duration-300 ease-out',
    /**
     * One run of a stacked bar. Width is inline (it is data), and only the
     * outer edges are rounded — an inner radius would leave notches where two
     * segments meet and read as a gap in the data rather than a boundary.
     */
    segment: 'h-full transition-[width] duration-300 ease-out first:rounded-l-full last:rounded-r-full',
    legend: 'flex flex-wrap items-center gap-x-4 gap-y-1',
    legendItem: 'flex items-center gap-1.5 text-xs text-muted-foreground',
    legendSwatch: 'size-2 shrink-0 rounded-full',
    legendValue: 'text-foreground tabular-nums',
  },
  variants: {
    variant: {
      primary: {
        indicator: 'bg-linear-to-b from-primary-from to-primary-to',
        segment: 'bg-linear-to-b from-primary-from to-primary-to',
        legendSwatch: 'bg-primary',
      },
      success: { indicator: 'bg-success', segment: 'bg-success', legendSwatch: 'bg-success' },
      warning: { indicator: 'bg-warning', segment: 'bg-warning', legendSwatch: 'bg-warning' },
      danger: { indicator: 'bg-danger', segment: 'bg-danger', legendSwatch: 'bg-danger' },
      info: { indicator: 'bg-info', segment: 'bg-info', legendSwatch: 'bg-info' },
      /** Unclaimed remainder, and the fallback for a segment with no variant. */
      neutral: { indicator: 'bg-muted-foreground', segment: 'bg-muted-foreground', legendSwatch: 'bg-muted-foreground' },
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
     *
     * `iryx-progress-indeterminate` is a plain hook, not a utility: the
     * reduced-motion rule in theme.css has to park this bar rather than let
     * the blanket guard run it once and leave it past the end of its track,
     * and a Tailwind class is not something that rule can address.
     */
    indeterminate: {
      true: { indicator: 'iryx-progress-indeterminate w-1/3 animate-progress-indeterminate' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ProgressSlots = keyof ReturnType<typeof progressTheme>
