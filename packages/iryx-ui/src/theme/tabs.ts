import { tv } from 'tailwind-variants'

export const tabsTheme = tv({
  slots: {
    root: 'flex flex-col gap-4',
    list: 'relative flex shrink-0 items-center gap-1',
    trigger: 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    content: 'outline-none',
  },
  variants: {
    variant: {
      /** Pill sitting on a muted track. */
      solid: {
        list: 'rounded-lg bg-muted p-1',
        trigger: 'px-3 py-1.5 text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      },
      /** Underlined, for page-level navigation. */
      line: {
        list: 'gap-4 border-b border-border',
        trigger: '-mb-px border-b-2 border-transparent px-1 py-2 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground',
      },
    },
    orientation: {
      horizontal: {},
      vertical: { root: 'flex-row', list: 'flex-col items-stretch' },
    },
  },
  compoundVariants: [
    { variant: 'line', orientation: 'vertical', class: { list: 'border-r border-b-0', trigger: '-mr-px mb-0 border-r-2 border-b-0 text-left' } },
  ],
  defaultVariants: {
    variant: 'solid',
    orientation: 'horizontal',
  },
})

export type TabsSlots = keyof ReturnType<typeof tabsTheme>
