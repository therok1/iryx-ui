import { tv } from 'tailwind-variants'

export const descriptionListTheme = tv({
  slots: {
    root: 'text-sm',
    item: '',
    term: 'font-medium text-muted-foreground',
    description: 'text-foreground',
  },
  variants: {
    orientation: {
      vertical: {
        root: 'flex flex-col',
        item: 'flex flex-col gap-1',
      },
      horizontal: {
        root: 'grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-6',
        item: 'col-span-full grid grid-cols-subgrid items-baseline',
      },
    },
    divided: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    { orientation: 'vertical', divided: false, class: { root: 'gap-4' } },
    { orientation: 'horizontal', divided: false, class: { root: 'gap-y-4' } },
    {
      divided: true,
      class: { item: 'border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0' },
    },
  ],
  defaultVariants: {
    orientation: 'vertical',
    divided: false,
  },
})

export type DescriptionListSlots = keyof ReturnType<typeof descriptionListTheme>
