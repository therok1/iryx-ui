import { tv } from 'tailwind-variants'

/*
 * The chip takes its colour from `currentColor`, so a key inherits whatever it
 * sits in — a muted line of prose, a button, an alert.
 *
 * Only the border fades. The text is at full strength and there is no fill,
 * because both were costing contrast the chip cannot afford: measured against
 * a `muted-foreground` context in light mode, `text-current/75` on
 * `bg-current/10` gave 2.8:1, full-strength text on that fill 4.2:1, and the
 * border alone 4.7:1 — the ratio of the surrounding text itself. WCAG AA asks
 * 4.5:1 for text this size, so a `currentColor` fill is the one thing the
 * component must not add: it darkens the chip toward its own text and drags an
 * already-muted context under the line. The border carries the key-cap shape
 * on its own, and borders carry no text to read.
 */
export const kbdTheme = tv({
  slots: {
    root: 'inline-flex shrink-0 items-center',
    key: 'inline-flex items-center justify-center rounded border border-current/25 text-center font-medium text-current',
    separator: 'text-current',
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
