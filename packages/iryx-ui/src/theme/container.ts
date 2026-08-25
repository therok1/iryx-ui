import { tv } from 'tailwind-variants'

export const containerTheme = tv({
  slots: {
    root: 'mx-auto w-full',
  },
  variants: {
    /*
     * Tailwind v4 scale, not the v3 `max-w-screen-*` utilities — those were
     * removed in v4 and generate nothing at all, silently.
     */
    size: {
      sm: { root: 'max-w-3xl' },
      md: { root: 'max-w-5xl' },
      lg: { root: 'max-w-6xl' },
      xl: { root: 'max-w-7xl' },
      /** Full bleed. Still centres and still takes the gutter. */
      full: { root: 'max-w-none' },
    },
    /*
     * Each gutter is a ramp, not a number: a phone needs the content close to
     * the edge to have any width left at all, and a wide window needs it well
     * clear of one. A single value has to pick a side, and picking the middle
     * is wrong at both ends.
     *
     * A caller who wants one fixed value takes `none` and sets their own.
     */
    gutter: {
      none: {},
      sm: { root: 'px-3 sm:px-4' },
      md: { root: 'px-4 sm:px-6 lg:px-8' },
      lg: { root: 'px-6 sm:px-8 lg:px-12' },
    },
  },
  defaultVariants: {
    size: 'xl',
    gutter: 'md',
  },
})

export type ContainerSlots = keyof ReturnType<typeof containerTheme>
