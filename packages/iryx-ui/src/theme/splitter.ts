import { tv } from 'tailwind-variants'

/*
 * The handle is a thin rule that thickens into a colour on hover, focus and
 * while dragging. It keeps a larger invisible hit area than its visible line:
 * a 1px target is unusable with a mouse and impossible on a trackpad, so the
 * padding does the catching and the rule does the showing.
 */
export const splitterTheme = tv({
  slots: {
    root: 'flex size-full',
    panel: 'overflow-hidden',
    handle: 'group relative flex shrink-0 items-center justify-center outline-none',
    /** The visible rule inside the handle's hit area. */
    rule: 'bg-border transition-colors group-hover:bg-primary group-focus-visible:bg-primary group-data-[state=drag]:bg-primary',
  },
  variants: {
    direction: {
      horizontal: {
        root: 'flex-row',
        handle: 'cursor-col-resize px-1',
        rule: 'h-full w-px',
      },
      vertical: {
        root: 'flex-col',
        handle: 'cursor-row-resize py-1',
        rule: 'h-px w-full',
      },
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
})

export type SplitterSlots = keyof ReturnType<typeof splitterTheme>
