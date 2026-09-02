import { tv } from 'tailwind-variants'

export const radioGroupTheme = tv({
  slots: {
    root: '',
    wrapper: 'flex items-start gap-2.5',
    item: 'cursor-pointer transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
    mark: 'grid aspect-square shrink-0 place-items-center rounded-full border border-border bg-background transition-[border-color,box-shadow]',
    indicator: 'flex size-full items-center justify-center after:block after:rounded-full after:bg-primary',
    icon: 'text-muted-foreground transition-colors',
    content: 'grid gap-1',
    label: 'text-sm leading-5 text-foreground select-none',
    description: 'text-sm leading-snug text-muted-foreground',
  },
  variants: {
    variant: {
      radio: {
        item: 'aspect-square shrink-0 rounded-full border border-border bg-background data-[state=checked]:border-primary',
      },
      card: {
        item: 'flex w-full items-start gap-3 rounded-lg border border-border bg-background text-left hover:bg-accent/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
        mark: 'mt-0.5',
      },
      tile: {
        item: 'flex w-full flex-col items-center gap-2 rounded-lg border border-border bg-background text-center hover:bg-accent/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:[&_[data-slot=icon]]:text-primary',
        content: 'justify-items-center gap-0.5',
        label: 'font-medium',
      },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
    },
    orientation: {
      vertical: { root: 'grid gap-2' },
      horizontal: { root: 'flex flex-wrap items-start gap-x-6 gap-y-2' },
    },
    invalid: {
      true: {},
    },
  },
  compoundVariants: [
    { variant: 'radio', size: 'sm', class: { item: 'mt-0.5 size-3.5', indicator: 'after:size-1.5' } },
    { variant: 'radio', size: 'md', class: { item: 'mt-0.5 size-4', indicator: 'after:size-2' } },
    { variant: 'radio', size: 'lg', class: { item: 'size-5', indicator: 'after:size-2.5' } },
    { variant: 'radio', invalid: true, class: { item: 'border-red-500 focus-visible:ring-red-500/40' } },

    { variant: 'card', size: 'sm', class: { item: 'p-3', mark: 'size-3.5', indicator: 'after:size-1.5' } },
    { variant: 'card', size: 'md', class: { item: 'p-4', mark: 'size-4', indicator: 'after:size-2' } },
    { variant: 'card', size: 'lg', class: { item: 'p-5', mark: 'size-5', indicator: 'after:size-2.5' } },
    { variant: 'card', class: { mark: 'group-data-[state=checked]/item:border-primary' } },
    { variant: 'card', invalid: true, class: { item: 'border-red-500 focus-visible:ring-red-500/40' } },

    { variant: 'tile', size: 'sm', class: { item: 'p-3', icon: 'size-5' } },
    { variant: 'tile', size: 'md', class: { item: 'p-4', icon: 'size-6' } },
    { variant: 'tile', size: 'lg', class: { item: 'p-5', icon: 'size-7' } },
    { variant: 'tile', invalid: true, class: { item: 'border-red-500 focus-visible:ring-red-500/40' } },

    { variant: 'tile', orientation: 'horizontal', class: { root: 'grid auto-cols-fr grid-flow-col items-stretch gap-2' } },
  ],
  defaultVariants: {
    variant: 'radio',
    size: 'md',
    orientation: 'vertical',
  },
})

export type RadioGroupSlots = keyof ReturnType<typeof radioGroupTheme>
