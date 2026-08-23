import { tv } from 'tailwind-variants'

export const accordionTheme = tv({
  slots: {
    root: 'w-full',
    item: 'border-b border-border last:border-b-0',
    header: 'flex',
    /*
     * The chevron rotates on `data-[state=open]` read from the *trigger*, via
     * the group — `data-state` sits on the trigger, so a bare `data-[state]:`
     * on the icon inside it matches nothing at all. Same silent no-op that bit
     * the sidebar submenu.
     *
     * `transition-[rotate]`, not `transition-transform`: Tailwind v4's rotate
     * utilities set the independent `rotate` property, which `transform` does
     * not cover.
     */
    trigger: 'group/trigger flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-colors outline-none hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
    icon: 'size-4 shrink-0 text-muted-foreground transition-[rotate] duration-200 ease-out group-data-[state=open]/trigger:rotate-180',
    /**
     * The animated element carries no spacing of its own — margin is not part
     * of an animated height, so it survives the close as a gap under a panel
     * that is supposedly shut. All padding lives on the inner wrapper.
     */
    content: 'overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
    contentInner: 'pb-4',
  },
  variants: {
    variant: {
      plain: {},
      outline: {
        root: 'flex flex-col gap-2',
        item: 'rounded-xl border border-border px-4 last:border-b',
        content: 'pb-0',
      },
    },
  },
  defaultVariants: {
    variant: 'plain',
  },
})

export type AccordionSlots = keyof ReturnType<typeof accordionTheme>
