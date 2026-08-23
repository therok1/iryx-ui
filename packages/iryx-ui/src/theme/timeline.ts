import { tv } from 'tailwind-variants'

/*
 * The spine is drawn per item rather than as one line behind the column, so
 * the last item can simply omit it — a single background line would run past
 * the final marker and trail off into nothing.
 *
 * Each row is a two-column grid (marker, content). The marker column is a
 * fixed width so every row's text starts at the same place no matter what
 * the markers contain.
 */
export const timelineTheme = tv({
  slots: {
    root: 'flex flex-col',
    item: 'relative grid grid-cols-[auto_1fr] gap-x-3',
    rail: 'flex flex-col items-center',
    marker: 'z-10 flex shrink-0 items-center justify-center rounded-full',
    line: 'w-px flex-1 bg-border',
    content: 'min-w-0 pb-6',
    header: 'flex flex-wrap items-baseline gap-x-2',
    title: 'font-medium text-foreground',
    /** Timestamps are numeric, so they line up when they are tabular. */
    time: 'text-xs text-muted-foreground tabular-nums',
    description: 'mt-1 text-sm text-muted-foreground',
  },
  variants: {
    size: {
      sm: {
        marker: 'size-2.5',
        content: 'pb-4 text-sm',
        title: 'text-sm',
      },
      md: {
        marker: 'size-3',
        content: 'pb-6 text-sm',
        title: 'text-sm',
      },
    },
    /*
     * Colour carries the status, but never alone — an item can also take an
     * icon, and the title always says what happened.
     */
    variant: {
      neutral: { marker: 'bg-muted-foreground' },
      primary: { marker: 'bg-primary' },
      success: { marker: 'bg-success' },
      warning: { marker: 'bg-warning' },
      danger: { marker: 'bg-danger' },
      info: { marker: 'bg-info' },
    },
    /**
     * An icon needs a real box to sit in, so the marker grows from a dot to a
     * ringed circle and the fill moves to a tint.
     */
    withIcon: {
      true: { marker: 'border border-border bg-background text-muted-foreground' },
    },
    /** The last item has nothing to connect to, so its spine is dropped. */
    last: {
      true: { content: 'pb-0' },
    },
  },
  compoundVariants: [
    { withIcon: true, size: 'sm', class: { marker: 'size-6 [&_svg]:size-3' } },
    { withIcon: true, size: 'md', class: { marker: 'size-7 [&_svg]:size-3.5' } },
    /* The tint follows the variant, but only once there is a box to tint. */
    { withIcon: true, variant: 'primary', class: { marker: 'border-primary/30 bg-primary/10 text-primary' } },
    { withIcon: true, variant: 'success', class: { marker: 'border-success/30 bg-success/10 text-success' } },
    { withIcon: true, variant: 'warning', class: { marker: 'border-warning/30 bg-warning/10 text-warning' } },
    { withIcon: true, variant: 'danger', class: { marker: 'border-danger/30 bg-danger/10 text-danger' } },
    { withIcon: true, variant: 'info', class: { marker: 'border-info/30 bg-info/10 text-info' } },
  ],
  defaultVariants: {
    size: 'md',
    variant: 'neutral',
  },
})

export type TimelineSlots = keyof ReturnType<typeof timelineTheme>
