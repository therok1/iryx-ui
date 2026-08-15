import { tv } from 'tailwind-variants'

/**
 * Colour comes from `currentColor`, so a sparkline recolours with a text
 * utility and follows the theme and appearance without any JS. That is the
 * whole reason these are SVG rather than canvas.
 */
export const sparklineTheme = tv({
  slots: {
    root: 'block w-full overflow-visible text-primary',
    /** 2px, round join and cap, per the shared line-mark spec. */
    line: 'fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
    /** A wash at ~10%, never a saturated block competing with the line. */
    area: 'fill-current stroke-none opacity-10',
    dot: 'stroke-current [stroke-linecap:round]',
    /** Keeps the end dot legible where it sits on top of the line. */
    ring: '[stroke:var(--iryx-background)] [stroke-linecap:round]',
  },
  variants: {
    muted: {
      true: { root: 'text-muted-foreground' },
    },
  },
})

export type SparklineSlots = keyof ReturnType<typeof sparklineTheme>
