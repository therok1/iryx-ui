import { tv } from 'tailwind-variants'

export const switchTheme = tv({
  slots: {
    wrapper: 'flex items-start gap-2.5',
    root: 'inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted',
    thumb: 'pointer-events-none block rounded-full bg-background shadow-sm transition-transform data-[state=unchecked]:translate-x-0.5',
    content: 'grid gap-1',
    label: 'text-sm leading-5 font-medium text-foreground select-none',
    description: 'text-sm leading-snug text-muted-foreground',
  },
  variants: {
    size: {
      sm: {
        root: 'h-4 w-7',
        thumb: 'size-3 data-[state=checked]:translate-x-3.5',
      },
      md: {
        root: 'h-5 w-9',
        thumb: 'size-4 data-[state=checked]:translate-x-4.5',
      },
      lg: {
        root: 'h-6 w-11',
        thumb: 'size-5 data-[state=checked]:translate-x-5.5',
      },
    },
    withText: {
      true: {},
    },
    invalid: {
      true: { root: 'ring-2 ring-red-500/40' },
    },
  },
  compoundVariants: [
    { size: 'sm', withText: true, class: { root: 'mt-0.5' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type SwitchSlots = keyof ReturnType<typeof switchTheme>
