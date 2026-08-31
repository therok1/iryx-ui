import { tv } from 'tailwind-variants'

export const accordionTheme = tv({
  slots: {
    root: 'w-full',
    item: 'border-b border-border last:border-b-0',
    header: 'flex',
    trigger: 'group/trigger flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-[color,background-color,border-color,box-shadow] outline-none hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
    icon: 'size-4 shrink-0 text-muted-foreground transition-[rotate] duration-200 ease-out group-data-[state=open]/trigger:rotate-180',
    content: 'overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-collapsible-down',
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
