import type { Ref } from 'vue'
import { onBeforeUnmount, ref, watch } from 'vue'

export interface ScrollEdges {
  /** Nothing is scrolled past — the leading edge needs no fade. */
  atStart: Ref<boolean>
  /** Everything is in view — the trailing edge needs no fade. */
  atEnd: Ref<boolean>
  /** No overflow at all, so neither edge fades. */
  overflowing: Ref<boolean>
  measure: () => void
}

/**
 * Track whether a scroll container has content past either edge.
 *
 * Measured rather than assumed: content arrives late, fonts reflow, and a
 * panel that fits on a desktop overflows on a phone. A fade painted on a
 * container that does not actually scroll is a lie about what is there.
 */
export function useScrollEdges(
  target: Ref<HTMLElement | undefined>,
  axis: Ref<'vertical' | 'horizontal'>,
): ScrollEdges {
  const atStart = ref(true)
  const atEnd = ref(true)
  const overflowing = ref(false)

  let observer: ResizeObserver | undefined
  let mutations: MutationObserver | undefined
  let element: HTMLElement | undefined

  function measure(): void {
    if (!element)
      return

    const vertical = axis.value === 'vertical'
    const scrolled = vertical ? element.scrollTop : Math.abs(element.scrollLeft)
    const size = vertical ? element.clientHeight : element.clientWidth
    const total = vertical ? element.scrollHeight : element.scrollWidth

    /*
     * A pixel of slack at both ends. Fractional layout — a zoomed page, a
     * scaled root font — leaves `scrollTop` a hair short of the maximum, so an
     * exact comparison keeps the trailing fade painted on a list that is
     * already scrolled to the bottom.
     */
    overflowing.value = total - size > 1
    atStart.value = scrolled <= 1
    atEnd.value = scrolled + size >= total - 1
  }

  function detach(): void {
    element?.removeEventListener('scroll', measure)
    observer?.disconnect()
    mutations?.disconnect()
    observer = undefined
    mutations = undefined
    element = undefined
  }

  watch(target, (next) => {
    detach()
    element = next
    if (!element)
      return

    measure()
    element.addEventListener('scroll', measure, { passive: true })

    if (typeof ResizeObserver !== 'undefined') {
      // The box and its content both matter: a wider container can end the
      // overflow, and taller content can start it.
      observer = new ResizeObserver(measure)
      observer.observe(element)
      for (const child of element.children)
        observer.observe(child)
    }

    if (typeof MutationObserver !== 'undefined') {
      // Rows added or removed change the scroll extent without resizing
      // anything already being observed.
      mutations = new MutationObserver(measure)
      mutations.observe(element, { childList: true, subtree: true })
    }
  }, { immediate: true })

  watch(axis, measure)
  onBeforeUnmount(detach)

  return { atStart, atEnd, overflowing, measure }
}

/**
 * The mask that fades the edges with something past them.
 *
 * A mask rather than an overlaid gradient: an overlay has to be painted in the
 * container's own background colour, which is a guess — put the component on a
 * card, a muted panel or an image and the guess is visibly wrong. Removing
 * pixels lets whatever is behind show through, so it is correct everywhere.
 *
 * Returns `undefined` when nothing should fade, so the element carries no
 * `mask-image` at all rather than an identity one.
 */
export function scrollFadeMask(options: {
  orientation: 'vertical' | 'horizontal'
  size: string
  fadeStart: boolean
  fadeEnd: boolean
}): string | undefined {
  const { orientation, size, fadeStart, fadeEnd } = options
  if (!fadeStart && !fadeEnd)
    return undefined

  const direction = orientation === 'vertical' ? 'to bottom' : 'to right'
  const stops = [
    fadeStart ? `transparent 0, black ${size}` : 'black 0',
    fadeEnd ? `black calc(100% - ${size}), transparent 100%` : 'black 100%',
  ].join(', ')

  return `linear-gradient(${direction}, ${stops})`
}
