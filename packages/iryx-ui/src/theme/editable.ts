import { tv } from 'tailwind-variants'

export const editableTheme = tv({
  slots: {
    root: 'inline-flex items-center gap-1',
    area: 'min-w-0 flex-1',
    preview: '-mx-1 w-full cursor-text truncate rounded-md px-1 text-left text-foreground transition-colors outline-none hover:bg-accent/60 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent',
    placeholder: 'text-muted-foreground',
    input: '-mx-1 w-full bg-transparent px-1 [letter-spacing:inherit] text-foreground outline-none [font:inherit] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
    control: 'flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
  },
  variants: {
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
