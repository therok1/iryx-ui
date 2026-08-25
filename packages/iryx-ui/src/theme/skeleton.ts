import { tv } from 'tailwind-variants'

export const skeletonTheme = tv({
  base: 'animate-pulse bg-muted',
  variants: {
    variant: {
      text: 'h-lh w-full rounded',
      rect: 'rounded-xl',
      circle: 'aspect-square rounded-full',
    },
  },
  defaultVariants: {
    variant: 'rect',
  },
})

export type SkeletonVariants = Parameters<typeof skeletonTheme>[0]
