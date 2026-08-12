import { tv } from 'tailwind-variants'

export const switchTheme = tv({
  slots: {
    /** Only rendered when a `label` or `description` is provided. */
    wrapper: 'flex items-start gap-2.5',
    root: 'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted',
    thumb: 'pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0.5',
    content: 'grid gap-1',
    // leading-5 matches the 20px control height, so the first line lines up.
    label: 'text-sm leading-5 font-medium text-foreground select-none',
    description: 'text-sm leading-snug text-muted-foreground',
  },
})

export type SwitchSlots = keyof ReturnType<typeof switchTheme>
