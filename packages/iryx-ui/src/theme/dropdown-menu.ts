import { tv } from 'tailwind-variants'

export const dropdownMenuTheme = tv({
  slots: {
    content: 'z-50 min-w-40 overflow-hidden rounded-xl border border-border bg-background p-1 text-foreground shadow-lg outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    item: 'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
    label: 'px-2 py-1.5 text-xs font-medium text-muted-foreground',
    header: '-mx-1 -mt-1 mb-1 border-b border-border px-3 py-2.5',
    separator: '-mx-1 my-1 h-px bg-border',
    subTrigger: 'flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
    subContent: 'z-50 min-w-40 overflow-hidden rounded-xl border border-border bg-background p-1 text-foreground shadow-lg outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    subTriggerIcon: 'ml-auto',
  },
  variants: {
    danger: {
      true: { item: 'text-danger data-[highlighted]:bg-danger-muted data-[highlighted]:text-danger-muted-foreground' },
    },
  },
})

export type DropdownMenuSlots = keyof ReturnType<typeof dropdownMenuTheme>
