import { tv } from 'tailwind-variants'

export const switchTheme = tv({
  slots: {
    /** Only rendered when a `label` or `description` is provided. */
    wrapper: 'flex items-start gap-2.5',
    root: 'inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted',
    /*
     * The resting inset is 2px at every size, so `translate-x-0.5` is shared
     * and only the checked distance changes with the track.
     */
    thumb: 'pointer-events-none block rounded-full bg-background shadow-sm transition-transform data-[state=unchecked]:translate-x-0.5',
    content: 'grid gap-1',
    // leading-5 matches the 20px `md` control height, so the first line lines up.
    label: 'text-sm leading-5 font-medium text-foreground select-none',
    description: 'text-sm leading-snug text-muted-foreground',
  },
  variants: {
    /*
     * Track, thumb and travel move together: the checked offset is
     * `width − thumb − 2px`, so the thumb lands 2px inside the far edge exactly
     * as it starts 2px inside the near one. Change one number here and the
     * other two have to follow, or the thumb sits off-centre at rest.
     */
    size: {
      sm: {
        root: 'h-4 w-7',
        thumb: 'size-3 data-[state=checked]:translate-x-3.5',
      },
      md: {
        root: 'h-5 w-9',
        thumb: 'size-4 data-[state=checked]:translate-x-4.5',
      },
      lg: {
        root: 'h-6 w-11',
        thumb: 'size-5 data-[state=checked]:translate-x-5.5',
      },
    },
    /** Nudges the track down so it centres against the label's first line. */
    withText: {
      true: {},
    },
  },
  compoundVariants: [
    /*
     * Only `sm` needs the nudge: the label's line box is 20px, which the `md`
     * track already matches, and `lg` is taller than it so any offset would
     * push it below the text rather than centre it.
     */
    { size: 'sm', withText: true, class: { root: 'mt-0.5' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type SwitchSlots = keyof ReturnType<typeof switchTheme>
