import { tv } from 'tailwind-variants'

export const fileUploadTheme = tv({
  slots: {
    root: 'flex w-full flex-col gap-3',
    /**
     * A label, so a click anywhere on the zone opens the picker without any
     * script — the `<input type="file">` inside stays the real control and
     * keeps its native keyboard and screen-reader behaviour.
     */
    dropzone: 'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-input px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-primary/50 hover:border-primary/50',
    /** Visually hidden rather than `display:none`, which drops it from the tab order. */
    input: 'sr-only',
    /**
     * A filled disc behind the glyph. A bare icon floating in the middle of a
     * large dashed box reads as an artefact; the disc gives it enough weight
     * to be the thing the zone is built around.
     */
    icon: 'flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5',
    label: 'text-sm text-foreground',
    /** Spacing only — the look comes from Button, so it tracks the theme. */
    browse: 'mt-2',
    hint: 'text-xs text-muted-foreground',
    list: 'flex flex-col gap-2',
    item: 'flex items-center gap-3 rounded-xl border border-border bg-input p-2',
    thumbnail: 'size-10 shrink-0 rounded-lg object-cover',
    /** Stand-in for anything without a preview, so rows stay the same height. */
    placeholder: 'flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4',
    details: 'flex min-w-0 flex-1 flex-col',
    name: 'truncate text-sm text-foreground',
    meta: 'text-xs text-muted-foreground tabular-nums',
    remove: 'flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
    error: 'text-xs text-danger',
  },
  variants: {
    /** Held during a drag, so the target is unmistakable while dragging. */
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
