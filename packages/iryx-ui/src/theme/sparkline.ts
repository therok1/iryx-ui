import { tv } from 'tailwind-variants'

/**
 * Colour comes from `currentColor`, so a sparkline recolours with a text
 * utility and follows the theme and appearance without any JS. That is the
 * whole reason these are SVG rather than canvas.
 */
export const sparklineTheme = tv({
  slots: {
    /** Carries the inset that keeps every mark inside the component's box. */
    root: 'block w-full text-primary',
    plot: 'block w-full overflow-visible',
    line: 'fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
    /*
     * The fill itself is a gradient, set as an attribute on the path — a
     * `<linearGradient>` cannot be named by a class. What is left here is
     * everything else about the wash.
     */
    area: 'stroke-none',
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
