import { tv } from 'tailwind-variants'

export const stepperTheme = tv({
  slots: {
    root: 'flex w-full',
    item: 'group relative flex flex-1 items-center gap-3',
    trigger: 'flex items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
    /*
     * The numbered circle, filled once the step is active or done.
     *
     * Both states use the same gradient, and only `color` and `border-color`
     * transition. Mixing a gradient (background-image) with a flat
     * background-color made the previous step flash as one vanished instantly
     * while the other eased up from transparent.
     */
    indicator: 'flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-linear-to-b text-sm font-medium transition-[color,border-color] group-data-[state=active]:border-primary group-data-[state=active]:from-primary-from group-data-[state=active]:to-primary-to group-data-[state=active]:text-primary-foreground group-data-[state=completed]:border-primary group-data-[state=completed]:from-primary-from group-data-[state=completed]:to-primary-to group-data-[state=completed]:text-primary-foreground [&_svg]:size-4',
    content: 'flex flex-col gap-0.5',
    title: 'text-sm font-medium text-foreground',
    description: 'text-xs text-muted-foreground',
    separator: 'h-px flex-1 bg-border group-data-[state=completed]:bg-primary',
  },
  variants: {
    orientation: {
      horizontal: {},
      vertical: {
        root: 'flex-col gap-2',
        item: 'flex-none items-start',
        separator: 'ml-4 h-6 w-px flex-none',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type StepperSlots = keyof ReturnType<typeof stepperTheme>
