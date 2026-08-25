import { tv } from 'tailwind-variants'

export const donutChartTheme = tv({
  slots: {
    root: 'relative w-full text-primary',
    plot: 'relative',
    svg: 'block w-full overflow-visible',
    slice: 'fill-current transition-opacity',
    faded: 'opacity-30',
    center: 'pointer-events-none absolute flex flex-col items-center justify-center text-center text-foreground',
    tooltip: 'pointer-events-none absolute z-10 flex items-baseline gap-1.5 rounded-lg border border-border bg-background px-2 py-1 text-xs whitespace-nowrap text-foreground shadow-md',
    tooltipLabel: 'text-muted-foreground',
    tooltipValue: 'font-medium [font-variant-numeric:tabular-nums]',
    tooltipShare: 'text-muted-foreground [font-variant-numeric:tabular-nums]',
    table: 'sr-only',
  },
})

export type DonutChartSlots = keyof ReturnType<typeof donutChartTheme>
