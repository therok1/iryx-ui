import { tv } from 'tailwind-variants'

export const authProvidersTheme = tv({
  slots: {
    root: 'flex',
    provider: 'relative justify-center',
    icon: 'absolute left-3 inline-flex shrink-0 items-center',
    label: 'truncate',
  },
  variants: {
    layout: {
      stack: { root: 'flex-col' },
      inline: { root: 'flex-row' },
    },
    size: {
      xs: { root: 'gap-1.5', icon: 'left-2' },
      sm: { root: 'gap-2', icon: 'left-2.5' },
      md: { root: 'gap-2' },
      lg: { root: 'gap-2.5', icon: 'left-3.5' },
      xl: { root: 'gap-3', icon: 'left-4' },
    },
    compact: {
      false: { root: 'w-full', provider: 'w-full' },
      true: { root: 'w-fit', icon: 'static' },
    },
  },
  compoundVariants: [
    { layout: 'inline', compact: false, class: { provider: 'flex-1' } },
  ],
  defaultVariants: {
    layout: 'stack',
    size: 'md',
    compact: false,
  },
})

export type AuthProvidersSlots = keyof ReturnType<typeof authProvidersTheme>
