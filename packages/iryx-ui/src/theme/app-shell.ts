import { tv } from 'tailwind-variants'

/*
 * `min-h-0` on the body and main is load-bearing in `main` mode: a flex child
 * defaults to `min-height: auto`, so the content column refuses to shrink
 * below its content and the page grows a second scrollbar instead of
 * scrolling inside.
 */
export const appShellTheme = tv({
  slots: {
    root: 'flex w-full flex-col bg-background text-foreground',
    header: 'z-30 shrink-0',
    /* The header is a row so the nav trigger can sit beside whatever the
     * app puts in the bar. `min-w-0` lets that content shrink rather than
     * pushing the trigger off the edge. */
    headerRow: 'flex w-full items-center',
    headerContent: 'min-w-0 flex-1',
    navTrigger: 'ms-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-5',
    body: 'flex min-h-0 w-full flex-1',
    sidebar: 'shrink-0',
    main: 'flex min-w-0 flex-1 flex-col',
    footer: 'shrink-0',
    /* Styled by IDrawer itself; present so ui.navDrawer has somewhere to land. */
    navDrawer: '',
    /*
     * The panel sizes the sidebar, rather than a width class meant for the
     * wide layout leaving its edge floating mid-panel. `pt-12` clears the
     * panel's own close button, which is absolutely positioned and would sit
     * on top of the first link. A sidebar that supplies its own header has
     * something up there already and can trade the padding back with
     * `ui.navDrawerBody`.
     */
    navDrawerBody: 'p-0 pt-12 [&>*]:h-full [&>*]:w-full [&>*]:border-0',
  },
  variants: {
    scroll: {
      main: {
        /* `svh`, not `vh`: mobile browsers count their collapsing toolbar in
         * `vh`, so the shell would sit taller than the visible viewport and
         * hide its own footer behind the chrome. */
        root: 'h-svh overflow-hidden',
        main: 'overflow-y-auto',
      },
      page: {
        root: 'min-h-svh',
        header: 'sticky top-0',
        /* Sticky needs a scroll container that is the document, so the sidebar
         * sticks under the header rather than scrolling away with the page. */
        sidebar: 'sticky top-[var(--iryx-shell-header-height,0px)] max-h-[calc(100svh-var(--iryx-shell-header-height,0px))] self-start overflow-y-auto',
      },
    },
    /*
     * Below the breakpoint the sidebar column is removed and the same slot
     * is rendered inside a drawer instead. Done in CSS rather than with a
     * media query in script: a JS breakpoint has to guess before mount, so
     * server-rendered markup and the first client frame disagree.
     */
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
