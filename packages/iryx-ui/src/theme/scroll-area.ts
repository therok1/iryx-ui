import { tv } from 'tailwind-variants'

export const scrollAreaTheme = tv({
  slots: {
    root: 'relative overflow-hidden',
    viewport: 'size-full rounded-[inherit]',
    scrollbar: 'flex touch-none p-0.5 transition-colors select-none',
    thumb: 'relative flex-1 rounded-full bg-border transition-colors hover:bg-muted-foreground',
    corner: 'bg-transparent',
  },
  variants: {
    orientation: {
      vertical: { scrollbar: 'h-full border-l border-l-transparent' },
      horizontal: { scrollbar: 'flex-col border-t border-t-transparent' },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },
  compoundVariants: [
    { orientation: 'vertical', size: 'sm', class: { scrollbar: 'w-1.5' } },
    { orientation: 'vertical', size: 'md', class: { scrollbar: 'w-2.5' } },
    { orientation: 'vertical', size: 'lg', class: { scrollbar: 'w-3.5' } },
    { orientation: 'horizontal', size: 'sm', class: { scrollbar: 'h-1.5' } },
    { orientation: 'horizontal', size: 'md', class: { scrollbar: 'h-2.5' } },
    { orientation: 'horizontal', size: 'lg', class: { scrollbar: 'h-3.5' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type ScrollAreaSlots = keyof ReturnType<typeof scrollAreaTheme>
