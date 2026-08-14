import { tv } from 'tailwind-variants'

export const tooltipTheme = tv({
  slots: {
    content: 'z-50 max-w-xs rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md data-[state=closed]:animate-fade-out data-[state=delayed-open]:animate-fade-in',
    arrow: 'fill-foreground',
  },
})

export type TooltipSlots = keyof ReturnType<typeof tooltipTheme>
