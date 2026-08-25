import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

/*
 * The time field's chrome, because they are the same control with different
 * segments — a reader typing a date and a reader typing a time should not be
 * looking at two different fields.
 */
export const dateFieldTheme = tv({
  slots: {
    root: `inline-flex items-center gap-0.5 ${fieldBase} w-auto focus-within:ring-2 focus-within:ring-primary/50`,
    /*
     * `tabular-nums`: without it the field changes width as the digits change
     * and the segments jitter while someone is typing into them.
     */
    segment: 'rounded px-0.5 text-foreground tabular-nums outline-none focus:bg-primary focus:text-primary-foreground data-[disabled]:cursor-not-allowed',
    /** The separators between segments — punctuation, not somewhere to focus. */
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

export type DateFieldSlots = keyof ReturnType<typeof dateFieldTheme>
