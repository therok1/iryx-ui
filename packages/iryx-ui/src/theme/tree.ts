import { tv } from 'tailwind-variants'

export const treeTheme = tv({
  slots: {
    root: 'flex w-full list-none flex-col gap-0.5 outline-none select-none',
    item: 'flex cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-2 text-sm text-foreground outline-none hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-primary/50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[selected]:bg-accent data-[selected]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
    expander: 'shrink-0 text-muted-foreground transition-transform duration-200 data-[expanded]:rotate-90',
    spacer: 'shrink-0',
    icon: 'shrink-0 text-muted-foreground',
    label: 'truncate',
    count: 'ml-auto shrink-0 pr-1 pl-2 text-xs text-muted-foreground tabular-nums',
  },
  variants: {
    size: {
      sm: { item: 'py-1 text-xs', expander: 'size-3.5', spacer: 'size-3.5' },
      md: { item: 'py-1.5 text-sm', expander: 'size-4', spacer: 'size-4' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TreeSlots = keyof ReturnType<typeof treeTheme>
