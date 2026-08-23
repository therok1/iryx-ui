<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { scrollFadeMask, useScrollEdges } from '../composables/scroll-fade'
import { useIryxUiConfig } from '../config'
import { scrollFadeTheme } from '../theme/scroll-fade'

export interface ScrollFadeProps {
  /** Which way it scrolls. */
  orientation?: 'vertical' | 'horizontal'
  /** Length of the fade, as any CSS length. */
  size?: string
  /** Never fade the leading edge, e.g. under a sticky header that hides it. */
  fadeStart?: boolean
  /** Never fade the trailing edge. */
  fadeEnd?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
}

const props = withDefaults(defineProps<ScrollFadeProps>(), {
  orientation: 'vertical',
  size: '2rem',
  fadeStart: true,
  fadeEnd: true,
  unstyled: undefined,
})

defineSlots<{
  /** Receives the live edge state, for a caller who wants to react to it. */
  default: (props: { atStart: boolean, atEnd: boolean, overflowing: boolean }) => any
}>()

const root = ref<HTMLElement>()
const { atStart, atEnd, overflowing } = useScrollEdges(root, toRef(props, 'orientation'))

const maskStyle = computed(() => {
  if (!overflowing.value)
    return undefined

  const mask = scrollFadeMask({
    orientation: props.orientation,
    size: props.size,
    fadeStart: props.fadeStart && !atStart.value,
    fadeEnd: props.fadeEnd && !atEnd.value,
  })

  return mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)
const theme = computed(() => scrollFadeTheme({ orientation: props.orientation }))

/*
 * One element carries the scroll, the mask and the caller's frame, so a border
 * and the scrollbar fade with the content. Splitting it into a frame plus an
 * inner scroller was tried and reverted: it pushes the scrollbar inside the
 * padding, and `mask-clip: content-box` does not hold the mask off it either.
 *
 * The template keeps a single root: a leading comment node would make this a
 * fragment, and `wrapper.element` would stop being the div.
 */
const rootClass = computed(() =>
  isUnstyled.value ? props.class : theme.value.root({ class: props.class }),
)
</script>

<template>
  <div
    ref="root"
    :class="rootClass"
    :style="maskStyle"
    :data-at-start="atStart ? '' : undefined"
    :data-at-end="atEnd ? '' : undefined"
    :data-overflowing="overflowing ? '' : undefined"
  >
    <slot :at-start="atStart" :at-end="atEnd" :overflowing="overflowing" />
  </div>
</template>
