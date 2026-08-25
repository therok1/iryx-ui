import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const comboboxTheme = tv({
  slots: {
    anchor: `flex items-center gap-2 ${fieldBase} focus-within:ring-2 focus-within:ring-primary/50`,
    input: 'min-w-0 grow bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    trigger: 'flex shrink-0 cursor-pointer items-center text-muted-foreground disabled:cursor-not-allowed [&_svg]:size-4',
    clear: 'flex shrink-0 cursor-pointer items-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-3.5',
    tag: 'inline-flex shrink-0 items-center rounded-md border border-border bg-background font-medium whitespace-nowrap text-foreground data-[state=active]:border-primary data-[state=active]:bg-accent',
    tagText: 'truncate',
    tagDelete: 'flex shrink-0 cursor-pointer items-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-danger focus-visible:ring-2 focus-visible:ring-primary/50',
    content: 'z-50 max-h-64 w-(--reka-combobox-trigger-width) min-w-32 overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-md',
    viewport: 'max-h-64 overflow-y-auto p-1',
    item: 'relative flex w-full cursor-pointer items-center rounded-lg py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
    itemIndicator: 'absolute left-2 flex items-center justify-center text-primary [&_svg]:size-4',
    empty: 'px-2 py-6 text-center text-sm text-muted-foreground',
    group: '[[role=group]:not([hidden])~&]:mt-1',
    groupLabel: 'px-2 py-1.5 text-xs font-medium text-muted-foreground',
  },
  variants: {
    size: {
      sm: {
        anchor: 'h-8 min-h-8 px-2.5 text-sm',
        tag: 'h-5 gap-1 px-1.5 text-xs',
        tagDelete: '[&_svg]:size-3',
      },
      md: {
        anchor: 'h-9 min-h-9 px-3 text-sm',
        tag: 'h-6 gap-1 px-2 text-xs',
        tagDelete: '[&_svg]:size-3',
      },
      lg: {
        anchor: 'h-10 min-h-10 px-4 text-base',
        tag: 'h-7 gap-1.5 px-2.5 text-sm',
        tagDelete: '[&_svg]:size-3.5',
      },
    },
    chips: {
      true: {
        anchor: 'h-auto flex-wrap gap-1.5 py-1',
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
