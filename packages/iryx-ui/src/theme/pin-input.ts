import { tv } from 'tailwind-variants'

export const pinInputTheme = tv({
  slots: {
    root: 'flex items-center',
    input: 'rounded-xl border border-border bg-input text-center font-medium text-foreground tabular-nums transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:z-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
    separator: 'text-muted-foreground select-none',
  },
  variants: {
    size: {
      sm: { root: 'gap-1.5', input: 'size-8 text-sm', separator: 'px-0.5 text-sm' },
      md: { root: 'gap-2', input: 'size-10 text-base', separator: 'px-1 text-base' },
      lg: { root: 'gap-2.5', input: 'size-12 text-lg', separator: 'px-1 text-lg' },
    },
    invalid: {
      true: { input: 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type PinInputSlots = keyof ReturnType<typeof pinInputTheme>
