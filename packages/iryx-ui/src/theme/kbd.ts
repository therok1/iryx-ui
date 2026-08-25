import { tv } from 'tailwind-variants'

export const kbdTheme = tv({
  slots: {
    root: 'inline-flex shrink-0 items-center',
    key: 'inline-flex items-center justify-center rounded border border-current/25 bg-current/10 text-center font-medium text-current/75',
    separator: 'text-current/60',
  },
  variants: {
    size: {
      xs: { root: 'gap-0.5', key: 'h-4 min-w-4 px-1 text-[0.625rem]', separator: 'px-0.5 text-[0.625rem]' },
      sm: { root: 'gap-0.5', key: 'h-5 min-w-5 px-1 text-xs', separator: 'px-0.5 text-xs' },
      md: { root: 'gap-1', key: 'h-6 min-w-6 px-1.5 text-sm', separator: 'px-0.5 text-sm' },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export type KbdSlots = keyof ReturnType<typeof kbdTheme>
