import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

/*
 * The gradients arrive as inline background styles: a slider paints its own
 * ramp, and the area's plane comes down through `ColorAreaRoot`'s slot for
 * the component to apply. Nothing here may set a background on those elements
 * or it would cover the colour being picked.
 *
 * The thumbs are solid white inside a light grey border, so they stay visible
 * against every part of the spectrum they travel over — a thumb tinted with
 * the colour underneath it disappears exactly where it is being aimed.
 */
export const colorPickerTheme = tv({
  slots: {
    root: 'flex w-64 flex-col gap-3',
    /** Saturation/brightness plane. Height is fixed; width follows the root. */
    area: 'relative h-40 w-full rounded-xl',
    thumb: 'size-4 rounded-full border-2 border-gray-300 bg-white outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    /*
     * A ramp's thumb is taller than its track, and Reka gives it no `top` —
     * so it lands at the flow position and hangs below centre. Centred with
     * `top-1/2` plus a negative margin rather than `-translate-y-1/2`: Reka
     * sets `transform` inline for the horizontal offset, which would win.
     */
    sliderThumb: 'absolute top-1/2 -mt-2',
    slider: 'relative h-3 w-full rounded-full',
    /*
     * The alpha ramp is transparent at one end, so it needs a chequerboard
     * behind it to read as transparency rather than as white.
     */
    checkerboard: 'absolute inset-0 rounded-full bg-[repeating-conic-gradient(theme(colors.gray.400)_0_25%,transparent_0_50%)] bg-[length:8px_8px]',
    track: 'absolute inset-0 rounded-full',
    field: `flex items-center ${fieldBase} h-9 gap-2 px-3`,
    input: 'w-full min-w-0 flex-1 bg-transparent font-mono text-sm uppercase outline-none',
    /** Current colour, shown beside the hex field. Also needs the chequerboard. */
    preview: 'relative size-5 shrink-0 overflow-hidden rounded-md border border-border',
    swatches: 'flex flex-wrap gap-1.5',
    swatch: 'size-6 rounded-md border border-border outline-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[state=checked]:ring-2 data-[state=checked]:ring-primary',
  },
})

export type ColorPickerSlots = keyof ReturnType<typeof colorPickerTheme>
