import { tv } from 'tailwind-variants'

export const breadcrumbTheme = tv({
  slots: {
    root: 'text-sm',
    list: 'flex flex-wrap items-center gap-1.5',
    item: 'inline-flex items-center gap-1.5',
    link: 'inline-flex items-center gap-1.5 rounded text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4 [&_svg]:shrink-0',
    current: 'inline-flex items-center gap-1.5 font-medium text-foreground [&_svg]:size-4 [&_svg]:shrink-0',
    separator: 'text-muted-foreground [&_svg]:size-3.5',
  },
})

export type BreadcrumbSlots = keyof ReturnType<typeof breadcrumbTheme>
