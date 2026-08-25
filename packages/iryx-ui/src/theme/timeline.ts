import { tv } from 'tailwind-variants'

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
    variant: {
      neutral: { marker: 'bg-muted-foreground' },
      primary: { marker: 'bg-primary' },
      success: { marker: 'bg-success' },
      warning: { marker: 'bg-warning' },
      danger: { marker: 'bg-danger' },
      info: { marker: 'bg-info' },
    },
    withIcon: {
      true: { marker: 'border border-border bg-background text-muted-foreground' },
    },
    last: {
      true: { content: 'pb-0' },
    },
  },
  compoundVariants: [
    { withIcon: true, size: 'sm', class: { marker: 'size-6 [&_svg]:size-3' } },
    { withIcon: true, size: 'md', class: { marker: 'size-7 [&_svg]:size-3.5' } },
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
