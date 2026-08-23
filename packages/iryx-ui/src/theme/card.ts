import { tv } from 'tailwind-variants'

export const cardTheme = tv({
  slots: {
    root: 'rounded-2xl text-foreground',
    /** Only rendered when a title, description or header slot is provided. */
    header: 'flex flex-col gap-1.5',
    title: 'text-base leading-snug font-semibold',
    description: 'text-sm text-muted-foreground',
    body: '',
    /** Only rendered when a footer slot is provided. */
    footer: 'flex items-center gap-2',
  },
  variants: {
    variant: {
      outline: { root: 'border border-border bg-background' },
      soft: { root: 'bg-muted' },
    },
    padding: {
      none: {},
      sm: { root: 'p-4', header: 'mb-3', footer: 'mt-3' },
      md: { root: 'p-6', header: 'mb-4', footer: 'mt-4' },
      lg: { root: 'p-8', header: 'mb-6', footer: 'mt-6' },
    },
  },
  defaultVariants: {
    variant: 'outline',
    padding: 'md',
  },
})

export type CardSlots = keyof ReturnType<typeof cardTheme>
