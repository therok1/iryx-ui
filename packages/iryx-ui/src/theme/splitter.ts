import { tv } from 'tailwind-variants'

export const splitterTheme = tv({
  slots: {
    root: 'flex size-full',
    panel: 'overflow-hidden',
    handle: 'group relative flex shrink-0 items-center justify-center outline-none',
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
