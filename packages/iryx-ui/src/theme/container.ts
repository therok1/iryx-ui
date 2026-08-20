import { tv } from 'tailwind-variants'

/*
 * `mx-auto` plus a max width, nothing more. It exists so that every page in an
 * app agrees on its reading measure without each one re-deciding — the value of
 * the component is the shared default, not the CSS.
 */
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
    /** Horizontal gutter. `none` leaves it to you. */
    gutter: {
      none: {},
      sm: { root: 'px-4' },
      md: { root: 'px-6' },
      lg: { root: 'px-8' },
    },
  },
  defaultVariants: {
    size: 'xl',
    gutter: 'md',
  },
})

export type ContainerSlots = keyof ReturnType<typeof containerTheme>
