import { tv } from 'tailwind-variants'

export const barChartTheme = tv({
  slots: {
    root: 'relative w-full text-primary',
    plot: 'relative',
    svg: 'block w-full overflow-visible',
    grid: 'stroke-border',
    tick: 'fill-muted-foreground text-xs [font-variant-numeric:tabular-nums]',
    category: 'fill-muted-foreground text-xs',
    bar: 'fill-current transition-opacity',
    hit: 'fill-transparent',
    faded: 'opacity-30',
    tooltip: 'pointer-events-none absolute z-10 flex items-baseline gap-1.5 rounded-lg border border-border bg-background px-2 py-1 text-xs whitespace-nowrap text-foreground shadow-md',
    tooltipLabel: 'text-muted-foreground',
    tooltipValue: 'font-medium [font-variant-numeric:tabular-nums]',
    table: 'sr-only',
  },
})

export type BarChartSlots = keyof ReturnType<typeof barChartTheme>
