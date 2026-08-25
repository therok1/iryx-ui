import { tv } from 'tailwind-variants'

export const dialogTheme = tv({
  slots: {
    overlay: 'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    content: 'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl border border-border bg-background p-6 text-foreground shadow-lg outline-none data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in',
    header: 'flex flex-col gap-1',
    title: 'text-base leading-none font-semibold',
    description: 'text-sm text-muted-foreground',
    body: '-m-1 min-h-0 flex-1 overflow-y-auto p-1',
    footer: 'flex flex-wrap items-center justify-end gap-2',
    close: 'absolute top-4 right-4 rounded-lg p-1 text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
  },
  variants: {
    size: {
      sm: { content: 'sm:max-w-sm' },
      md: { content: 'sm:max-w-md' },
      lg: { content: 'sm:max-w-lg' },
      xl: { content: 'sm:max-w-2xl' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type DialogSlots = keyof ReturnType<typeof dialogTheme>
