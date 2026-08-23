import { tv } from 'tailwind-variants'

/*
 * The bar itself is quiet — a menubar is chrome, not a control panel, and a
 * heavy container competes with the document under it. The triggers only take
 * a surface once they are hovered or their menu is open.
 *
 * Panels reuse `dropdownMenuTheme().content`, so a menubar menu and a dropdown
 * are the same object; only the way they are opened differs.
 */
export const menubarTheme = tv({
  slots: {
    root: 'flex items-center gap-0.5 rounded-xl border border-border bg-background p-1',
    trigger: 'flex cursor-default items-center rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
  },
  variants: {
    bare: {
      true: { root: 'rounded-none border-0 bg-transparent p-0' },
    },
  },
})

export type MenubarSlots = keyof ReturnType<typeof menubarTheme>
