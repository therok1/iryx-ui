import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const datePickerTheme = tv({
  slots: {
    trigger: `flex items-center justify-between gap-2 ${fieldBase} cursor-pointer [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-60`,
    placeholder: 'text-muted-foreground',
    content: 'z-50 rounded-xl border border-border bg-background p-3 text-foreground shadow-md',
    footer: 'flex items-center justify-between gap-2 pt-3',
    action: 'rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50',
  },
  variants: {
    size: {
      sm: { trigger: 'h-8 px-2.5 text-sm' },
      md: { trigger: 'h-9 px-3 text-sm' },
      lg: { trigger: 'h-10 px-4 text-base' },
    },
    invalid: {
      true: { trigger: 'border-red-500 focus-visible:ring-red-500/40' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type DatePickerSlots = keyof ReturnType<typeof datePickerTheme>
