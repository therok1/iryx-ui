import { tv } from 'tailwind-variants'

export const radioGroupTheme = tv({
  slots: {
    root: '',
    wrapper: 'flex items-start gap-2.5',
    item: 'aspect-square shrink-0 cursor-pointer rounded-full border border-border bg-background transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary',
    indicator: 'flex size-full items-center justify-center after:block after:rounded-full after:bg-primary',
    content: 'grid gap-1',
    label: 'text-sm leading-5 text-foreground select-none',
    description: 'text-sm leading-snug text-muted-foreground',
  },
  variants: {
    size: {
      sm: { item: 'mt-0.5 size-3.5', indicator: 'after:size-1.5' },
      md: { item: 'mt-0.5 size-4', indicator: 'after:size-2' },
      lg: { item: 'size-5', indicator: 'after:size-2.5' },
    },
    orientation: {
      vertical: { root: 'grid gap-2' },
      horizontal: { root: 'flex flex-wrap items-start gap-x-6 gap-y-2' },
    },
    invalid: {
      true: { item: 'border-red-500 focus-visible:ring-red-500/40' },
    },
  },
  defaultVariants: {
    size: 'md',
    orientation: 'vertical',
  },
})

export type RadioGroupSlots = keyof ReturnType<typeof radioGroupTheme>
