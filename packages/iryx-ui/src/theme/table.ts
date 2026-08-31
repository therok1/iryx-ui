import { tv } from 'tailwind-variants'

export const tableTheme = tv({
  slots: {
    root: 'relative w-full overflow-x-auto',
    table: 'w-full caption-bottom border-collapse text-sm',
    thead: '',
    tbody: '',
    tr: 'border-b border-border transition-colors last:border-b-0',
    th: 'border-b border-border px-3 py-3 text-start align-middle text-xs font-semibold tracking-wide text-muted-foreground uppercase',
    sortButton: 'inline-flex cursor-pointer items-center gap-1.5 rounded-md tracking-wide uppercase transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-3.5 [&_svg]:shrink-0',
    sortIcon: 'text-muted-foreground/70 transition-colors',
    td: 'px-3 py-3 align-middle text-foreground',
    gutter: 'w-px px-3 py-3 align-middle',
    headGutter: 'w-px border-b border-border px-3 py-3 align-middle',
    actions: 'w-px px-3 py-3 text-end align-middle whitespace-nowrap',
    headActions: 'w-px border-b border-border px-3 py-3 align-middle',
    expandButton: 'inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[transform,color,background-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
    expandedRow: 'bg-muted/30',
    expandedCell: 'p-0',
    empty: 'px-3 py-10 text-center text-sm text-muted-foreground',
    caption: 'mt-3 text-sm text-muted-foreground',
  },
  variants: {
    striped: {
      true: { tr: 'even:bg-muted/30' },
    },
    hoverable: {
      true: { tr: 'hover:bg-muted/50' },
    },
    clickable: {
      true: { tr: 'cursor-pointer' },
    },
    stickyHeader: {
      true: { th: 'sticky top-0 z-10 bg-background' },
    },
    selected: {
      true: { tr: 'bg-primary/5' },
    },
    loading: {
      true: { thead: 'iryx-table-loading' },
    },
    size: {
      sm: { th: 'py-2', td: 'py-2', gutter: 'py-2', actions: 'py-2' },
      md: {},
      lg: { th: 'py-4', td: 'py-4', gutter: 'py-4', actions: 'py-4' },
    },
    align: {
      start: { th: 'text-start', td: 'text-start' },
      center: { th: 'text-center', td: 'text-center' },
      end: { th: 'text-end', td: 'text-end' },
    },
  },
  defaultVariants: {
    size: 'md',
    hoverable: true,
  },
})

export type TableSlots = keyof ReturnType<typeof tableTheme>
