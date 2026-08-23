import { tv } from 'tailwind-variants'

/*
 * Same chrome as the dropdown menu's panel — border, radius, shadow, fade —
 * because they are the same object to a reader: a small surface anchored to
 * the thing that opened it. The difference is what goes inside, so only the
 * padding and width differ.
 */
export const popoverTheme = tv({
  slots: {
    content: 'z-50 rounded-xl border border-border bg-background text-foreground shadow-lg outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    /*
     * The arrow is a filled triangle with a stroked edge, so it carries both
     * the panel's surface and its border across the gap.
     */
    arrow: 'fill-background stroke-border',
    close: 'absolute top-2 right-2 rounded-lg p-1 text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
    /** Heading line. The only row that has to make way for the close button. */
    title: 'mb-2 text-sm font-medium text-foreground',
  },
  variants: {
    /** Insets the heading alone, leaving the body free to fill the panel. */
    withClose: {
      true: { title: 'pr-6' },
    },
    padding: {
      none: { content: 'p-0' },
      sm: { content: 'p-3' },
      md: { content: 'p-4' },
      lg: { content: 'p-6' },
    },
    /*
     * A width is deliberately part of the default: an unconstrained popover
     * sizes to its content, and a paragraph of text then stretches to the
     * viewport. `none` opts out for content that knows its own size, such as
     * a colour grid or a menu.
     */
    width: {
      none: {},
      sm: { content: 'w-56' },
      md: { content: 'w-72' },
      lg: { content: 'w-88' },
    },
  },
  /*
   * The close button is *not* given room by padding the panel. Reserving it
   * on the container indented every row, so a form inside stopped short of
   * the right edge and could never be full width — the button only occupies
   * the top corner, so only the top corner should pay for it.
   *
   * It sits in the panel's own padding instead. A long first line would run
   * under it, which is what `title` is for: that line gets the inset, and
   * nothing else does.
   */
  defaultVariants: {
    padding: 'md',
    width: 'md',
  },
})

export type PopoverSlots = keyof ReturnType<typeof popoverTheme>
