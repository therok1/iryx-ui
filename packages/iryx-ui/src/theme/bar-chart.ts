import { tv } from 'tailwind-variants'

/**
 * Everything recessive except the bars. Grid and axis text sit one step off
 * the surface; the data is the only thing allowed to be loud.
 */
export const barChartTheme = tv({
  slots: {
    root: 'relative w-full text-primary',
    svg: 'block w-full overflow-visible',
    /** Hairline and solid — a dashed grid competes with the marks. */
    grid: 'stroke-border',
    /** Text never wears the series colour; identity comes from the mark. */
    tick: 'fill-muted-foreground text-xs [font-variant-numeric:tabular-nums]',
    category: 'fill-muted-foreground text-xs',
    bar: 'fill-current transition-opacity',
    /** Hit target, deliberately wider than the mark it selects. */
    hit: 'fill-transparent',
    /** Dims the rest of the series so the hovered bar reads as selected. */
    faded: 'opacity-30',
    tooltip: 'pointer-events-none absolute z-10 flex items-baseline gap-1.5 rounded-lg border border-border bg-background px-2 py-1 text-xs whitespace-nowrap text-foreground shadow-md',
    tooltipLabel: 'text-muted-foreground',
    tooltipValue: 'font-medium [font-variant-numeric:tabular-nums]',
    /** Reachable by screen readers and by nobody's eyes. */
    table: 'sr-only',
  },
})

export type BarChartSlots = keyof ReturnType<typeof barChartTheme>
