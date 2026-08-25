import { tv } from 'tailwind-variants'

export const navigationMenuTheme = tv({
  slots: {
    root: 'relative z-10 flex max-w-max',
    list: 'flex list-none items-center gap-1',
    item: 'relative',
    link: 'group inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 data-[active]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
    triggerIcon: 'transition-transform duration-200 group-data-[state=open]:rotate-180',
    viewportWrapper: 'absolute flex items-start',
    viewport: 'relative box-content h-(--reka-navigation-menu-viewport-height) w-(--reka-navigation-menu-viewport-width) shrink-0 origin-top overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-lg transition-[width,height,translate] duration-200 ease-out data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    content: 'absolute top-0 left-0 grid w-max gap-1 p-2',
    panelLink: 'flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    panelLabel: 'block font-medium text-foreground',
    panelDescription: 'mt-0.5 block text-xs leading-snug text-muted-foreground',
    panelIcon: 'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground',
  },
  variants: {
    orientation: {
      horizontal: {
        viewportWrapper: 'top-full left-0 w-full pt-2',
        viewport: 'translate-x-(--reka-navigation-menu-viewport-left)',
      },
      vertical: {
        list: 'flex-col items-stretch',
        link: 'justify-start',
        viewportWrapper: 'top-0 left-full h-full pl-2',
        viewport: 'origin-left translate-y-(--reka-navigation-menu-viewport-top)',
      },
    },
    columns: {
      1: { content: 'grid-cols-1' },
      2: { content: 'grid-cols-2' },
      3: { content: 'grid-cols-3' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    columns: 1,
  },
})

export type NavigationMenuSlots = keyof ReturnType<typeof navigationMenuTheme>
