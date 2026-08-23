import { tv } from 'tailwind-variants'

export const scrollFadeTheme = tv({
  slots: {
    /*
     * `overscroll-contain` so a flick that reaches the end does not carry on
     * and scroll the page underneath — the fade says "there is more here", and
     * the container should behave like it owns that gesture.
     */
    root: 'relative min-h-0 overscroll-contain',
  },
  variants: {
    orientation: {
      vertical: { root: 'overflow-y-auto' },
      horizontal: { root: 'overflow-x-auto' },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

export type ScrollFadeSlots = keyof ReturnType<typeof scrollFadeTheme>
