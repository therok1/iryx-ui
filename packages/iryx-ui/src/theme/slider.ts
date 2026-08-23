import { tv } from 'tailwind-variants'

export const sliderTheme = tv({
  slots: {
    root: 'flex flex-col gap-2',
    /** Only rendered when a label or value text is shown. */
    header: 'flex text-sm',
    label: 'font-medium text-foreground select-none',
    value: 'text-muted-foreground tabular-nums',
    /*
     * Orientation is a data attribute rather than a variant: Reka sets
     * `data-orientation` on all four parts itself, so one class set covers
     * both axes and cannot drift out of sync with the prop.
     */
    slider: 'relative flex touch-none items-center select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-44 data-[orientation=vertical]:flex-col',
    track: 'relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full',
    range: 'absolute rounded-full bg-linear-to-b from-primary-from to-primary-to data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
    /*
     * `cursor-grab` only while the slider is live — on a disabled root the
     * grab hand would promise a drag that never happens, so the root's
     * `not-allowed` has to win.
     */
    thumb: 'block shrink-0 rounded-full border-2 border-primary bg-background shadow-sm transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[disabled]:cursor-not-allowed',
    scale: 'flex justify-between text-xs text-muted-foreground tabular-nums',
  },
  variants: {
    /*
     * The track itself reads its orientation off `data-orientation`, but the
     * wrapper and header cannot: they sit outside Reka's markup. A horizontal
     * slider fills its container and pushes the label and value to opposite
     * ends; a vertical one is only as wide as its track, so the same header
     * would fling that text to the far edges of whatever contains it. Stacked
     * and centred is the only layout that stays attached to the track.
     */
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
    /*
     * Track and thumb move together. The thumb is deliberately larger than
     * the track at every size — it is the thing you aim at, and matching the
     * track would leave nothing to grab.
     */
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
    /** Without a grab hand the track reads as a progress bar, not a control. */
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
