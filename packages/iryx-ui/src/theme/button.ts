import { tv } from 'tailwind-variants'

export const buttonTheme = tv({
  // `active:translate-y-px` gives the press a physical nudge. Tailwind v4 maps
  // it to the standalone `translate` property, so it composes with any
  // `transform` rather than overwriting it.
  /*
   * Every variant carries a border of the same width — transparent unless the
   * variant colours it. Without it, swapping variants at runtime animates
   * border-color up from `currentColor` (a white flash on solid buttons) and
   * shifts the layout by a pixel as the border appears.
   *
   * The transition lists properties explicitly rather than using
   * `transition-all`: geometry must not ease. A spinner appearing changes the
   * padding and width, and animating those makes the button visibly stretch.
   * `filter` is included for the solid variant's hover brightness, `translate`
   * for the press nudge.
   */
  base: 'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent font-medium transition-[color,background-color,border-color,box-shadow,opacity,filter,translate] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  variants: {
    variant: {
      solid: 'bg-linear-to-b from-primary-from to-primary-to text-primary-foreground hover:brightness-110 active:brightness-95',
      outline: 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
      ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
      // A text link has no surface to press, so it stays put.
      link: 'text-primary underline-offset-4 hover:underline active:translate-y-0',
    },
    /*
     * Padding tightens on the side an icon sits on. The icon marks its own
     * position with `data-icon="inline-start"` / `"inline-end"`, which is what
     * makes this possible in pure CSS — a label is a bare text node, so
     * `:first-child` / `:last-child` would see the icon as both.
     */
    size: {
      xs: 'h-7 gap-1.5 px-2 text-xs has-[[data-icon=inline-end]]:pr-1.5 has-[[data-icon=inline-start]]:pl-1.5 [&_svg]:size-3.5',
      sm: 'h-8 px-3 text-sm has-[[data-icon=inline-end]]:pr-2 has-[[data-icon=inline-start]]:pl-2 [&_svg]:size-4',
      md: 'h-9 px-4 text-sm has-[[data-icon=inline-end]]:pr-3 has-[[data-icon=inline-start]]:pl-3 [&_svg]:size-4',
      lg: 'h-10 px-5 text-base has-[[data-icon=inline-end]]:pr-4 has-[[data-icon=inline-start]]:pl-4 [&_svg]:size-5',
      xl: 'h-12 px-6 text-base has-[[data-icon=inline-end]]:pr-5 has-[[data-icon=inline-start]]:pl-5 [&_svg]:size-5',
    },
    /** Icon-only: square, no horizontal padding. */
    square: { true: '', false: '' },
    block: {
      true: 'w-full',
    },
  },
  /*
   * Square sizes mirror each height, so the button ends up a perfect square.
   * The inline-start/end rules are zeroed too, in case a marked icon is used
   * on its own.
   */
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
