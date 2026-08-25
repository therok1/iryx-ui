import { tv } from 'tailwind-variants'

export const popoverTheme = tv({
  slots: {
    content: 'z-50 rounded-xl border border-border bg-background text-foreground shadow-lg outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    arrow: 'fill-background stroke-border',
    close: 'absolute top-2 right-2 rounded-lg p-1 text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
    title: 'mb-2 text-sm font-medium text-foreground',
  },
  variants: {
    withClose: {
      true: { title: 'pr-6' },
    },
    padding: {
      none: { content: 'p-0' },
      sm: { content: 'p-3' },
      md: { content: 'p-4' },
      lg: { content: 'p-6' },
    },
    width: {
      none: {},
      sm: { content: 'w-56' },
      md: { content: 'w-72' },
      lg: { content: 'w-88' },
    },
  },
  defaultVariants: {
    padding: 'md',
    width: 'md',
  },
})

export type PopoverSlots = keyof ReturnType<typeof popoverTheme>
