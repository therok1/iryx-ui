import { tv } from 'tailwind-variants'

export const tabsTheme = tv({
  slots: {
    root: 'flex flex-col gap-4',
    frame: 'flex min-w-0 shrink-0',
    list: 'relative flex min-w-0 flex-1 items-center gap-1',
    indicator: 'absolute left-0 transition-[translate,width,height] duration-200 ease-out',
    trigger: 'relative z-10 inline-flex shrink-0 items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    content: 'outline-none',
  },
  variants: {
    variant: {
      solid: {
        frame: 'rounded-xl bg-muted p-1',
        indicator: 'top-0 h-full rounded-lg bg-background shadow-sm',
        trigger: 'rounded-lg px-3 py-1.5 text-muted-foreground data-[state=active]:text-foreground',
      },
      line: {
        frame: 'border-b border-border',
        list: 'gap-4',
        indicator: 'bottom-0 h-0.5 rounded-none bg-primary',
        trigger: 'rounded-none px-1 py-2 text-muted-foreground data-[state=active]:text-foreground',
      },
    },
    orientation: {
      horizontal: {
        list: '[scrollbar-width:none] overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden',
        indicator: 'w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position)',
      },
      vertical: {
        root: 'flex-row',
        frame: 'min-h-0 flex-col',
        list: '[scrollbar-width:none] flex-col items-stretch overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden',
        indicator: 'h-(--reka-tabs-indicator-size) translate-y-(--reka-tabs-indicator-position)',
        trigger: 'justify-start',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      orientation: 'vertical',
      class: { indicator: 'top-0 left-0 w-full' },
    },
    {
      variant: 'line',
      orientation: 'vertical',
      class: {
        frame: 'border-r border-b-0',
        list: 'gap-0.5',
        indicator: 'right-0 bottom-auto left-auto h-(--reka-tabs-indicator-size) w-0.5',
        trigger: 'px-3',
      },
    },
  ],
  defaultVariants: {
    variant: 'solid',
    orientation: 'horizontal',
  },
})

export type TabsSlots = keyof ReturnType<typeof tabsTheme>
