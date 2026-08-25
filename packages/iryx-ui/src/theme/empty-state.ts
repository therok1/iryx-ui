import { tv } from 'tailwind-variants'

export const emptyStateTheme = tv({
  slots: {
    root: 'flex flex-col items-center justify-center text-center',
    icon: 'text-muted-foreground',
    title: 'font-medium text-foreground',
    description: 'max-w-sm text-sm text-muted-foreground',
    actions: 'flex flex-wrap items-center justify-center gap-2',
  },
  variants: {
    size: {
      sm: {
        root: 'gap-1.5 px-4 py-8',
        icon: '[&_svg]:size-8',
        title: 'text-sm',
        actions: 'mt-2',
      },
      md: {
        root: 'gap-2 px-6 py-12',
        icon: '[&_svg]:size-10',
        title: 'text-base',
        actions: 'mt-4',
      },
      lg: {
        root: 'gap-2.5 px-8 py-16',
        icon: '[&_svg]:size-12',
        title: 'text-lg',
        actions: 'mt-6',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type EmptyStateSlots = keyof ReturnType<typeof emptyStateTheme>
