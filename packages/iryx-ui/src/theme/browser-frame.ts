import { tv } from 'tailwind-variants'

export const browserFrameTheme = tv({
  slots: {
    root: 'overflow-hidden text-left',
    bar: 'flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3',
    dot: 'size-2.5 rounded-full bg-muted-foreground/25',
    url: 'ml-3 truncate rounded-md bg-background px-2.5 py-1 text-xs text-muted-foreground',
    body: '',
  },
  variants: {
    shadow: {
      none: {},
      sm: { root: 'shadow-xs' },
      md: { root: 'shadow-md' },
      lg: { root: 'shadow-lg' },
    },
  },
  defaultVariants: {
    shadow: 'lg',
  },
})

export type BrowserFrameSlots = keyof ReturnType<typeof browserFrameTheme>
