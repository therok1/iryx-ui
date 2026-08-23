import { tv } from 'tailwind-variants'

export const avatarTheme = tv({
  slots: {
    /*
     * Deliberately *not* `overflow-hidden`. The clip is what a circular
     * avatar needs for its image, but it also cropped the status dot, which
     * sits on the edge by design. The image and fallback inherit the radius
     * and clip themselves instead, leaving the dot free to overhang.
     */
    root: 'relative inline-flex shrink-0 items-center justify-center bg-muted align-middle select-none',
    image: 'size-full rounded-[inherit] object-cover',
    fallback: 'flex size-full items-center justify-center overflow-hidden rounded-[inherit] font-medium text-muted-foreground uppercase',
    /*
     * A presence dot pinned to the bounding box's lower corner, which on a
     * circle puts it just outside the curve rather than overlapping it. That
     * is deliberate: it keeps the dot clear of the face or logo underneath.
     * The ring is the page background, not a colour, so it reads as sitting
     * on top of whatever is behind it.
     *
     * This is also why the root must not clip — see the note there.
     */
    status: 'absolute right-0 bottom-0 rounded-full ring-2 ring-background',
  },
  variants: {
    size: {
      xs: { root: 'size-6', fallback: 'text-[0.625rem]', status: 'size-1.5' },
      sm: { root: 'size-8', fallback: 'text-xs', status: 'size-2' },
      md: { root: 'size-10', fallback: 'text-sm', status: 'size-2.5' },
      lg: { root: 'size-12', fallback: 'text-base', status: 'size-3' },
      xl: { root: 'size-16', fallback: 'text-xl', status: 'size-4' },
    },
    shape: {
      circle: { root: 'rounded-full' },
      square: { root: 'rounded-xl' },
    },
    status: {
      online: { status: 'bg-success' },
      busy: { status: 'bg-danger' },
      away: { status: 'bg-warning' },
      offline: { status: 'bg-muted-foreground' },
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'circle',
  },
})

export type AvatarSlots = keyof ReturnType<typeof avatarTheme>

export const avatarGroupTheme = tv({
  slots: {
    root: 'flex flex-row-reverse items-center justify-end',
    item: 'ring-2 ring-background',
    /** The "+3" chip closing the stack. */
    overflow: 'flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-background',
  },
  variants: {
    size: {
      xs: { root: '-space-x-1.5 space-x-reverse', overflow: 'size-6 text-[0.625rem]' },
      sm: { root: '-space-x-2 space-x-reverse', overflow: 'size-8 text-xs' },
      md: { root: '-space-x-2.5 space-x-reverse', overflow: 'size-10 text-sm' },
      lg: { root: '-space-x-3 space-x-reverse', overflow: 'size-12 text-base' },
      xl: { root: '-space-x-4 space-x-reverse', overflow: 'size-16 text-xl' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type AvatarGroupSlots = keyof ReturnType<typeof avatarGroupTheme>
