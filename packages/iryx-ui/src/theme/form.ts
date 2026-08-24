import { tv } from 'tailwind-variants'

export const formFieldTheme = tv({
  slots: {
    /*
     * A flex gap, not `space-y`. Spacing by margin puts it on the control
     * element itself, and `ICombobox` renders its root as `display: contents`
     * — a box margins do not apply to — so that one field sat tight against
     * its label while every other control cleared it.
     */
    root: 'flex flex-col gap-2',
    header: 'flex items-center justify-between gap-2',
    label: '',
    hint: 'text-sm leading-none text-muted-foreground',
    description: 'text-sm leading-snug text-muted-foreground',
    control: '',
    error: 'text-sm leading-snug text-red-500',
    help: 'text-sm leading-snug text-muted-foreground',
  },
})

export type FormFieldSlots = keyof ReturnType<typeof formFieldTheme>
