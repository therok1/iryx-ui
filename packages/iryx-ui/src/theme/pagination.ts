import { tv } from 'tailwind-variants'

export const paginationTheme = tv({
  slots: {
    root: 'flex items-center gap-2',
    list: 'flex items-center gap-1',
    item: 'inline-flex items-center justify-center rounded-xl border border-transparent text-sm font-medium transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
    active: 'bg-linear-to-b from-primary-from to-primary-to text-primary-foreground hover:brightness-110',
    inactive: 'text-foreground hover:bg-accent hover:text-accent-foreground',
    ellipsis: 'inline-flex items-center justify-center text-sm text-muted-foreground',
  },
  variants: {
    size: {
      sm: { item: 'h-8 min-w-8 px-2', ellipsis: 'h-8 min-w-8' },
      md: { item: 'h-9 min-w-9 px-2.5', ellipsis: 'h-9 min-w-9' },
      lg: { item: 'h-10 min-w-10 px-3', ellipsis: 'h-10 min-w-10' },
    },
    /*
     * The root fills its parent, so this places the whole control. Centred by
     * default because pagination normally sits under the content it pages.
     */
    align: {
      start: { root: 'justify-start' },
      center: { root: 'justify-center' },
      end: { root: 'justify-end' },
    },
  },
  defaultVariants: {
    size: 'sm',
    align: 'center',
  },
})

export type PaginationSlots = keyof ReturnType<typeof paginationTheme>
