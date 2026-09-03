import { tv } from 'tailwind-variants'

export const codeTheme = tv({
  slots: {
    root: '',
    code: 'font-mono',
    copy: 'focus-visible:outline-ring inline-flex shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 [&_svg]:size-4',
  },
  variants: {
    block: {
      true: {
        root: 'relative overflow-hidden rounded-lg border border-border bg-muted',
        code: 'block overflow-x-auto py-4 pr-14 pl-4 text-sm text-foreground',
        copy: 'absolute top-2 right-2 size-7 border border-border bg-background',
      },
      false: {
        root: 'inline-flex items-center gap-1',
        code: 'rounded border border-current/25 bg-current/10 px-1.5 py-0.5 font-mono text-[0.875em] text-current/90',
        copy: 'size-5 [&_svg]:size-3.5',
      },
    },
  },
  defaultVariants: {
    block: false,
  },
})

export type CodeSlots = keyof ReturnType<typeof codeTheme>
