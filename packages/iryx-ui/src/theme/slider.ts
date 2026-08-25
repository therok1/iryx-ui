import { tv } from 'tailwind-variants'

export const sliderTheme = tv({
  slots: {
    root: 'flex flex-col gap-2',
    header: 'flex text-sm',
    label: 'font-medium text-foreground select-none',
    value: 'text-muted-foreground tabular-nums',
    slider: 'relative flex touch-none items-center select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-44 data-[orientation=vertical]:flex-col',
    track: 'relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full',
    range: 'absolute rounded-full bg-linear-to-b from-primary-from to-primary-to data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
    thumb: 'block shrink-0 rounded-full border-2 border-primary bg-background shadow-sm transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[disabled]:cursor-not-allowed',
    scale: 'flex justify-between text-xs text-muted-foreground tabular-nums',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'w-full',
        header: 'items-baseline justify-between gap-2',
      },
      vertical: {
        root: 'inline-flex w-auto items-center',
        header: 'flex-col items-center gap-0.5',
      },
    },
    size: {
      sm: {
        track: 'data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1',
        thumb: 'size-3.5',
      },
      md: {
        track: 'data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5',
        thumb: 'size-4',
      },
      lg: {
        track: 'data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2',
        thumb: 'size-5',
      },
    },
    disabled: {
      false: { thumb: 'cursor-grab active:cursor-grabbing' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
    disabled: false,
  },
})

export type SliderSlots = keyof ReturnType<typeof sliderTheme>
