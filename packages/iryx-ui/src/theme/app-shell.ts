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
    body: 'flex min-h-0 w-full flex-1',
    sidebar: 'shrink-0',
    main: 'flex min-w-0 flex-1 flex-col',
    footer: 'shrink-0',
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
