import { tv } from 'tailwind-variants'

export const dropdownMenuTheme = tv({
  slots: {
    content: 'z-50 min-w-40 overflow-hidden rounded-xl border border-border bg-background p-1 text-foreground shadow-lg outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    item: 'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
    label: 'px-2 py-1.5 text-xs font-medium text-muted-foreground',
    separator: '-mx-1 my-1 h-px bg-border',
    /** Same chrome as an item, plus a trailing chevron and an open state. */
    subTrigger: 'flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
    subContent: 'z-50 min-w-40 overflow-hidden rounded-xl border border-border bg-background p-1 text-foreground shadow-lg outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    /** Pushes the submenu chevron to the trailing edge. */
    subTriggerIcon: 'ml-auto',
  },
  variants: {
    /** Destructive items read in the danger colour, including when highlighted. */
    danger: {
      true: { item: 'text-danger data-[highlighted]:bg-danger-muted data-[highlighted]:text-danger-muted-foreground' },
    },
  },
})

export type DropdownMenuSlots = keyof ReturnType<typeof dropdownMenuTheme>
