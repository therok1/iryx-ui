import { tv } from 'tailwind-variants'

/*
 * The group styles its children rather than requiring a specific component, so
 * any element can sit in it — a Button, a menu trigger, an input.
 *
 * Children are squared off where they meet and pulled together by a pixel so
 * adjacent borders collapse into one. `relative` plus a raised z-index on
 * hover/focus keeps a focus ring from being overlapped by the next child.
 */
export const buttonGroupTheme = tv({
  base: 'isolate inline-flex [&>*]:relative [&>*:focus-visible]:z-10 [&>*:hover]:z-10',
  variants: {
    orientation: {
      horizontal: '[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
      vertical: 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
    },
    /** Stretch to fill the container, splitting the width between children. */
    block: {
      true: 'flex w-full [&>*]:flex-1',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type ButtonGroupVariants = Parameters<typeof buttonGroupTheme>[0]
