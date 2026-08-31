import { tv } from 'tailwind-variants'

export const featureCardTheme = tv({
  slots: {
    root: 'shadow-xs',
    icon: 'mb-4 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5',
    title: 'font-medium',
    description: 'mt-2 text-sm text-pretty text-muted-foreground',
  },
  variants: {
    align: {
      start: {},
      center: {
        root: 'text-center',
        icon: 'mx-auto',
      },
    },
  },
  defaultVariants: {
    align: 'start',
  },
})

export type FeatureCardSlots = keyof ReturnType<typeof featureCardTheme>
