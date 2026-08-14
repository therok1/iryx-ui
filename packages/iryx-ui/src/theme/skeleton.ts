import { tv } from 'tailwind-variants'

export const skeletonTheme = tv({
  base: 'animate-pulse bg-muted',
  variants: {
    /** `text` sizes itself to the current line height so it sits in copy. */
    variant: {
      text: 'h-[1em] w-full rounded',
      rect: 'rounded-xl',
      circle: 'aspect-square rounded-full',
    },
  },
  defaultVariants: {
    variant: 'rect',
  },
})

export type SkeletonVariants = Parameters<typeof skeletonTheme>[0]
