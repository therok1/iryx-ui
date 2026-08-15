import { tv } from 'tailwind-variants'

/**
 * Shared by every multi-series chart. A legend is mandatory from two series
 * up: colour alone is not a dependable identity channel, and the swatch beside
 * the name is what makes it one.
 */
export const chartLegendTheme = tv({
  slots: {
    root: 'flex flex-wrap items-center gap-x-4 gap-y-1.5 pb-4',
    item: 'flex items-center gap-1.5 text-xs',
    /** The mark carries the series colour. */
    swatch: 'size-2.5 shrink-0 rounded-full',
    /** The text never does — a light hue is illegible as type on the surface. */
    name: 'text-muted-foreground',
  },
})

export type ChartLegendSlots = keyof ReturnType<typeof chartLegendTheme>
