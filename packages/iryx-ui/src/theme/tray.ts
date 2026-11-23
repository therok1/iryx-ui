import { tv } from 'tailwind-variants'

// Inner radius = tray radius − padding, so children get xl; the variable reaches cards nested in a grid too.
export const traySlots = {
  root: 'flex flex-col rounded-2xl bg-muted/60 p-1 text-foreground',
  header: 'flex flex-wrap items-center gap-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap',
  icon: 'size-4 shrink-0 text-muted-foreground',
  actions: 'ml-auto flex flex-wrap items-center gap-2 max-sm:w-full',
  body: 'flex flex-1 gap-1 [--iryx-card-radius:var(--radius-xl)] max-lg:flex-col [&>*]:rounded-xl [&>*]:shadow-none',
}

export const trayTheme = tv({ slots: traySlots })

export type TraySlots = keyof typeof traySlots
