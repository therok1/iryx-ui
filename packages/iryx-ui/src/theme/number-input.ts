import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const numberInputTheme = tv({
  slots: {
    root: 'relative inline-flex w-full items-stretch',
    input: `flex w-full text-right tabular-nums ${fieldBase}`,
    stepper: 'absolute inset-y-px end-px flex flex-col justify-center overflow-hidden rounded-e-full border-s border-border',
    // Pill end curves into the stepper; pad arrows off the curve.
    step: 'flex flex-1 items-center justify-center ps-1 pe-2 text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3',
  },
  variants: {
    size: {
      sm: { input: 'h-8 px-2.5 text-sm', stepper: 'w-7' },
      md: { input: 'h-9 px-3 text-sm', stepper: 'w-8' },
      lg: { input: 'h-10 px-4 text-base', stepper: 'w-9' },
    },
    invalid: {
      true: { input: 'border-red-500 focus-visible:ring-red-500/40' },
    },
    withStepper: {
      true: {},
    },
  },
  compoundVariants: [
    { withStepper: true, size: 'sm', class: { input: 'pe-9' } },
    { withStepper: true, size: 'md', class: { input: 'pe-10' } },
    { withStepper: true, size: 'lg', class: { input: 'pe-11' } },
  ],
  defaultVariants: {
    size: 'md',
  },
})

export type NumberInputSlots = keyof ReturnType<typeof numberInputTheme>
