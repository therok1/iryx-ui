import { tv } from 'tailwind-variants'

export const collapsibleTheme = tv({
  slots: {
    root: 'w-full',
    trigger: 'flex w-full items-center gap-2 rounded-lg text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    content: 'overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
    icon: 'shrink-0 text-muted-foreground transition-transform duration-200',
  },
  variants: {
    iconPosition: {
      start: { icon: 'order-first' },
      end: { icon: 'order-last ml-auto' },
    },
  },
  defaultVariants: {
    iconPosition: 'end',
  },
})

export type CollapsibleSlots = keyof ReturnType<typeof collapsibleTheme>
