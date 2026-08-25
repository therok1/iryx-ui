import { tv } from 'tailwind-variants'

export const separatorTheme = tv({
  slots: {
    root: 'flex shrink-0 items-center',
    line: 'bg-border',
    label: 'shrink-0 text-xs text-muted-foreground',
  },
  variants: {
    orientation: {
      horizontal: { root: 'w-full gap-3', line: 'h-px w-full' },
      vertical: { root: 'h-full flex-col gap-3', line: 'h-full w-px' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type SeparatorSlots = keyof ReturnType<typeof separatorTheme>
