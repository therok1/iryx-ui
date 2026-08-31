import { tv } from 'tailwind-variants'

export const pricingCardTheme = tv({
  slots: {
    root: '',
    header: 'flex items-center justify-between gap-2',
    name: 'font-medium',
    price: 'flex items-baseline gap-1.5',
    amount: 'text-4xl font-semibold tracking-tight tabular-nums',
    period: 'text-sm text-muted-foreground',
    description: 'mt-2 text-sm text-pretty text-muted-foreground',
    features: 'mt-6 flex flex-col gap-2.5',
    feature: 'flex items-start gap-2 text-sm',
    featureIcon: 'mt-0.5 size-4 shrink-0 text-primary',
  },
  variants: {
    featured: {
      true: { root: 'border-primary shadow-md ring-1 ring-primary/20' },
      false: { root: 'shadow-xs' },
    },
  },
  defaultVariants: {
    featured: false,
  },
})

export type PricingCardSlots = keyof ReturnType<typeof pricingCardTheme>
