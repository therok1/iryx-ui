import { tv } from 'tailwind-variants'

export const sectionTheme = tv({
  slots: {
    root: 'w-full',
    header: 'flex flex-col gap-4',
    eyebrow: 'text-xs font-medium tracking-wide text-muted-foreground uppercase',
    heading: 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl',
    description: 'text-pretty text-muted-foreground',
    body: '',
  },
  variants: {
    tone: {
      default: {},
      muted: { root: 'bg-muted/20' },
    },
    bordered: {
      true: { root: 'border-t border-border' },
      false: {},
    },
    align: {
      start: { header: 'items-start text-left' },
      center: { header: 'mx-auto max-w-2xl items-center text-center' },
    },
    padding: {
      none: {},
      sm: { root: 'py-12 sm:py-16' },
      md: { root: 'py-20 sm:py-24' },
      lg: { root: 'py-24 sm:py-32' },
    },
    hasHeader: {
      true: { body: 'mt-12' },
      false: {},
    },
  },
  compoundVariants: [
    {
      align: 'start',
      class: { description: 'max-w-2xl' },
    },
  ],
  defaultVariants: {
    tone: 'default',
    bordered: false,
    align: 'center',
    padding: 'md',
  },
})

export type SectionSlots = keyof ReturnType<typeof sectionTheme>
