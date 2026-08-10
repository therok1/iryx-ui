import { tv } from 'tailwind-variants'

export const labelTheme = tv({
  base: 'inline-flex items-center gap-1 text-sm leading-none font-medium text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  variants: {
    required: {
      true: 'after:text-red-500 after:content-[\'*\']',
    },
    /*
     * Indents the label so it lines up with the control's text rather than its
     * outer edge. The values match the input's horizontal padding per size —
     * not the border radius, which is a corner curve and doesn't scale.
     *
     * Use `none` when the label wraps its control, as with a checkbox.
     */
    indent: {
      none: '',
      sm: 'ps-2.5',
      md: 'ps-3',
      lg: 'ps-4',
    },
  },
  defaultVariants: {
    indent: 'md',
  },
})

export type LabelVariants = Parameters<typeof labelTheme>[0]
