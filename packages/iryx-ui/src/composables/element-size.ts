import type { Ref } from 'vue'
import { onBeforeUnmount, ref, watch } from 'vue'

/**
 * Track an element's rendered width.
 *
 * A sparkline can stretch a fixed box because strokes opt out of the scaling.
 * A chart with axes cannot: text stretched by `preserveAspectRatio="none"`
 * comes out distorted, so the drawing has to happen in real pixels and the
 * width has to be measured.
 *
 * One observer per chart, not per mark — cheap enough at that granularity.
 */
export function useElementSize(target: Ref<HTMLElement | undefined>) {
  const width = ref(0)
  const height = ref(0)

  let observer: ResizeObserver | undefined

  function disconnect(): void {
    observer?.disconnect()
    observer = undefined
  }

  watch(target, (element) => {
    disconnect()
    if (!element)
      return

    // Seed from layout first, and unconditionally: the observer fires
    // asynchronously, and where it does not exist at all this is the only
    // measurement there will ever be.
    width.value = element.clientWidth
    height.value = element.clientHeight

    if (typeof ResizeObserver === 'undefined')
      return

    observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry)
        return
      // `contentRect` excludes padding, which is what a plot area wants.
      width.value = entry.contentRect.width
      height.value = entry.contentRect.height
    })
    observer.observe(element)
  }, { immediate: true, flush: 'post' })

  onBeforeUnmount(disconnect)

  return { width, height }
}
