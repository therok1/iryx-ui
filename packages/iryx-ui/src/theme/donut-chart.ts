import { tv } from 'tailwind-variants'

export const donutChartTheme = tv({
  slots: {
    /*
     * `relative` so the accessible data table, which is positioned out of
     * sight, resolves against this root rather than the document — see the
     * note on the table itself.
     */
    root: 'relative w-full text-primary',
    /** The tooltip's coordinates come from the SVG, so the SVG anchors it. */
    plot: 'relative',
    svg: 'block w-full overflow-visible',
    slice: 'fill-current transition-opacity',
    faded: 'opacity-30',
    /**
     * The hole. Sized and placed inline from the geometry, so this only
     * carries the look — a column centred on both axes, out of the way of
     * pointer events so the slice underneath still hovers at the edges.
     */
    /*
     * `text-foreground` because the root carries `text-primary` for the
     * slices' `fill-current` — without it the total in the hole inherits the
     * brand hue, which reads as a link rather than as a figure.
     */
    center: 'pointer-events-none absolute flex flex-col items-center justify-center text-center text-foreground',
    tooltip: 'pointer-events-none absolute z-10 flex items-baseline gap-1.5 rounded-lg border border-border bg-background px-2 py-1 text-xs whitespace-nowrap text-foreground shadow-md',
    tooltipLabel: 'text-muted-foreground',
    tooltipValue: 'font-medium [font-variant-numeric:tabular-nums]',
    tooltipShare: 'text-muted-foreground [font-variant-numeric:tabular-nums]',
    table: 'sr-only',
  },
})

export type DonutChartSlots = keyof ReturnType<typeof donutChartTheme>
