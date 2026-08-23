import { tv } from 'tailwind-variants'

export const tableTheme = tv({
  slots: {
    /** Scroll container — the table itself never shrinks below its content. */
    root: 'relative w-full overflow-x-auto',
    table: 'w-full caption-bottom border-collapse text-sm',
    thead: '',
    tbody: '',
    /*
     * The rule separates rows, so the last one drops it — otherwise a flat line
     * cuts across whatever the table sits in, which reads as a broken edge
     * inside a rounded card.
     */
    tr: 'border-b border-border transition-colors last:border-b-0',
    /* The header keeps its rule: it divides the head from the body, not rows. */
    th: 'border-b border-border px-3 py-3 text-start align-middle text-xs font-semibold tracking-wide text-muted-foreground uppercase',
    /**
     * Header sort control. A real button so it is tabbable and announced as
     * one; the `<th>` carries `aria-sort` for the state.
     */
    /*
     * `uppercase` is repeated from `th`: a button does not inherit
     * `text-transform`, so a sortable header rendered in sentence case beside
     * its uppercase neighbours.
     */
    sortButton: 'inline-flex cursor-pointer items-center gap-1.5 rounded-md tracking-wide uppercase outline-none focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-3.5 [&_svg]:shrink-0',
    sortIcon: 'text-muted-foreground/70 transition-colors',
    td: 'px-3 py-3 align-middle text-foreground',
    /*
     * Narrow gutters for the checkbox and expand controls. They sit in both the
     * head and the body, so the head/body rule is drawn by the header cell that
     * uses this slot too — otherwise it breaks across the gutter columns.
     */
    gutter: 'w-px px-3 py-3 align-middle',
    headGutter: 'w-px border-b border-border px-3 py-3 align-middle',
    /* The trailing actions column: as narrow as its content, pinned right. */
    actions: 'w-px px-3 py-3 text-end align-middle whitespace-nowrap',
    headActions: 'w-px border-b border-border px-3 py-3 align-middle',
    expandButton: 'inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[transform,color,background-color] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
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
    /**
     * Refreshing: an indeterminate bar riding the rule between the header and
     * the first row, which is where a table conventionally shows progress.
     *
     * Plain class rather than utilities, like the drawer's drag plumbing — it
     * is a keyframed `background-position` on a pseudo-element, and there is
     * no class name for Tailwind to generate. Defined in `theme.css`.
     */
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
