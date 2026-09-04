import { tv } from 'tailwind-variants'

export const confirmPopoverTheme = tv({
  slots: {
    description: 'text-sm text-muted-foreground',
    actions: 'mt-3 flex justify-end gap-2',
  },
})

export type ConfirmPopoverSlots = keyof ReturnType<typeof confirmPopoverTheme>
