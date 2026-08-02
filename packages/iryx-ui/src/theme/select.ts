import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const selectTheme = tv({
  slots: {
    trigger: `flex items-center justify-between gap-2 ${fieldBase} cursor-pointer data-[placeholder]:text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-60`,
    content: 'z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-md',
    viewport: 'p-1',
    item: 'relative flex cursor-pointer items-center rounded-md py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
    itemIndicator: 'absolute left-2 flex items-center justify-center text-primary [&_svg]:size-4',
  },
  variants: {
    size: {
      sm: { trigger: 'h-8 px-2.5 text-sm' },
      md: { trigger: 'h-9 px-3 text-sm' },
      lg: { trigger: 'h-10 px-4 text-base' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type SelectSlots = keyof ReturnType<typeof selectTheme>
