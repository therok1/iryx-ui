import { tv } from 'tailwind-variants'

export const checkboxTheme = tv({
  slots: {
    wrapper: 'flex items-start gap-2.5',
    root: 'peer cursor-pointer transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
    mark: 'flex shrink-0 items-center justify-center rounded border border-border bg-background text-primary-foreground transition-[color,background-color,border-color] group-data-[state=checked]/item:border-primary group-data-[state=checked]/item:bg-primary group-data-[state=indeterminate]/item:border-primary group-data-[state=indeterminate]/item:bg-primary',
    indicator: 'flex items-center justify-center text-current',
    icon: 'text-muted-foreground transition-colors',
    content: 'grid gap-1',
    label: 'text-sm leading-5 font-medium text-foreground select-none',
    description: 'text-sm leading-snug text-muted-foreground',
  },
  variants: {
    variant: {
      checkbox: {
        root: 'flex shrink-0 items-center justify-center rounded border border-border bg-background text-primary-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
      },
      card: {
        root: 'flex w-full items-start gap-3 rounded-lg border border-border bg-background text-left hover:bg-accent/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=indeterminate]:border-primary',
      },
      tile: {
        root: 'flex w-full flex-col items-center gap-2 rounded-lg border border-border bg-background text-center hover:bg-accent/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:[&_[data-slot=icon]]:text-primary',
        content: 'justify-items-center gap-0.5',
      },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
    },
    withText: {
      true: {},
    },
    invalid: {
      true: {},
    },
  },
  compoundVariants: [
    { variant: 'checkbox', size: 'sm', class: { root: 'size-3.5', indicator: '[&_svg]:size-2.5' } },
    { variant: 'checkbox', size: 'md', class: { root: 'size-4', indicator: '[&_svg]:size-3' } },
    { variant: 'checkbox', size: 'lg', class: { root: 'size-5', indicator: '[&_svg]:size-3.5' } },
    { variant: 'checkbox', withText: true, class: { root: 'mt-0.5' } },
    { variant: 'checkbox', size: 'lg', withText: true, class: { root: 'mt-0' } },
    { variant: 'checkbox', invalid: true, class: { root: 'border-red-500 focus-visible:ring-red-500/40' } },

    { variant: 'card', size: 'sm', class: { root: 'p-3', mark: 'mt-0.5 size-3.5', indicator: '[&_svg]:size-2.5' } },
    { variant: 'card', size: 'md', class: { root: 'p-4', mark: 'mt-0.5 size-4', indicator: '[&_svg]:size-3' } },
    { variant: 'card', size: 'lg', class: { root: 'p-5', mark: 'size-5', indicator: '[&_svg]:size-3.5' } },
    { variant: 'card', invalid: true, class: { root: 'border-red-500 focus-visible:ring-red-500/40' } },

    { variant: 'tile', size: 'sm', class: { root: 'p-3', icon: 'size-5' } },
    { variant: 'tile', size: 'md', class: { root: 'p-4', icon: 'size-6' } },
    { variant: 'tile', size: 'lg', class: { root: 'p-5', icon: 'size-7' } },
    { variant: 'tile', invalid: true, class: { root: 'border-red-500 focus-visible:ring-red-500/40' } },
  ],
  defaultVariants: {
    variant: 'checkbox',
    size: 'md',
  },
})

export type CheckboxSlots = keyof ReturnType<typeof checkboxTheme>
