import { tv } from 'tailwind-variants'

export const buttonTheme = tv({
  // `active:translate-y-px` gives the press a physical nudge. Tailwind v4 maps
  // it to the standalone `translate` property, so it composes with any
  // `transform` rather than overwriting it.
  base: 'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  variants: {
    variant: {
      solid: 'bg-linear-to-b from-primary-from to-primary-to text-primary-foreground hover:brightness-110 active:brightness-95',
      outline: 'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
      ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
      // A text link has no surface to press, so it stays put.
      link: 'text-primary underline-offset-4 hover:underline active:translate-y-0',
    },
    size: {
      xs: 'h-7 gap-1.5 px-2 text-xs [&_svg]:size-3.5',
      sm: 'h-8 px-3 text-sm [&_svg]:size-4',
      md: 'h-9 px-4 text-sm [&_svg]:size-4',
      lg: 'h-10 px-5 text-base [&_svg]:size-5',
      xl: 'h-12 px-6 text-base [&_svg]:size-5',
    },
    block: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})

export type ButtonVariants = Parameters<typeof buttonTheme>[0]
