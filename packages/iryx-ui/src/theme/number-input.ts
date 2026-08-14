import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const numberInputTheme = tv({
  slots: {
    root: 'relative inline-flex w-full items-stretch',
    input: `flex w-full text-right tabular-nums ${fieldBase}`,
    /** Stacked +/- controls pinned inside the trailing edge of the field. */
    stepper: 'absolute inset-y-px end-px flex flex-col justify-center overflow-hidden rounded-e-xl border-s border-border',
    step: 'flex flex-1 items-center justify-center px-1.5 text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3',
  },
  variants: {
    size: {
      sm: { input: 'h-8 px-2.5 text-sm', stepper: 'w-5' },
      md: { input: 'h-9 px-3 text-sm', stepper: 'w-6' },
      lg: { input: 'h-10 px-4 text-base', stepper: 'w-7' },
    },
    invalid: {
      true: { input: 'border-red-500 focus-visible:ring-red-500/40' },
    },
    /** Leaves room for the stepper so long values can't slide under it. */
    withStepper: {
      true: {},
    },
  },
  compoundVariants: [
    { withStepper: true, size: 'sm', class: { input: 'pe-7' } },
    { withStepper: true, size: 'md', class: { input: 'pe-8' } },
    { withStepper: true, size: 'lg', class: { input: 'pe-10' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type NumberInputSlots = keyof ReturnType<typeof numberInputTheme>
