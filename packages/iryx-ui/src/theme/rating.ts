import { tv } from 'tailwind-variants'

export const ratingTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-2',
    items: 'flex items-center',
    item: 'relative isolate shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    empty: 'text-muted-foreground/40',
    fill: 'absolute inset-y-0 left-0 overflow-hidden text-warning',
    label: 'text-sm text-muted-foreground tabular-nums',
  },
  variants: {
    size: {
      sm: { item: 'size-4', empty: 'size-4', fill: '[&_svg]:size-4' },
      md: { item: 'size-5', empty: 'size-5', fill: '[&_svg]:size-5' },
      lg: { item: 'size-6', empty: 'size-6', fill: '[&_svg]:size-6' },
    },
    interactive: {
      true: {
        item: 'cursor-pointer transition-transform hover:scale-110 active:scale-95',
        items: 'gap-0.5',
      },
      false: { items: 'gap-0.5' },
    },
    disabled: {
      true: { root: 'pointer-events-none opacity-50' },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    interactive: false,
    disabled: false,
  },
})

export type RatingSlots = keyof ReturnType<typeof ratingTheme>
