import { tv } from 'tailwind-variants'

export const chartLegendTheme = tv({
  slots: {
    root: 'flex flex-wrap items-center gap-x-4 gap-y-1.5 pb-4',
    item: 'flex items-center gap-1.5 text-xs',
    swatch: 'size-2.5 shrink-0 rounded-full',
    /** The text never does — a light hue is illegible as type on the surface. */
    name: 'text-muted-foreground',
  },
})

export type ChartLegendSlots = keyof ReturnType<typeof chartLegendTheme>
