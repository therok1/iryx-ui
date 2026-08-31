import { tv } from 'tailwind-variants'

export const testimonialCardTheme = tv({
  slots: {
    root: 'shadow-xs',
    quote: 'text-pretty',
    author: 'flex items-center gap-3',
    identity: 'min-w-0',
    name: 'truncate text-sm font-medium',
    role: 'truncate text-xs text-muted-foreground',
  },
  variants: {
    size: {
      sm: { quote: 'text-sm' },
      md: {},
      lg: { quote: 'text-lg' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TestimonialCardSlots = keyof ReturnType<typeof testimonialCardTheme>
