import { tv } from 'tailwind-variants'

/*
 * A custom scrollbar, not a custom scroll. The viewport still scrolls
 * natively — wheel, trackpad, keyboard and touch all behave exactly as the
 * platform intends — and only the bar itself is replaced, so it can be thin
 * and themed without any of the usual costs of hijacking scrolling.
 *
 * Different job from `IScrollFade`, which leaves the native bar alone and
 * fades the content edges to signal there is more.
 */
export const scrollAreaTheme = tv({
  slots: {
    root: 'relative overflow-hidden',
    viewport: 'size-full rounded-[inherit]',
    /*
     * `touch-none` and `select-none`: dragging the bar must not scroll the
     * page underneath it or start selecting the content it sits over.
     */
    scrollbar: 'flex touch-none p-0.5 transition-colors select-none',
    thumb: 'relative flex-1 rounded-full bg-border transition-colors hover:bg-muted-foreground',
    /** Fills the square where a horizontal and a vertical bar meet. */
    corner: 'bg-transparent',
  },
  variants: {
    orientation: {
      vertical: { scrollbar: 'h-full border-l border-l-transparent' },
      horizontal: { scrollbar: 'flex-col border-t border-t-transparent' },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },
  compoundVariants: [
    { orientation: 'vertical', size: 'sm', class: { scrollbar: 'w-1.5' } },
    { orientation: 'vertical', size: 'md', class: { scrollbar: 'w-2.5' } },
    { orientation: 'vertical', size: 'lg', class: { scrollbar: 'w-3.5' } },
    { orientation: 'horizontal', size: 'sm', class: { scrollbar: 'h-1.5' } },
    { orientation: 'horizontal', size: 'md', class: { scrollbar: 'h-2.5' } },
    { orientation: 'horizontal', size: 'lg', class: { scrollbar: 'h-3.5' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type ScrollAreaSlots = keyof ReturnType<typeof scrollAreaTheme>
