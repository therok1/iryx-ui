import { tv } from 'tailwind-variants'

/*
 * A toggle is a button that stays pressed, so it borrows the button's
 * geometry — same heights, same radius, same focus ring — and adds a
 * `data-[state=on]` treatment on top. Reka sets that attribute; nothing here
 * tracks the pressed state itself.
 *
 * There is deliberately one look. A toggle has to read as a button whether or
 * not it is pressed, and the lighter treatments could not manage that: unpressed
 * they were indistinguishable from plain text.
 *
 * The transition lists properties explicitly for the same reason the button
 * does: geometry must not ease, or an icon swapping in makes the control
 * visibly stretch.
 */
export const toggleTheme = tv({
  base: 'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-input font-medium whitespace-nowrap text-foreground transition-[color,background-color,border-color,box-shadow,opacity] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0',
  variants: {
    /*
     * Heights match `IButton` exactly, so the two line up side by side, and
     * so does the icon handling: padding tightens on the side an icon sits
     * on, marked by `data-icon="inline-start"` / `"inline-end"`. That marker
     * is what makes it possible in pure CSS — a label is a bare text node, so
     * `:first-child` / `:last-child` would see the icon as both.
     */
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
  /*
   * Square sizes mirror each height, so the toggle ends up a perfect square.
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
    size: 'md',
    square: false,
  },
})

export type ToggleVariants = Parameters<typeof toggleTheme>[0]

/**
 * The group is the container; each item is a {@link toggleTheme} button. With
 * a single toggle look, the group's variant only decides how the items are
 * spaced — whether they touch or stand apart.
 */
export const toggleGroupTheme = tv({
  slots: {
    root: 'isolate inline-flex items-center',
    item: '',
  },
  variants: {
    variant: {
      /**
       * Squared off where they meet and pulled together by a pixel, so
       * adjacent borders collapse into one — the same trick `IButtonGroup`
       * uses. The raised z-index keeps a focus ring from being clipped by
       * the neighbour that overlaps it.
       */
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
