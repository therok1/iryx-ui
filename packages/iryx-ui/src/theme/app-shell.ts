import { tv } from 'tailwind-variants'

export const appShellTheme = tv({
  slots: {
    root: 'flex w-full flex-col bg-canvas text-foreground',
    topbar: 'shrink-0',
    body: 'flex min-h-0 w-full flex-1',
    sidebar: 'shrink-0',
    panel: 'flex min-w-0 flex-1 flex-col bg-background md:m-2 md:rounded-xl md:border md:border-border md:shadow-xs',
    header: 'z-30 shrink-0 border-b border-border bg-background md:rounded-t-xl',
    headerRow: 'flex w-full items-center',
    headerContent: 'min-w-0 flex-1',
    navTrigger: 'ms-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-5',
    main: 'flex min-w-0 flex-1 flex-col',
    footer: 'shrink-0 border-t border-border',
    navDrawer: '',
    navDrawerBody: 'p-0 pt-12 [&>*]:h-full [&>*]:w-full [&>*]:border-0',
  },
  variants: {
    scroll: {
      main: {
        root: 'h-svh overflow-hidden',
        panel: 'min-h-0 overflow-hidden',
        main: 'relative min-h-0 overflow-y-auto',
      },
      page: {
        root: 'min-h-svh',
        // Sticky header redraws the card's top margin, border and corners, which scroll away.
        header: 'sticky top-0 border-b-0 bg-canvas md:-mx-px md:-mt-[9px] md:rounded-none md:pt-2',
        headerRow: 'border-b border-border bg-background md:overflow-hidden md:rounded-t-xl md:border-x md:border-t',
        sidebar: 'sticky top-0 h-svh self-start overflow-y-auto',
      },
    },
    mobileNav: {
      true: { sidebar: 'hidden md:block', navTrigger: 'md:hidden' },
      false: { navTrigger: 'hidden' },
    },
    sidebarPosition: {
      left: {},
      right: { body: 'flex-row-reverse' },
    },
    hasSidebar: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    { hasSidebar: true, sidebarPosition: 'left', class: { panel: 'md:ms-0' } },
    { hasSidebar: true, sidebarPosition: 'right', class: { panel: 'md:me-0' } },
  ],
  defaultVariants: {
    scroll: 'main',
    sidebarPosition: 'left',
    hasSidebar: false,
  },
})

export type AppShellSlots = keyof ReturnType<typeof appShellTheme>
