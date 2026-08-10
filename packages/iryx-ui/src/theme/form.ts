import { tv } from 'tailwind-variants'

export const formFieldTheme = tv({
  slots: {
    // Slightly airier than the text below the control: the indent already
    // links the label to the field, so a tight gap reads cramped.
    root: 'space-y-2',
    header: 'flex items-center justify-between gap-2',
    label: '',
    hint: 'text-sm leading-none text-muted-foreground',
    description: 'text-sm leading-snug text-muted-foreground',
    control: '',
    error: 'text-sm leading-snug text-red-500',
    help: 'text-sm leading-snug text-muted-foreground',
  },
  variants: {
    /*
     * Indents the text around the control to line up with the control's own
     * text, so the label sits directly above the placeholder. The values match
     * the input's horizontal padding per size — not the border radius, which
     * is a corner curve and does not scale with the control.
     */
    indent: {
      none: {},
      sm: { header: 'px-2.5', description: 'px-2.5', error: 'px-2.5', help: 'px-2.5' },
      md: { header: 'px-3', description: 'px-3', error: 'px-3', help: 'px-3' },
      lg: { header: 'px-4', description: 'px-4', error: 'px-4', help: 'px-4' },
    },
  },
  defaultVariants: {
    indent: 'md',
  },
})

export type FormFieldSlots = keyof ReturnType<typeof formFieldTheme>
