import { tv } from 'tailwind-variants'
import { fieldBase } from './input'

export const colorPickerTheme = tv({
  slots: {
    root: 'flex w-64 flex-col gap-3',
    area: 'relative h-40 w-full rounded-xl',
    thumb: 'size-4 rounded-full border-2 border-gray-300 bg-white transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    sliderThumb: 'absolute top-1/2 -mt-2',
    slider: 'relative h-3 w-full rounded-full',
    checkerboard: 'absolute inset-0 rounded-full bg-[repeating-conic-gradient(theme(colors.gray.400)_0_25%,transparent_0_50%)] bg-[length:8px_8px]',
    track: 'absolute inset-0 rounded-full',
    field: `flex items-center ${fieldBase} h-9 gap-2 px-3`,
    input: 'w-full min-w-0 flex-1 bg-transparent font-mono text-sm uppercase outline-none',
    preview: 'relative size-5 shrink-0 overflow-hidden rounded-md border border-border',
    swatches: 'flex flex-wrap gap-1.5',
    swatch: 'size-6 rounded-md border border-border transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[state=checked]:ring-2 data-[state=checked]:ring-primary',
  },
})

export type ColorPickerSlots = keyof ReturnType<typeof colorPickerTheme>
