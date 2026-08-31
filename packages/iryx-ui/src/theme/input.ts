import { tv } from 'tailwind-variants'

/** Shared field chrome for Input, Textarea and the Select trigger. */
export const fieldBase
  = 'w-full rounded-xl border border-border bg-input text-foreground transition-[color,background-color,border-color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50'

export const inputTheme = tv({
  slots: {
    root: `flex items-center ${fieldBase} focus-within:ring-2 focus-within:ring-primary/50 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50`,
    input: 'w-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    leading: 'flex shrink-0 items-center text-muted-foreground [&_svg]:size-4',
    trailing: 'flex shrink-0 items-center gap-1.5 text-muted-foreground [&_svg]:size-4',
    clear: 'flex items-center rounded-md text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-3.5',
  },
  variants: {
    size: {
      sm: { root: 'h-8 gap-1.5 px-2.5', input: 'text-sm' },
      md: { root: 'h-9 gap-2 px-3', input: 'text-sm' },
      lg: { root: 'h-10 gap-2 px-4', input: 'text-base' },
    },
    invalid: {
      true: { root: 'border-red-500 focus-within:ring-red-500/40' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const textareaTheme = tv({
  base: `block resize-y ${fieldBase}`,
  variants: {
    size: {
      sm: 'min-h-16 px-2.5 py-1.5 text-sm',
      md: 'min-h-20 px-3 py-2 text-sm',
      lg: 'min-h-24 px-4 py-2.5 text-base',
    },
    invalid: {
      true: 'border-red-500 focus-visible:ring-red-500/40',
    },
    autosize: {
      true: 'min-h-0 resize-none',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type InputVariants = Parameters<typeof inputTheme>[0]
export type InputSlots = keyof ReturnType<typeof inputTheme>
export type TextareaVariants = Parameters<typeof textareaTheme>[0]
