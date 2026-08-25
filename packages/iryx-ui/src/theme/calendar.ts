import { tv } from 'tailwind-variants'

/*
 * The month grid itself, shared by `ICalendar`, `IDatePicker` and
 * `IDateRangePicker`. It lived in the date picker's theme until `ICalendar`
 * became a component in its own right; the pickers now render the same
 * classes rather than a second copy of them.
 */
export const calendarTheme = tv({
  slots: {
    root: 'text-foreground',
    header: 'flex items-center justify-between gap-2 pb-3',
    heading: 'text-sm font-medium',
    nav: 'flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
    /**
     * `items-start`: flex would otherwise stretch a short month to match a
     * taller neighbour, spreading its rows apart. Paired with `fixed-weeks`,
     * which keeps every month six rows tall so nothing resizes as you page
     * through it.
     */
    months: 'flex items-start gap-4',
    grid: 'w-full border-collapse select-none',
    headCell: 'pb-1 text-xs font-normal text-muted-foreground',
    /**
     * The range bands are painted here, not on the trigger — see `range`.
     *
     * `transition-colors` fades the band in and out but deliberately leaves
     * `border-radius` untransitioned: animating the radius morphs the band's
     * shape as the preview moves, which reads as the corners wobbling.
     */
    cell: 'p-0 transition-colors',
    /**
     * `w-full`, not a fixed `size-8`: the table cell is wider than 32px, so a
     * fixed-width pill leaves a gap between consecutive days and a run renders
     * as a chain of lozenges with pinched corners instead of one band.
     *
     * Hover is suppressed on already-selected days so it cannot paint a
     * competing pill over the solid endpoint fill.
     *
     * `tabular-nums`: a proportional `1` is narrower than a `0`, so day numbers
     * sit off-centre in their pill and the columns of a month no longer line
     * up vertically — visible as a wobble down the week columns.
     */
    cellTrigger: 'flex h-8 w-full min-w-8 items-center justify-center rounded-lg text-sm tabular-nums transition-colors outline-none not-data-[selected]:hover:bg-accent not-data-[selected]:hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 data-[disabled]:pointer-events-none data-[disabled]:opacity-30 data-[outside-view]:text-muted-foreground/50 data-[today]:font-semibold data-[today]:text-primary data-[unavailable]:pointer-events-none data-[unavailable]:line-through data-[unavailable]:opacity-40',
  },
  variants: {
    /**
     * A single date is the whole selection, so it takes the solid fill. In a
     * range only the two endpoints do, and the days between get a flat tint —
     * emphasising all of them equally turns a long span into one solid block
     * that no longer shows where it starts and stops.
     *
     * The middle style excludes the endpoints with `not-*` rather than relying
     * on class order, so the two rules never compete for the background.
     */
    range: {
      false: {
        cellTrigger: 'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:data-[today]:text-primary-foreground',
      },
      /**
       * Reka's `data-highlighted` hover preview is deliberately left unstyled:
       * a band that follows the cursor has to reshape its rounded ends on
       * every move, and no combination of transitioning or not transitioning
       * the radius looks right while it does. Only the committed range is
       * drawn, so nothing under the pointer changes shape.
       *
       * The band goes on the cell and the endpoint pills on the trigger, so
       * a single element never has to be both. Only the run's outer edges are
       * rounded, so the days between meet flush.
       */
      true: {
        cell: [
          // Committed range only: a flat tint, never the solid fill.
          'has-data-[selected]:bg-primary/15',
          'has-data-[selection-start]:rounded-s-lg',
          'has-data-[selection-end]:rounded-e-lg',
        ].join(' '),
        cellTrigger: [
          // The band supplies the background for everything except the ends.
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

/** The slots a caller can restyle on a calendar, and on the pickers' grids. */
export type CalendarSlots = keyof ReturnType<typeof calendarTheme>
