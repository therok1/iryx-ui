import { tv } from 'tailwind-variants'

export const formFieldTheme = tv({
  slots: {
    root: 'space-y-1.5',
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
