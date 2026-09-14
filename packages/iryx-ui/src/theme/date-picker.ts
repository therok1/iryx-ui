import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const datePickerTheme = tv({
  slots: {
    trigger: `flex items-center justify-between gap-2 ${fieldBase} cursor-pointer [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-60`,
    placeholder: 'text-muted-foreground',
    content: 'z-50 rounded-xl border border-border bg-background p-3 text-foreground shadow-md',
    panel: 'flex flex-col gap-3 sm:flex-row',
    presets: '-mx-3 -mt-3 flex w-0 min-w-[calc(100%+--spacing(6))] gap-1 overflow-x-auto border-b border-border p-3 sm:mx-0 sm:-my-3 sm:ml-0 sm:w-auto sm:min-w-0 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0 sm:py-3 sm:pr-3 sm:pl-0',
    preset: 'shrink-0 rounded-lg px-2 py-1 text-left text-sm whitespace-nowrap text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-accent aria-pressed:text-accent-foreground',
    footer: 'flex items-center justify-between gap-2 pt-3',
    action: 'rounded-lg px-2 py-1 text-sm text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50',
  },
  variants: {
    size: {
      sm: { trigger: 'h-8 px-2.5 text-sm' },
      md: { trigger: 'h-9 px-3 text-sm' },
      lg: { trigger: 'h-10 px-4 text-base' },
    },
    invalid: {
      true: { trigger: 'border-red-500 focus-visible:ring-red-500/40' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type DatePickerSlots = keyof ReturnType<typeof datePickerTheme>
