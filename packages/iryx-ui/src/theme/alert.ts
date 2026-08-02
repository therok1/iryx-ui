import { tv } from 'tailwind-variants'

/*
 * Status colours use Tailwind's built-in palettes rather than theme tokens,
 * for the same reason as badge.ts — no --iryx-success/warning/danger tokens
 * exist. Each variant carries explicit dark: classes.
 */
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
        root: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
        icon: 'text-blue-600 dark:text-blue-400',
      },
      success: {
        root: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
        icon: 'text-emerald-600 dark:text-emerald-400',
      },
      warning: {
        root: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
        icon: 'text-amber-600 dark:text-amber-400',
      },
      danger: {
        root: 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
        icon: 'text-red-600 dark:text-red-400',
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
