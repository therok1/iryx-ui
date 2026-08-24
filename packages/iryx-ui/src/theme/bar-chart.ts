import { tv } from 'tailwind-variants'

export const barChartTheme = tv({
  slots: {
    /*
     * `relative` so the accessible data table, which is positioned out of
     * sight, resolves against this root. Left static, its containing block
     * was the document, and its height counted towards the page scroll area
     * from outside every scroll container in between.
     */
    root: 'relative w-full text-primary',
    /**
     * The tooltip's coordinates come from the SVG, so the SVG has to be its
     * positioning context. Anchoring to the root instead shifts it up by the
     * height of anything above the plot — the legend, most obviously.
     */
    plot: 'relative',
    svg: 'block w-full overflow-visible',
    grid: 'stroke-border',
    tick: 'fill-muted-foreground text-xs [font-variant-numeric:tabular-nums]',
    category: 'fill-muted-foreground text-xs',
    bar: 'fill-current transition-opacity',
    /** Hit target, deliberately wider than the mark it selects. */
    hit: 'fill-transparent',
    faded: 'opacity-30',
    tooltip: 'pointer-events-none absolute z-10 flex items-baseline gap-1.5 rounded-lg border border-border bg-background px-2 py-1 text-xs whitespace-nowrap text-foreground shadow-md',
    tooltipLabel: 'text-muted-foreground',
    tooltipValue: 'font-medium [font-variant-numeric:tabular-nums]',
    table: 'sr-only',
  },
})

export type BarChartSlots = keyof ReturnType<typeof barChartTheme>
