import { tv } from 'tailwind-variants'

/*
 * Status colours use Tailwind's built-in palettes rather than theme tokens:
 * there are no --iryx-success/warning/danger tokens, and adding them would mean
 * touching every preset. Each variant therefore carries explicit dark: classes.
 */
export const badgeTheme = tv({
  slots: {
    root: 'inline-flex shrink-0 items-center rounded-full font-medium whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0',
    dot: 'rounded-full bg-current',
  },
  variants: {
    variant: {
      neutral: {},
      success: {},
      warning: {},
      danger: {},
      info: {},
    },
    /** `soft` is a tinted background; `solid` is a filled block of colour. */
    tone: {
      soft: {},
      solid: {},
    },
    size: {
      sm: { root: 'h-5 gap-1 px-2 text-xs [&_svg]:size-3', dot: 'size-1.5' },
      md: { root: 'h-6 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5', dot: 'size-2' },
      lg: { root: 'h-7 gap-1.5 px-3 text-sm [&_svg]:size-4', dot: 'size-2' },
    },
  },
  compoundVariants: [
    {
      variant: 'neutral',
      tone: 'soft',
      class: { root: 'bg-muted text-muted-foreground' },
    },
    {
      variant: 'neutral',
      tone: 'solid',
      class: { root: 'bg-foreground text-background' },
    },
    {
      variant: 'success',
      tone: 'soft',
      class: { root: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    },
    {
      variant: 'success',
      tone: 'solid',
      class: { root: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950' },
    },
    {
      variant: 'warning',
      tone: 'soft',
      class: { root: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    },
    {
      variant: 'warning',
      tone: 'solid',
      class: { root: 'bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950' },
    },
    {
      variant: 'danger',
      tone: 'soft',
      class: { root: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' },
    },
    {
      variant: 'danger',
      tone: 'solid',
      class: { root: 'bg-red-600 text-white dark:bg-red-500 dark:text-red-950' },
    },
    {
      variant: 'info',
      tone: 'soft',
      class: { root: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    },
    {
      variant: 'info',
      tone: 'solid',
      class: { root: 'bg-blue-600 text-white dark:bg-blue-500 dark:text-blue-950' },
    },
  ],
  defaultVariants: {
    variant: 'neutral',
    tone: 'soft',
    size: 'md',
  },
})

export type BadgeSlots = keyof ReturnType<typeof badgeTheme>
