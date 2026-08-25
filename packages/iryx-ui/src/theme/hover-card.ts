import { tv } from 'tailwind-variants'

export const hoverCardTheme = tv({
  slots: {
    content: 'z-50 rounded-xl border border-border bg-background text-foreground shadow-lg outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    arrow: 'fill-background stroke-border',
  },
  variants: {
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

export type HoverCardSlots = keyof ReturnType<typeof hoverCardTheme>
