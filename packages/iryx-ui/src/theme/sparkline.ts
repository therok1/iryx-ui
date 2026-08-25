import { tv } from 'tailwind-variants'

export const sparklineTheme = tv({
  slots: {
    root: 'block w-full text-primary',
    plot: 'block w-full overflow-visible',
    line: 'fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
    area: 'stroke-none',
    dot: 'stroke-current [stroke-linecap:round]',
    ring: '[stroke:var(--iryx-background)] [stroke-linecap:round]',
  },
  variants: {
    muted: {
      true: { root: 'text-muted-foreground' },
    },
  },
})

export type SparklineSlots = keyof ReturnType<typeof sparklineTheme>
