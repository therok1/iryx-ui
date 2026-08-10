import { tv } from 'tailwind-variants'

export const alertTheme = tv({
  slots: {
    root: 'flex w-full gap-3 rounded-lg border p-4',
    icon: 'mt-0.5 shrink-0 [&_svg]:size-5',
    content: 'min-w-0 flex-1',
    title: 'text-sm font-medium',
    description: 'text-sm opacity-90',
    close: '-m-1 shrink-0 self-start rounded-md p-1 opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50 [&_svg]:size-4',
  },
  variants: {
    variant: {
      info: {
        root: 'border-info-border bg-info-muted text-info-muted-foreground',
        icon: 'text-info',
      },
      success: {
        root: 'border-success-border bg-success-muted text-success-muted-foreground',
        icon: 'text-success',
      },
      warning: {
        root: 'border-warning-border bg-warning-muted text-warning-muted-foreground',
        icon: 'text-warning',
      },
      danger: {
        root: 'border-danger-border bg-danger-muted text-danger-muted-foreground',
        icon: 'text-danger',
      },
    },
    /** Tightens the title/description gap when both are present. */
    withTitle: {
      true: { description: 'mt-1' },
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

export type AlertSlots = keyof ReturnType<typeof alertTheme>
