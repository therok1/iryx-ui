import { tv } from 'tailwind-variants'

export const passwordInputTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-2',
    input: '[&::-ms-clear]:hidden [&::-ms-reveal]:hidden',
    toggle: 'flex items-center rounded-md text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
    meter: 'flex items-center gap-2',
    track: 'flex h-1 flex-1 gap-1',
    segment: 'h-full flex-1 rounded-full bg-muted transition-colors',
    label: 'shrink-0 text-xs text-muted-foreground tabular-nums',
  },
  variants: {
    score: {
      0: {},
      1: { segment: 'data-[filled]:bg-danger' },
      2: { segment: 'data-[filled]:bg-warning' },
      3: { segment: 'data-[filled]:bg-info' },
      4: { segment: 'data-[filled]:bg-success' },
    },
  },
  defaultVariants: {
    score: 0,
  },
})

export type PasswordInputSlots = keyof ReturnType<typeof passwordInputTheme>
