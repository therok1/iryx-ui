import { tv } from 'tailwind-variants'

export const toastTheme = tv({
  slots: {
    viewport: 'fixed z-50 flex max-h-screen w-full flex-col gap-2 p-4 outline-none sm:max-w-sm',
    root: 'iryx-toast flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-foreground shadow-lg data-[state=closed]:animate-fade-out data-[state=open]:animate-toast-in',
    icon: 'mt-px shrink-0 [&_svg]:size-4.5',
    content: 'min-w-0 flex-1',
    title: 'text-sm font-medium text-foreground',
    description: 'text-sm text-muted-foreground',
    action: 'shrink-0 self-center rounded-lg border border-border px-2.5 py-1 text-xs font-medium transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50',
    close: '-m-1 shrink-0 self-start rounded-lg p-1 text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
  },
  variants: {
    variant: {
      neutral: { icon: 'text-muted-foreground' },
      success: { icon: 'text-success' },
      warning: { icon: 'text-warning' },
      danger: { icon: 'text-danger' },
      info: { icon: 'text-info' },
    },
    position: {
      'top-left': { viewport: 'top-0 left-0' },
      'top-center': { viewport: 'top-0 left-1/2 -translate-x-1/2' },
      'top-right': { viewport: 'top-0 right-0' },
      'bottom-left': { viewport: 'bottom-0 left-0 flex-col-reverse' },
      'bottom-center': { viewport: 'bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse' },
      'bottom-right': { viewport: 'right-0 bottom-0 flex-col-reverse' },
    },
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
