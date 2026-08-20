import { tv } from 'tailwind-variants'

/*
 * Title and actions sit on one row at `sm` and up, and stack below it. They
 * stack rather than wrap because an action row that wraps mid-group splits a
 * button pair across two lines, which reads as two unrelated controls.
 */
export const pageHeaderTheme = tv({
  slots: {
    root: 'flex flex-col gap-4',
    /** Holds the breadcrumb slot, above the title. */
    top: '',
    row: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
    heading: 'flex min-w-0 flex-col gap-1',
    title: 'truncate text-2xl font-semibold tracking-tight text-foreground',
    description: 'text-sm text-muted-foreground',
    /** `shrink-0` keeps the buttons at their natural width as the title grows. */
    actions: 'flex shrink-0 items-center gap-2',
  },
  variants: {
    /** A rule under the header, for pages that run straight into content. */
    bordered: {
      true: { root: 'border-b border-border pb-4' },
    },
  },
  defaultVariants: {
    bordered: false,
  },
})

export type PageHeaderSlots = keyof ReturnType<typeof pageHeaderTheme>
