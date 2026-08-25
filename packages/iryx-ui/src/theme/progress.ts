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
      neutral: { indicator: 'bg-muted-foreground', segment: 'bg-muted-foreground', legendSwatch: 'bg-muted-foreground' },
    },
    size: {
      sm: { track: 'h-1' },
      md: { track: 'h-2' },
      lg: { track: 'h-3' },
    },
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
