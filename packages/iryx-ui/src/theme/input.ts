import { tv } from 'tailwind-variants'

/** Shared field chrome for Input, Textarea and the Select trigger. */
export const fieldBase
  = 'w-full rounded-lg border border-border bg-input text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50'

export const inputTheme = tv({
  base: `flex ${fieldBase}`,
  variants: {
    size: {
      sm: 'h-8 px-2.5 text-sm',
      md: 'h-9 px-3 text-sm',
      lg: 'h-10 px-4 text-base',
    },
    invalid: {
      true: 'border-red-500 focus-visible:ring-red-500/40',
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
  },
  defaultVariants: {
    size: 'md',
  },
})

export type InputVariants = Parameters<typeof inputTheme>[0]
export type TextareaVariants = Parameters<typeof textareaTheme>[0]
