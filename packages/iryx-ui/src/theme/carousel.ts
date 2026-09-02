import { tv } from 'tailwind-variants'

export const carouselTheme = tv({
  slots: {
    root: 'relative',
    track: 'flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-primary/50 motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden',
    item: 'shrink-0 snap-start px-px',
    viewport: 'relative',
    control: 'absolute inset-y-0 z-10 flex items-center',
    dots: 'mt-4 flex items-center justify-center gap-2',
    dot: 'h-2 w-2 rounded-full bg-border transition-none outline-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[state=active]:w-6 data-[state=active]:bg-primary',
  },
  variants: {
    gap: {
      none: {},
      sm: { track: 'gap-2' },
      md: { track: 'gap-4' },
      lg: { track: 'gap-6' },
    },
  },
  defaultVariants: {
    gap: 'md',
  },
})

export type CarouselSlots = keyof ReturnType<typeof carouselTheme>
