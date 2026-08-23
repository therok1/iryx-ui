import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

/*
 * Each part of the time is its own segment, so the chrome goes on the field
 * and the highlight goes on the segment the reader is editing. A single
 * `<input type="time">` would be less code but gives no control over the
 * hour cycle, the granularity, or how a screen reader announces each part.
 */
export const timeFieldTheme = tv({
  slots: {
    root: `inline-flex items-center gap-0.5 ${fieldBase} w-auto focus-within:ring-2 focus-within:ring-primary/50`,
    /*
     * `tabular-nums` matters more here than anywhere: without it the field
     * changes width as the digits change, and the segments jitter while
     * someone is typing into them.
     */
    segment: 'rounded px-0.5 text-foreground tabular-nums outline-none focus:bg-primary focus:text-primary-foreground data-[disabled]:cursor-not-allowed',
    /** The `:` between segments — punctuation, not something to focus. */
    literal: 'text-muted-foreground',
  },
  variants: {
    size: {
      sm: { root: 'h-8 px-2.5 text-sm' },
      md: { root: 'h-9 px-3 text-sm' },
      lg: { root: 'h-10 px-4 text-base' },
    },
    invalid: {
      true: { root: 'border-red-500 focus-within:ring-red-500/40' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TimeFieldSlots = keyof ReturnType<typeof timeFieldTheme>
