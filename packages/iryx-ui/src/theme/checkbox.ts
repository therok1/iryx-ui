import { tv } from 'tailwind-variants'

export const checkboxTheme = tv({
  slots: {
    wrapper: 'flex items-start gap-2.5',
    root: 'peer flex shrink-0 cursor-pointer items-center justify-center rounded border border-border bg-background text-primary-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
    indicator: 'flex items-center justify-center text-current',
    content: 'grid gap-1',
    label: 'text-sm leading-5 font-medium text-foreground select-none',
    description: 'text-sm leading-snug text-muted-foreground',
  },
  variants: {
    size: {
      sm: { root: 'size-3.5', indicator: '[&_svg]:size-2.5' },
      md: { root: 'size-4', indicator: '[&_svg]:size-3' },
      lg: { root: 'size-5', indicator: '[&_svg]:size-3.5' },
    },
    withText: {
      true: { root: 'mt-0.5' },
    },
    invalid: {
      true: { root: 'border-red-500 focus-visible:ring-red-500/40' },
    },
  },
  compoundVariants: [
    { size: 'lg', withText: true, class: { root: 'mt-0' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type CheckboxSlots = keyof ReturnType<typeof checkboxTheme>
