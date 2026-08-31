import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const tagsInputTheme = tv({
  slots: {
    root: `flex flex-wrap items-center ${fieldBase} h-auto cursor-text focus-within:ring-2 focus-within:ring-primary/50`,
    tag: 'inline-flex shrink-0 items-center rounded-md border border-border bg-background font-medium whitespace-nowrap text-foreground data-[state=active]:border-primary data-[state=active]:bg-accent',
    tagText: 'truncate',
    tagDelete: 'flex shrink-0 items-center rounded-sm text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:text-danger focus-visible:ring-2 focus-visible:ring-primary/50',
    input: 'min-w-24 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    clear: 'flex shrink-0 items-center rounded-md text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50',
  },
  variants: {
    size: {
      sm: {
        root: 'min-h-8 gap-1 px-2 py-1 text-sm',
        tag: 'h-5 gap-1 px-1.5 text-xs',
        tagDelete: '[&_svg]:size-3',
        input: 'text-sm',
        clear: '[&_svg]:size-3.5',
      },
      md: {
        root: 'min-h-9 gap-1.5 px-2.5 py-1 text-sm',
        tag: 'h-6 gap-1 px-2 text-xs',
        tagDelete: '[&_svg]:size-3',
        input: 'text-sm',
        clear: '[&_svg]:size-3.5',
      },
      lg: {
        root: 'min-h-10 gap-1.5 px-3 py-1.5 text-base',
        tag: 'h-7 gap-1.5 px-2.5 text-sm',
        tagDelete: '[&_svg]:size-3.5',
        input: 'text-base',
        clear: '[&_svg]:size-4',
      },
    },
    invalid: {
      true: { root: 'border-red-500 focus-within:ring-red-500/40' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TagsInputSlots = keyof ReturnType<typeof tagsInputTheme>
