import { tv } from 'tailwind-variants'

export const lineChartTheme = tv({
  slots: {
    root: 'w-full text-primary',
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
    line: 'fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
    area: 'fill-current stroke-none opacity-10',
    crosshair: 'stroke-border',
    marker: 'fill-current',
    /** Keeps the marker legible where it sits on top of the line. */
    markerRing: 'fill-background',
    hit: 'fill-transparent',
    tooltip: 'pointer-events-none absolute z-10 flex items-baseline gap-1.5 rounded-lg border border-border bg-background px-2 py-1 text-xs whitespace-nowrap text-foreground shadow-md',
    tooltipLabel: 'text-muted-foreground',
    tooltipValue: 'font-medium [font-variant-numeric:tabular-nums]',
    table: 'sr-only',
  },
})

export type LineChartSlots = keyof ReturnType<typeof lineChartTheme>
