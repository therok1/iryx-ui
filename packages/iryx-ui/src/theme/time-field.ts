import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const timeFieldTheme = tv({
  slots: {
    root: `inline-flex items-center gap-0.5 ${fieldBase} w-auto focus-within:ring-2 focus-within:ring-primary/50`,
    segment: 'rounded px-0.5 text-foreground tabular-nums outline-none focus-visible:bg-primary focus-visible:text-primary-foreground data-[disabled]:cursor-not-allowed',
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
