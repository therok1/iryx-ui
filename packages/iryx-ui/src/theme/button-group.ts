import { tv } from 'tailwind-variants'

export const buttonGroupTheme = tv({
  base: 'isolate inline-flex [&>*]:relative [&>*:focus-visible]:z-10 [&>*:hover]:z-10',
  variants: {
    orientation: {
      horizontal: '[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
      vertical: 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
    },
    block: {
      true: 'flex w-full [&>*]:flex-1',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type ButtonGroupVariants = Parameters<typeof buttonGroupTheme>[0]
