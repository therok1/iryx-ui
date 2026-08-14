import { tv } from 'tailwind-variants'

export const toastTheme = tv({
  slots: {
    viewport: 'fixed z-50 flex max-h-screen w-full flex-col gap-2 p-4 outline-none sm:max-w-sm',
    root: 'flex items-start gap-3 rounded-xl border p-4 shadow-lg data-[state=closed]:animate-fade-out data-[state=open]:animate-toast-in',
    icon: 'mt-0.5 shrink-0 [&_svg]:size-5',
    content: 'min-w-0 flex-1',
    title: 'text-sm font-medium',
    description: 'text-sm opacity-90',
    action: 'shrink-0 self-center rounded-lg px-2 py-1 text-sm font-medium underline-offset-4 transition-colors outline-none hover:underline focus-visible:ring-2 focus-visible:ring-current/50',
    close: '-m-1 shrink-0 self-start rounded-lg p-1 opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50 [&_svg]:size-4',
  },
  variants: {
    variant: {
      neutral: { root: 'border-border bg-background text-foreground', icon: 'text-muted-foreground' },
      success: { root: 'border-success-border bg-success-muted text-success-muted-foreground', icon: 'text-success' },
      warning: { root: 'border-warning-border bg-warning-muted text-warning-muted-foreground', icon: 'text-warning' },
      danger: { root: 'border-danger-border bg-danger-muted text-danger-muted-foreground', icon: 'text-danger' },
      info: { root: 'border-info-border bg-info-muted text-info-muted-foreground', icon: 'text-info' },
    },
    position: {
      'top-left': { viewport: 'top-0 left-0' },
      'top-center': { viewport: 'top-0 left-1/2 -translate-x-1/2' },
      'top-right': { viewport: 'top-0 right-0' },
      'bottom-left': { viewport: 'bottom-0 left-0 flex-col-reverse' },
      'bottom-center': { viewport: 'bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse' },
      'bottom-right': { viewport: 'right-0 bottom-0 flex-col-reverse' },
    },
    /** Tightens the title/description gap when both are present. */
    withTitle: {
      true: { description: 'mt-1' },
    },
  },
  defaultVariants: {
    variant: 'neutral',
    position: 'bottom-right',
  },
})

export type ToastSlots = keyof ReturnType<typeof toastTheme>
