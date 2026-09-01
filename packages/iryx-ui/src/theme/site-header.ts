import { tv } from 'tailwind-variants'

export const siteHeaderTheme = tv({
  slots: {
    root: 'w-full',
    container: 'flex h-16 items-center gap-6',
    brand: 'flex items-center gap-2.5 font-semibold tracking-tight',
    nav: 'ml-4 hidden items-center gap-1 md:flex',
    link: 'rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 aria-[current=page]:text-foreground',
    actions: 'ml-auto flex items-center gap-2',
    menu: 'flex flex-col',
    menuLink: 'rounded-lg px-3 py-2.5 text-sm transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary/50 aria-[current=page]:font-medium',
  },
  variants: {
    sticky: {
      true: { root: 'sticky top-0 z-40 bg-background/80 backdrop-blur' },
      false: { root: 'bg-background' },
    },
    bordered: {
      true: { root: 'border-b border-border' },
      false: {},
    },
  },
  defaultVariants: {
    sticky: true,
    bordered: true,
  },
})

export type SiteHeaderSlots = keyof ReturnType<typeof siteHeaderTheme>
