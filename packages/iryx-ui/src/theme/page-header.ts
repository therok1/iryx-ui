import { tv } from 'tailwind-variants'

export const pageHeaderTheme = tv({
  slots: {
    root: 'flex flex-col gap-4',
    top: '',
    row: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
    heading: 'flex min-w-0 flex-col gap-1',
    title: 'truncate text-2xl font-semibold tracking-tight text-foreground',
    description: 'text-sm text-muted-foreground',
    actions: 'flex shrink-0 items-center gap-2',
  },
  variants: {
    bordered: {
      true: { root: 'border-b border-border pb-4' },
    },
  },
  defaultVariants: {
    bordered: false,
  },
})

export type PageHeaderSlots = keyof ReturnType<typeof pageHeaderTheme>
