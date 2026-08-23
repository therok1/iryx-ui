import { tv } from 'tailwind-variants'

/*
 * Chips are drawn from `currentColor` rather than the page's own tokens, so
 * they suit whatever surface they land on. A shortcut goes inside a tooltip,
 * a solid button and a menu row, and each of those inverts the text colour —
 * a chip fixed to `border-border` and `text-muted-foreground` looked right on
 * the page and washed out everywhere else.
 *
 * `min-w` with centred text keeps a row of one-character keys from looking
 * ragged — "⌘" and "K" are very different widths in most faces.
 */
export const kbdTheme = tv({
  slots: {
    root: 'inline-flex shrink-0 items-center',
    key: 'inline-flex items-center justify-center rounded border border-current/25 bg-current/10 text-center font-medium text-current/75',
    /** The `+` between chips. Punctuation, so it is hidden from readers. */
    separator: 'text-current/60',
  },
  variants: {
    size: {
      xs: { root: 'gap-0.5', key: 'h-4 min-w-4 px-1 text-[0.625rem]', separator: 'px-0.5 text-[0.625rem]' },
      sm: { root: 'gap-0.5', key: 'h-5 min-w-5 px-1 text-xs', separator: 'px-0.5 text-xs' },
      md: { root: 'gap-1', key: 'h-6 min-w-6 px-1.5 text-sm', separator: 'px-0.5 text-sm' },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export type KbdSlots = keyof ReturnType<typeof kbdTheme>
