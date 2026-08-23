import { tv } from 'tailwind-variants'

/*
 * The bar is quiet chrome, like the menubar: a heavy container competes with
 * the content it acts on. Buttons inside reuse `buttonTheme` rather than
 * inventing a parallel look, so a toolbar button and an `IButton` are the
 * same object.
 */
export const toolbarTheme = tv({
  slots: {
    root: 'flex items-center gap-1 rounded-xl border border-border bg-background p-1',
    separator: 'shrink-0 bg-border',
  },
  variants: {
    orientation: {
      horizontal: { separator: 'mx-1 h-5 w-px' },
      vertical: { root: 'flex-col items-stretch', separator: 'my-1 h-px w-full' },
    },
    bare: {
      true: { root: 'rounded-none border-0 bg-transparent p-0' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type ToolbarSlots = keyof ReturnType<typeof toolbarTheme>
