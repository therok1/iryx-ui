import { tv } from 'tailwind-variants'

/*
 * Each cell is its own `<input>`, so the field chrome goes on the cell rather
 * than on a wrapper — there is no leading or trailing content to make room
 * for, and a border around the whole row would fight the per-cell focus ring.
 *
 * Cells are square and centred: a pin is read as a row of characters, not as
 * text in a field, and left-aligned digits in a wide box look like a mistake.
 */
export const pinInputTheme = tv({
  slots: {
    root: 'flex items-center',
    input: 'rounded-xl border border-border bg-input text-center font-medium text-foreground tabular-nums transition-colors outline-none focus-visible:z-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
    /** Sits between two groups of cells, e.g. 123–456. */
    separator: 'text-muted-foreground select-none',
  },
  variants: {
    size: {
      sm: { root: 'gap-1.5', input: 'size-8 text-sm', separator: 'px-0.5 text-sm' },
      md: { root: 'gap-2', input: 'size-10 text-base', separator: 'px-1 text-base' },
      lg: { root: 'gap-2.5', input: 'size-12 text-lg', separator: 'px-1 text-lg' },
    },
    /*
     * Matches the other fields: a red border plus a red ring, so the state
     * survives focus rather than being overwritten by it.
     */
    invalid: {
      true: { input: 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type PinInputSlots = keyof ReturnType<typeof pinInputTheme>
