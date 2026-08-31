import { tv } from 'tailwind-variants'

export const fileUploadTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-3',
    dropzone: 'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-input px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-primary/50 hover:border-primary/50',
    input: 'sr-only',
    icon: 'flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5',
    label: 'text-sm text-foreground',
    browse: 'mt-2',
    hint: 'text-xs text-muted-foreground',
    list: 'flex flex-col gap-2',
    item: 'flex items-center gap-3 rounded-xl border border-border bg-input p-2',
    thumbnail: 'size-10 shrink-0 rounded-lg object-cover',
    placeholder: 'flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4',
    details: 'flex min-w-0 flex-1 flex-col',
    name: 'truncate text-sm text-foreground',
    meta: 'text-xs text-muted-foreground tabular-nums',
    remove: 'flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-[color,background-color,border-color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
    error: 'text-xs text-danger',
  },
  variants: {
    dragging: {
      true: { dropzone: 'border-primary bg-accent' },
    },
    invalid: {
      true: { dropzone: 'border-red-500 focus-within:ring-red-500/40' },
    },
    disabled: {
      true: { dropzone: 'pointer-events-none opacity-50' },
    },
  },
})

export type FileUploadSlots = keyof ReturnType<typeof fileUploadTheme>
