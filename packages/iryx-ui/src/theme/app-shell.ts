import { tv } from 'tailwind-variants'

export const appShellTheme = tv({
  slots: {
    root: 'flex w-full flex-col bg-background text-foreground',
    header: 'z-30 shrink-0',
    headerRow: 'flex w-full items-center',
    headerContent: 'min-w-0 flex-1',
    navTrigger: 'ms-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-5',
    body: 'flex min-h-0 w-full flex-1',
    sidebar: 'shrink-0',
    main: 'flex min-w-0 flex-1 flex-col',
    footer: 'shrink-0',
    navDrawer: '',
    navDrawerBody: 'p-0 pt-12 [&>*]:h-full [&>*]:w-full [&>*]:border-0',
  },
  variants: {
    scroll: {
      main: {
        root: 'h-svh overflow-hidden',
        main: 'overflow-y-auto',
      },
      page: {
        root: 'min-h-svh',
        header: 'sticky top-0',
        /*
         * A full viewport height rather than a maximum. `self-start` is what
         * makes the sticky offset work inside the stretched body row, and it
         * also collapses the rail to the height of its own items — so a short
         * nav left the panel, its border and its background floating in the
         * middle of the page.
         */
        sidebar: 'sticky top-[var(--iryx-shell-header-height,0px)] h-[calc(100svh-var(--iryx-shell-header-height,0px))] self-start overflow-y-auto',
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
  },
  defaultVariants: {
    scroll: 'main',
    sidebarPosition: 'left',
  },
})

export type AppShellSlots = keyof ReturnType<typeof appShellTheme>
