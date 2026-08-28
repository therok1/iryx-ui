import { tv } from 'tailwind-variants'

export const drawerTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    content: 'iryx-drawer fixed z-50 flex touch-none flex-col gap-4 overscroll-contain border-border bg-background p-6 text-foreground shadow-lg outline-none',
    handle: 'shrink-0 rounded-full bg-border',
    header: 'flex flex-col gap-1',
    title: 'text-base leading-none font-semibold',
    description: 'text-sm text-muted-foreground',
    body: '-m-1 min-h-0 flex-1 touch-auto overflow-y-auto p-1',
    footer: 'flex flex-wrap items-center justify-end gap-2',
    close: 'absolute top-4 right-4 rounded-lg p-1 text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
  },
  variants: {
    side: {
      right: {
        content: 'inset-y-0 right-0 h-dvh w-full border-l data-[state=closed]:animate-drawer-out-right data-[state=open]:animate-drawer-in-right',
        handle: 'absolute top-1/2 left-1.5 h-10 w-1 -translate-y-1/2',
      },
      left: {
        content: 'inset-y-0 left-0 h-dvh w-full border-r data-[state=closed]:animate-drawer-out-left data-[state=open]:animate-drawer-in-left',
        handle: 'absolute top-1/2 right-1.5 h-10 w-1 -translate-y-1/2',
      },
      top: {
        content: 'inset-x-0 top-0 w-full rounded-b-2xl border-b pb-4 data-[state=closed]:animate-drawer-out-top data-[state=open]:animate-drawer-in-top',
        handle: 'order-last mx-auto h-1 w-10',
      },
      bottom: {
        content: 'inset-x-0 bottom-0 w-full rounded-t-2xl border-t pt-4 data-[state=closed]:animate-drawer-out-bottom data-[state=open]:animate-drawer-in-bottom',
        handle: 'mx-auto h-1 w-10',
      },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
      xl: {},
      full: {},
    },
  },
  compoundVariants: [
    { side: ['left', 'right'], size: 'sm', class: { content: 'sm:max-w-sm' } },
    { side: ['left', 'right'], size: 'md', class: { content: 'sm:max-w-md' } },
    { side: ['left', 'right'], size: 'lg', class: { content: 'sm:max-w-lg' } },
    { side: ['left', 'right'], size: 'xl', class: { content: 'sm:max-w-2xl' } },
    { side: ['left', 'right'], size: 'full', class: { content: 'max-w-none' } },
    { side: ['top', 'bottom'], size: 'sm', class: { content: 'max-h-[25dvh]' } },
    { side: ['top', 'bottom'], size: 'md', class: { content: 'max-h-[40dvh]' } },
    { side: ['top', 'bottom'], size: 'lg', class: { content: 'max-h-[60dvh]' } },
    { side: ['top', 'bottom'], size: 'xl', class: { content: 'max-h-[80dvh]' } },
    { side: ['top', 'bottom'], size: 'full', class: { content: 'h-dvh max-h-none rounded-none' } },
  ],
  defaultVariants: {
    side: 'right',
    size: 'md',
  },
})

export type DrawerSlots = keyof ReturnType<typeof drawerTheme>
