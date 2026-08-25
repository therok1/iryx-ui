import { tv } from 'tailwind-variants'

export const calendarTheme = tv({
  slots: {
    root: 'w-fit text-foreground',
    header: 'flex items-center justify-between gap-2 pb-3',
    heading: 'text-sm font-medium',
    nav: 'flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
    months: 'flex items-start gap-4',
    grid: 'w-full border-collapse select-none',
    headCell: 'pb-1 text-xs font-normal text-muted-foreground',
    cell: 'p-0 transition-colors',
    cellTrigger: 'flex h-8 w-full min-w-8 items-center justify-center rounded-lg text-sm tabular-nums transition-colors outline-none not-data-[selected]:hover:bg-accent not-data-[selected]:hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 data-[disabled]:pointer-events-none data-[disabled]:opacity-30 data-[outside-view]:text-muted-foreground/50 data-[today]:font-semibold data-[today]:text-primary data-[unavailable]:pointer-events-none data-[unavailable]:line-through data-[unavailable]:opacity-40',
  },
  variants: {
    range: {
      false: {
        cellTrigger: 'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:data-[today]:text-primary-foreground',
      },
      true: {
        cell: [
          'has-data-[selected]:bg-primary/15',
          'has-data-[selection-start]:rounded-s-lg',
          'has-data-[selection-end]:rounded-e-lg',
        ].join(' '),
        cellTrigger: [
          'data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary',
          'data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary',
        ].join(' '),
      },
    },
  },
  defaultVariants: {
    range: false,
  },
})

export type CalendarSlots = keyof ReturnType<typeof calendarTheme>
