import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const comboboxTheme = tv({
  slots: {
    // The anchor carries the field chrome; the input inside it is bare, so the
    // focus ring stays on the box even though focus lands on the input.
    anchor: `flex items-center gap-2 ${fieldBase} focus-within:ring-2 focus-within:ring-primary/50`,
    input: 'min-w-0 grow bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    trigger: 'flex shrink-0 cursor-pointer items-center text-muted-foreground disabled:cursor-not-allowed [&_svg]:size-4',
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
      sm: { anchor: 'h-8 px-2.5 text-sm' },
      md: { anchor: 'h-9 px-3 text-sm' },
      lg: { anchor: 'h-10 px-4 text-base' },
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
