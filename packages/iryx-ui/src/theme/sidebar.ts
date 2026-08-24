import { tv } from 'tailwind-variants'

/*
 * Collapsing animates `width` on the root, not a transform, because the shell
 * lays the sidebar out as a real grid/flex track — a transform would slide the
 * panel out from under the main column and leave a gap where it used to be.
 *
 * Collapsed is icons-only rather than hidden: a sidebar that disappears costs
 * the user their place in the hierarchy. On small screens the answer is a
 * different component (`IDrawer`), not a narrower one.
 */
export const sidebarTheme = tv({
  slots: {
    root: 'flex h-full flex-col gap-2 border-border bg-background text-foreground transition-[width] duration-200 ease-out',
    header: 'flex shrink-0 items-center gap-2 px-3 py-3',
    /** The only scrolling region; header and footer stay pinned. */
    nav: 'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2',
    footer: 'flex shrink-0 items-center gap-2 border-t border-border px-3 py-3',
    section: 'flex flex-col gap-1',
    sectionLabel: 'px-2 pt-1 pb-0.5 text-xs font-medium tracking-wide text-muted-foreground uppercase',
    /**
     * `group` drives the collapsed treatment of the label and chevron, so the
     * link needs no separate collapsed class.
     */
    link: 'group/link relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 data-[active]:bg-accent data-[active]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    linkLabel: 'flex-1 truncate text-left',
    /** Count or status at the trailing edge. Hidden when collapsed. */
    linkBadge: 'ml-auto shrink-0',
    /**
     * Rotates when its group is open. The state lives on the trigger, not on
     * the icon, so this reads it through the trigger's `group/link` — a plain
     * `data-[state=open]:` here matches nothing and silently never rotates.
     *
     * Tailwind v4's `rotate-*` sets the independent `rotate` property rather
     * than `transform`, so `transition-transform` would not tween it either.
     */
    groupIcon: 'ml-auto size-4 shrink-0 transition-[rotate] duration-200 ease-out group-data-[state=open]/link:rotate-90',
    /**
     * The animated height box. Deliberately bare — see the keyframe comment in
     * `theme.css` for why margin and padding cannot live here.
     */
    groupContent: 'group/collapsible overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
    groupInner: 'iryx-sidebar-submenu mt-1 flex flex-col gap-1 border-l border-border group-data-[state=closed]/collapsible:animate-collapsible-content-out group-data-[state=open]/collapsible:animate-collapsible-content-in',
  },
  variants: {
    side: {
      left: { root: 'border-r' },
      right: { root: 'border-l' },
    },
    collapsed: {
      true: {
        root: 'w-16',
        header: 'justify-center px-0',
        footer: 'justify-center px-0',
        link: 'justify-center px-0',
        /*
         * `hidden`, not `sr-only` or opacity: a label still in the flow keeps
         * its width and the icon never centres. Screen readers read the link's
         * `aria-label` instead, which the component always sets.
         */
        linkLabel: 'hidden',
        linkBadge: 'hidden',
        sectionLabel: 'hidden',
        groupIcon: 'hidden',
      },
      false: { root: 'w-64' },
    },
  },
  defaultVariants: {
    side: 'left',
    collapsed: false,
  },
})

export type SidebarSlots = keyof ReturnType<typeof sidebarTheme>
