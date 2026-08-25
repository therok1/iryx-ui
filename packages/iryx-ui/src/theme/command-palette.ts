import { tv } from 'tailwind-variants'

export const commandPaletteTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    content: 'fixed top-[12vh] left-1/2 z-50 flex max-h-[min(70vh,32rem)] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-lg outline-none data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in',
    list: 'flex min-h-0 flex-1 flex-col',
    header: 'flex items-center gap-3 border-b border-border px-4',
    icon: 'shrink-0 text-muted-foreground [&_svg]:size-4',
    input: 'h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground',
    viewport: 'max-h-80 min-h-0 flex-1 overflow-y-auto overscroll-contain p-2',
    group: 'flex flex-col',
    groupLabel: 'px-2 py-1.5 font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase',
    item: 'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:line-through data-[disabled]:decoration-border data-[disabled]:opacity-60 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
    itemIcon: 'shrink-0 text-muted-foreground [&_svg]:size-4',
    itemLabel: 'min-w-0 flex-1 truncate',
    shortcut: 'pointer-events-none ms-auto flex shrink-0 gap-1',
    key: 'rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground',
    empty: 'px-2 py-8 text-center text-sm text-muted-foreground',
    footer: 'flex items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted-foreground',
  },
})

export type CommandPaletteSlots = keyof ReturnType<typeof commandPaletteTheme>
