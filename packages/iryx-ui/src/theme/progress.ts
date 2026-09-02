import { tv } from 'tailwind-variants'

export const progressTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-1.5',
    header: 'flex items-baseline justify-between gap-2 text-sm',
    label: 'font-medium text-foreground',
    value: 'text-muted-foreground tabular-nums',
    track: 'relative w-full overflow-hidden rounded-full bg-muted',
    indicator: 'h-full w-full flex-1 rounded-full transition-transform duration-300 ease-out',
    segment: 'h-full transition-[width] duration-300 ease-out first:rounded-l-full last:rounded-r-full',
    legend: 'flex flex-wrap items-center gap-x-4 gap-y-1',
    legendItem: 'flex items-center gap-1.5 text-xs text-muted-foreground',
    legendSwatch: 'size-2 shrink-0 rounded-full',
    legendValue: 'text-foreground tabular-nums',
    ring: '',
    ringTrack: 'fill-none stroke-muted',
    ringIndicator: 'fill-none transition-[stroke-dasharray] duration-300 ease-out',
    ringContent: 'absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center',
    ringValue: 'font-semibold text-foreground tabular-nums',
    ringLabel: 'text-xs text-muted-foreground',
  },
  variants: {
    shape: {
      linear: {},
      circle: { root: 'relative w-auto items-center' },
    },
    variant: {
      primary: {
        indicator: 'bg-linear-to-b from-primary-from to-primary-to',
        segment: 'bg-linear-to-b from-primary-from to-primary-to',
        legendSwatch: 'bg-primary',
        ringIndicator: 'stroke-primary',
      },
      success: { indicator: 'bg-success', segment: 'bg-success', legendSwatch: 'bg-success', ringIndicator: 'stroke-success' },
      warning: { indicator: 'bg-warning', segment: 'bg-warning', legendSwatch: 'bg-warning', ringIndicator: 'stroke-warning' },
      danger: { indicator: 'bg-danger', segment: 'bg-danger', legendSwatch: 'bg-danger', ringIndicator: 'stroke-danger' },
      info: { indicator: 'bg-info', segment: 'bg-info', legendSwatch: 'bg-info', ringIndicator: 'stroke-info' },
      neutral: { indicator: 'bg-muted-foreground', segment: 'bg-muted-foreground', legendSwatch: 'bg-muted-foreground', ringIndicator: 'stroke-muted-foreground' },
    },
    size: {
      sm: { track: 'h-1', ring: 'size-16', ringValue: 'text-xs' },
      md: { track: 'h-2', ring: 'size-24', ringValue: 'text-sm' },
      lg: { track: 'h-3', ring: 'size-32', ringValue: 'text-base' },
    },
    indeterminate: {
      true: {
        indicator: 'iryx-progress-indeterminate w-1/3 animate-progress-indeterminate',
        ring: 'motion-safe:animate-spin',
      },
    },
  },
  defaultVariants: {
    shape: 'linear',
    variant: 'primary',
    size: 'md',
  },
})

export type ProgressSlots = keyof ReturnType<typeof progressTheme>
