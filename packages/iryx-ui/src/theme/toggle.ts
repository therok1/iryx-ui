import { tv } from 'tailwind-variants'

export const toggleTheme = tv({
  base: 'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-input font-medium whitespace-nowrap text-foreground transition-[color,background-color,border-color,box-shadow,opacity] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0',
  variants: {
    size: {
      xs: 'h-7 gap-1.5 px-2 text-xs has-[[data-icon=inline-end]]:pr-1.5 has-[[data-icon=inline-start]]:pl-1.5 [&_svg]:size-3.5',
      sm: 'h-8 px-3 text-sm has-[[data-icon=inline-end]]:pr-2 has-[[data-icon=inline-start]]:pl-2 [&_svg]:size-4',
      md: 'h-9 px-4 text-sm has-[[data-icon=inline-end]]:pr-3 has-[[data-icon=inline-start]]:pl-3 [&_svg]:size-4',
      lg: 'h-10 px-5 text-base has-[[data-icon=inline-end]]:pr-4 has-[[data-icon=inline-start]]:pl-4 [&_svg]:size-5',
      xl: 'h-12 px-6 text-base has-[[data-icon=inline-end]]:pr-5 has-[[data-icon=inline-start]]:pl-5 [&_svg]:size-5',
    },
    square: { true: '', false: '' },
    block: { true: 'w-full' },
  },
  compoundVariants: [
    { square: true, size: 'xs', class: 'w-7 px-0 has-[[data-icon]]:px-0' },
    { square: true, size: 'sm', class: 'w-8 px-0 has-[[data-icon]]:px-0' },
    { square: true, size: 'md', class: 'w-9 px-0 has-[[data-icon]]:px-0' },
    { square: true, size: 'lg', class: 'w-10 px-0 has-[[data-icon]]:px-0' },
    { square: true, size: 'xl', class: 'w-12 px-0 has-[[data-icon]]:px-0' },
  ],
  defaultVariants: {
    size: 'md',
    square: false,
  },
})

export type ToggleVariants = Parameters<typeof toggleTheme>[0]

export const toggleGroupTheme = tv({
  slots: {
    root: 'isolate inline-flex items-center',
    item: '',
  },
  variants: {
    variant: {
      joined: {
        item: 'relative hover:z-10 focus-visible:z-10',
      },
      plain: { root: 'gap-1' },
    },
    orientation: {
      horizontal: {},
      vertical: { root: 'flex-col items-stretch' },
    },
    block: {
      true: { root: 'flex w-full', item: 'flex-1' },
    },
  },
  compoundVariants: [
    {
      variant: 'joined',
      orientation: 'horizontal',
      class: { item: '[&:not(:first-child)]:-ml-px [&:not(:first-child)]:rounded-l-none [&:not(:last-child)]:rounded-r-none' },
    },
    {
      variant: 'joined',
      orientation: 'vertical',
      class: { item: '[&:not(:first-child)]:-mt-px [&:not(:first-child)]:rounded-t-none [&:not(:last-child)]:rounded-b-none' },
    },
  ],
  defaultVariants: {
    variant: 'joined',
    orientation: 'horizontal',
  },
})

export type ToggleGroupSlots = keyof ReturnType<typeof toggleGroupTheme>

export type ToggleGroupVariant = 'joined' | 'plain'
