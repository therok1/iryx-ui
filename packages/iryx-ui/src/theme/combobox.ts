import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const comboboxTheme = tv({
  slots: {
    // The anchor carries the field chrome; the input inside it is bare, so the
    // focus ring stays on the box even though focus lands on the input.
    anchor: `flex items-center gap-2 ${fieldBase} focus-within:ring-2 focus-within:ring-primary/50`,
    input: 'min-w-0 grow bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    trigger: 'flex shrink-0 cursor-pointer items-center text-muted-foreground disabled:cursor-not-allowed [&_svg]:size-4',
    clear: 'flex shrink-0 cursor-pointer items-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-3.5',
    // Same three slots as `tagsInputTheme`, and deliberately the same classes:
    // a chip that stands for a chosen value should not look like one thing in
    // ITagsInput and another here.
    tag: 'inline-flex shrink-0 items-center rounded-md border border-border bg-background font-medium whitespace-nowrap text-foreground',
    tagText: 'truncate',
    tagDelete: 'flex shrink-0 cursor-pointer items-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-danger focus-visible:ring-2 focus-visible:ring-primary/50',
    content: 'z-50 max-h-64 w-(--reka-combobox-trigger-width) min-w-32 overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-md',
    viewport: 'max-h-64 overflow-y-auto p-1',
    // `w-full` matters only when virtualized: Reka positions those rows
    // `absolute`, which shrink-wraps them to their text instead of filling the
    // popup. It is a no-op for the static list, where the row is already a
    // block-level flex box.
    item: 'relative flex w-full cursor-pointer items-center rounded-lg py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
    itemIndicator: 'absolute left-2 flex items-center justify-center text-primary [&_svg]:size-4',
    empty: 'px-2 py-6 text-center text-sm text-muted-foreground',
    // Gap above a group only when a *visible* group precedes it. `not-first:`
    // would key off `:first-child`, but filtered-out groups stay in the DOM
    // with `hidden`, so the topmost surviving group would still be indented.
    group: '[[role=group]:not([hidden])~&]:mt-1',
    groupLabel: 'px-2 py-1.5 text-xs font-medium text-muted-foreground',
  },
  variants: {
    size: {
      sm: {
        anchor: 'h-8 px-2.5 text-sm',
        tag: 'h-5 gap-1 px-1.5 text-xs',
        tagDelete: '[&_svg]:size-3',
      },
      md: {
        anchor: 'h-9 px-3 text-sm',
        tag: 'h-6 gap-1 px-2 text-xs',
        tagDelete: '[&_svg]:size-3',
      },
      lg: {
        anchor: 'h-10 px-4 text-base',
        tag: 'h-7 gap-1.5 px-2.5 text-sm',
        tagDelete: '[&_svg]:size-3.5',
      },
    },
    /*
     * With chips the field stops being one line tall: they wrap and the
     * control grows, the same trade ITagsInput makes. A fixed height with
     * overflow would hide values the reader needs to see before picking the
     * next one. The vertical padding halves because the chips carry their
     * own height.
     */
    chips: {
      true: {
        anchor: 'h-auto flex-wrap gap-1.5 py-1',
        /*
         * `flex-1` rather than the bare `grow` the single-value field uses,
         * for the basis: a flex line breaks on an item's *base* size, and
         * `grow` leaves that as the content width — so the placeholder's own
         * width pushed the input onto a line of its own even with room to
         * spare beside the chips. A basis of 0 lets it take whatever the row
         * has left, and `min-w-24` is what makes it wrap once that is too
         * little to type in.
         */
        input: 'min-w-24 flex-1',
      },
    },
    invalid: {
      true: { anchor: 'border-red-500 focus-within:ring-red-500/40' },
    },
    disabled: {
      true: { anchor: 'cursor-not-allowed opacity-50' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type ComboboxSlots = keyof ReturnType<typeof comboboxTheme>
