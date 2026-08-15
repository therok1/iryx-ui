import { tv } from 'tailwind-variants'

export const drawerTheme = tv({
  slots: {
    // Animations are defined in theme.css, so no plugin is needed.
    overlay: 'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    /*
     * `iryx-drawer` is a real class in theme.css, not a utility: it carries
     * the `transform` that follows the finger, built from CSS variables Reka
     * writes at runtime. `touch-none` stops the browser scrolling the page
     * out from under a drag — the body slot re-enables it for its own scroll.
     */
    content: 'iryx-drawer fixed z-50 flex touch-none flex-col gap-4 border-border bg-background p-6 text-foreground shadow-lg outline-none',
    /*
     * Grab hint. Sized as a pill and centred on the edge the panel came from;
     * `aria-hidden` is Reka's, since it is purely decorative.
     */
    handle: 'shrink-0 rounded-full bg-border',
    header: 'flex flex-col gap-1',
    title: 'text-base leading-none font-semibold',
    description: 'text-sm text-muted-foreground',
    /*
     * Scrolls on its own so the header and footer stay put. `overflow-y-auto`
     * also clips the x axis, which would cut the focus ring off a control
     * inside — the padding gives the ring room, and the negative margin keeps
     * the visual alignment unchanged. `touch-auto` undoes the panel's
     * `touch-none` so the body can be scrolled by finger.
     */
    body: '-m-1 min-h-0 flex-1 touch-auto overflow-y-auto p-1',
    footer: 'flex flex-wrap items-center justify-end gap-2',
    close: 'absolute top-4 right-4 rounded-lg p-1 text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 [&_svg]:size-4',
  },
  variants: {
    /*
     * The edge the drawer is attached to. Side drawers run the full viewport
     * height and stay square, because their leading edge is a full-height
     * seam; top and bottom sheets round the edge that faces the content, which
     * is the idiom that reads as a sheet pulled off the screen edge.
     */
    side: {
      right: {
        content: 'inset-y-0 right-0 h-dvh w-full border-l data-[state=closed]:animate-drawer-out-right data-[state=open]:animate-drawer-in-right',
        handle: 'absolute top-1/2 left-1.5 h-10 w-1 -translate-y-1/2',
      },
      left: {
        content: 'inset-y-0 left-0 h-dvh w-full border-r data-[state=closed]:animate-drawer-out-left data-[state=open]:animate-drawer-in-left',
        handle: 'absolute top-1/2 right-1.5 h-10 w-1 -translate-y-1/2',
      },
      top: {
        content: 'inset-x-0 top-0 w-full rounded-b-2xl border-b pb-4 data-[state=closed]:animate-drawer-out-top data-[state=open]:animate-drawer-in-top',
        handle: 'order-last mx-auto h-1 w-10',
      },
      bottom: {
        content: 'inset-x-0 bottom-0 w-full rounded-t-2xl border-t pt-4 data-[state=closed]:animate-drawer-out-bottom data-[state=open]:animate-drawer-in-bottom',
        handle: 'mx-auto h-1 w-10',
      },
    },
    /*
     * Size means width on a side drawer and height on a sheet, so it can only
     * be resolved against `side` — hence the compound variants below rather
     * than classes here.
     */
    size: {
      sm: {},
      md: {},
      lg: {},
      xl: {},
      full: {},
    },
  },
  compoundVariants: [
    // Side drawers: size is a width, capped so a phone still gets the full screen.
    { side: ['left', 'right'], size: 'sm', class: { content: 'sm:max-w-sm' } },
    { side: ['left', 'right'], size: 'md', class: { content: 'sm:max-w-md' } },
    { side: ['left', 'right'], size: 'lg', class: { content: 'sm:max-w-lg' } },
    { side: ['left', 'right'], size: 'xl', class: { content: 'sm:max-w-2xl' } },
    { side: ['left', 'right'], size: 'full', class: { content: 'max-w-none' } },
    /*
     * Sheets: size is a *max* height, so a short sheet hugs its content
     * instead of leaving a gap under the footer.
     */
    { side: ['top', 'bottom'], size: 'sm', class: { content: 'max-h-[25dvh]' } },
    { side: ['top', 'bottom'], size: 'md', class: { content: 'max-h-[40dvh]' } },
    { side: ['top', 'bottom'], size: 'lg', class: { content: 'max-h-[60dvh]' } },
    { side: ['top', 'bottom'], size: 'xl', class: { content: 'max-h-[80dvh]' } },
    { side: ['top', 'bottom'], size: 'full', class: { content: 'h-dvh max-h-none rounded-none' } },
  ],
  defaultVariants: {
    side: 'right',
    size: 'md',
  },
})

export type DrawerSlots = keyof ReturnType<typeof drawerTheme>
