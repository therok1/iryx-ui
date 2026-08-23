import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

/*
 * The pad is a field, so it wears the same chrome as one — a signature box
 * that looks unlike every other input on the form reads as an image, not
 * something to fill in.
 */
export const signaturePadTheme = tv({
  slots: {
    root: `relative flex flex-col ${fieldBase} h-auto overflow-hidden p-0 focus-within:ring-2 focus-within:ring-primary/50`,
    /*
     * `touch-action: none` is not optional: without it a finger signature
     * scrolls the page instead of drawing. `block` kills the inline gap that
     * would otherwise leave a sliver under the canvas.
     */
    canvas: 'block w-full touch-none',
    actions: 'absolute top-2 right-2 flex items-center gap-1',
    action: 'inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5',
  },
  variants: {
    invalid: {
      true: { root: 'border-red-500 focus-within:ring-red-500/40' },
    },
    disabled: {
      true: { root: 'cursor-not-allowed opacity-50' },
    },
  },
})

export type SignaturePadSlots = keyof ReturnType<typeof signaturePadTheme>
