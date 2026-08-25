import { tv } from 'tailwind-variants'

export const scrollFadeTheme = tv({
  slots: {
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
