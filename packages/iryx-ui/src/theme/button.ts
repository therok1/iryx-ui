import { tv } from 'tailwind-variants'

export const buttonTheme = tv({
  base: 'inline-flex shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-transparent font-medium no-underline transition-[color,background-color,border-color,box-shadow,opacity,filter,translate] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  variants: {
    variant: {
      solid: 'bg-linear-to-b from-primary-from to-primary-to text-primary-foreground hover:brightness-110 active:brightness-95',
      outline: 'border-border bg-input text-foreground hover:bg-accent hover:text-accent-foreground',
      ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline active:translate-y-0',
    },
    size: {
      xs: 'h-7 gap-1.5 px-2 text-xs has-[[data-icon=inline-end]]:pr-1.5 has-[[data-icon=inline-start]]:pl-1.5 [&_svg]:size-3.5',
      sm: 'h-8 px-3 text-sm has-[[data-icon=inline-end]]:pr-2 has-[[data-icon=inline-start]]:pl-2 [&_svg]:size-4',
      md: 'h-9 px-4 text-sm has-[[data-icon=inline-end]]:pr-3 has-[[data-icon=inline-start]]:pl-3 [&_svg]:size-4',
      lg: 'h-10 px-5 text-base has-[[data-icon=inline-end]]:pr-4 has-[[data-icon=inline-start]]:pl-4 [&_svg]:size-5',
      xl: 'h-12 px-6 text-base has-[[data-icon=inline-end]]:pr-5 has-[[data-icon=inline-start]]:pl-5 [&_svg]:size-5',
    },
    square: { true: '', false: '' },
    block: {
      true: 'w-full',
    },
  },
  compoundVariants: [
    { square: true, size: 'xs', class: 'w-7 px-0 has-[[data-icon]]:px-0' },
    { square: true, size: 'sm', class: 'w-8 px-0 has-[[data-icon]]:px-0' },
    { square: true, size: 'md', class: 'w-9 px-0 has-[[data-icon]]:px-0' },
    { square: true, size: 'lg', class: 'w-10 px-0 has-[[data-icon]]:px-0' },
    { square: true, size: 'xl', class: 'w-12 px-0 has-[[data-icon]]:px-0' },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'md',
    square: false,
  },
})

export type ButtonVariants = Parameters<typeof buttonTheme>[0]
