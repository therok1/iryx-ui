import { tv } from 'tailwind-variants'

export const containerTheme = tv({
  slots: {
    root: 'mx-auto w-full',
  },
  variants: {
    size: {
      sm: { root: 'max-w-3xl' },
      md: { root: 'max-w-5xl' },
      lg: { root: 'max-w-6xl' },
      xl: { root: 'max-w-7xl' },
      full: { root: 'max-w-none' },
    },
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
