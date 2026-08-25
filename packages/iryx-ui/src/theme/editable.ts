import { tv } from 'tailwind-variants'

/*
 * Both states are plain text — what `contenteditable` looks like, not what a
 * form field looks like.
 *
 * No border, no background, no box: a bordered field appearing around a
 * heading or a table cell announces itself as a form, when the point of
 * editing in place is that the text stays where it was and stays what it was.
 * The caret is the whole affordance.
 *
 * The two states therefore have identical metrics, so the line cannot shift as
 * they swap — an inline edit that moves the text it replaces makes the reader
 * lose their place.
 */
export const editableTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-1',
    area: 'min-w-0 flex-1',
    /*
     * A hover tint is the only chrome. No focus ring: focusing the preview is
     * what starts an edit, so the caret arrives in the same moment and is the
     * indicator. The negative margin lets the tint breathe without moving the
     * text off the line it shares with everything around it.
     */
    preview: '-mx-1 w-full cursor-text truncate rounded-md px-1 text-left text-foreground transition-colors outline-none hover:bg-accent/60 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent',
    /** Shown when there is nothing to read, so an empty value stays clickable. */
    placeholder: 'text-muted-foreground',
    /*
     * Bare text with a caret in it.
     *
     * `[font:inherit]` is doing real work: an `<input>` does not inherit
     * typography, and any surrounding stylesheet that sets a font size on
     * form controls — a docs theme, a CSS reset, prose styles — outranks a
     * utility class and makes the text change size the moment an edit starts.
     * Inheriting takes whatever the text around it already has.
     */
    input: '-mx-1 w-full bg-transparent px-1 [letter-spacing:inherit] text-foreground outline-none [font:inherit] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
    control: 'flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
  },
  variants: {
    /*
     * Typography, not a box — it is text, so the only thing to size is the
     * text. Set on the root so both states inherit one value rather than
     * carrying their own and drifting apart.
     */
    size: {
      sm: { root: 'text-sm' },
      md: { root: 'text-sm' },
      lg: { root: 'text-base' },
    },
    invalid: {
      true: { preview: 'text-red-500', input: 'text-red-500' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type EditableSlots = keyof ReturnType<typeof editableTheme>
