import { tv } from 'tailwind-variants'

export const siteFooterTheme = tv({
  slots: {
    root: 'w-full',
    container: 'flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between',
    brand: 'flex items-center gap-2.5 text-sm font-medium',
    nav: 'flex flex-wrap gap-x-6 gap-y-2',
    link: 'rounded-sm text-sm text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50',
    note: 'text-sm text-muted-foreground',
  },
  variants: {
    bordered: {
      true: { root: 'border-t border-border' },
      false: {},
    },
    padding: {
      none: {},
      sm: { root: 'py-8' },
      md: { root: 'py-12' },
      lg: { root: 'py-16' },
    },
  },
  defaultVariants: {
    bordered: true,
    padding: 'md',
  },
})

export type SiteFooterSlots = keyof ReturnType<typeof siteFooterTheme>
