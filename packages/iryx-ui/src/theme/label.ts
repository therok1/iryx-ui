import { tv } from 'tailwind-variants'

export const labelTheme = tv({
  base: 'inline-flex items-center gap-1 text-sm leading-none font-medium text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  variants: {
    required: {
      true: 'after:text-red-500 after:content-[\'*\']',
    },
  },
})

export type LabelVariants = Parameters<typeof labelTheme>[0]
