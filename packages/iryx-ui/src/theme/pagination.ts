import { tv } from 'tailwind-variants'

export const paginationTheme = tv({
  slots: {
    root: 'flex items-center gap-2',
    list: 'flex items-center gap-1',
    item: 'inline-flex items-center justify-center rounded-lg border border-transparent text-sm font-medium transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
    /** The page the user is on. */
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
  },
  defaultVariants: {
    size: 'md',
  },
})

export type PaginationSlots = keyof ReturnType<typeof paginationTheme>
