import { tv } from 'tailwind-variants'

export const heroTheme = tv({
  slots: {
    root: 'iryx-hero w-full',
    container: '',
    badge: 'mb-6',
    heading: 'text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl',
    description: 'mt-6 text-lg text-pretty text-muted-foreground',
    actions: 'mt-9 flex flex-wrap items-center gap-3',
    note: 'mt-4 text-sm text-muted-foreground',
    media: 'mt-16',
  },
  variants: {
    align: {
      start: {},
      center: {
        container: 'text-center',
        heading: 'mx-auto max-w-3xl',
        description: 'mx-auto max-w-2xl',
        actions: 'justify-center',
        media: 'mx-auto',
      },
    },
    padding: {
      none: {},
      sm: { container: 'py-12 sm:py-16' },
      md: { container: 'py-20 sm:py-28' },
      lg: { container: 'py-28 sm:py-36' },
    },
  },
  compoundVariants: [
    {
      align: 'start',
      class: {
        heading: 'max-w-3xl',
        description: 'max-w-2xl',
      },
    },
  ],
  defaultVariants: {
    align: 'center',
    padding: 'md',
  },
})

export type HeroSlots = keyof ReturnType<typeof heroTheme>
