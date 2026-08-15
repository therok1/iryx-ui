import { tv } from 'tailwind-variants'

/**
 * The meter's colour is the same deliberate exception `IProgress` makes: the
 * coloured bar *is* the reading, not decoration on a surface. Everywhere else
 * status colour belongs in the mark, not the chrome.
 */
export const passwordInputTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-2',
    /**
     * Edge draws its own reveal eye on `input[type=password]`, and its own
     * clear cross once the field is revealed to `type=text`. Both would sit
     * beside ours, so the field shows two of each in that browser only.
     */
    input: '[&::-ms-clear]:hidden [&::-ms-reveal]:hidden',
    toggle: 'flex items-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
    meter: 'flex items-center gap-2',
    track: 'flex h-1 flex-1 gap-1',
    /** Unfilled by default; the `score` variant paints the ones below it. */
    segment: 'h-full flex-1 rounded-full bg-muted transition-colors',
    label: 'shrink-0 text-xs text-muted-foreground tabular-nums',
  },
  variants: {
    score: {
      0: {},
      1: { segment: 'data-[filled]:bg-danger' },
      2: { segment: 'data-[filled]:bg-warning' },
      3: { segment: 'data-[filled]:bg-info' },
      4: { segment: 'data-[filled]:bg-success' },
    },
  },
  defaultVariants: {
    score: 0,
  },
})

export type PasswordInputSlots = keyof ReturnType<typeof passwordInputTheme>
