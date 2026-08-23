<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { scrollAreaTheme } from '../theme/scroll-area'

export interface ScrollAreaProps {
  /**
   * When the bars show. `hover` is the quietest and `always` the most
   * discoverable; `auto` behaves like a native bar that appears only when
   * there is something to scroll.
   */
  type?: 'auto' | 'always' | 'scroll' | 'hover'
  /** Which axes get a bar. */
  orientation?: 'vertical' | 'horizontal' | 'both'
  size?: 'sm' | 'md' | 'lg'
  /** How long the bars linger after scrolling stops, for `scroll` and `hover`. */
  scrollHideDelay?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ thumb: 'bg-primary' }`. */
  ui?: {
    root?: string
    viewport?: string
    scrollbar?: string
    thumb?: string
    corner?: string
  }
}

/** Replaces the scrollbar, not the scrolling. The root needs a height. */
const props = withDefaults(defineProps<ScrollAreaProps>(), {
  type: 'hover',
  orientation: 'vertical',
  unstyled: undefined,
})

const showVertical = computed(() => props.orientation !== 'horizontal')
const showHorizontal = computed(() => props.orientation !== 'vertical')

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const vertical = computed(() => scrollAreaTheme({ orientation: 'vertical', size: props.size }))
const horizontal = computed(() => scrollAreaTheme({ orientation: 'horizontal', size: props.size }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : vertical.value.root({ class: [props.ui?.root, props.class] }),
)
const viewportClass = computed(() =>
  isUnstyled.value ? props.ui?.viewport : vertical.value.viewport({ class: props.ui?.viewport }),
)
const thumbClass = computed(() =>
  isUnstyled.value ? props.ui?.thumb : vertical.value.thumb({ class: props.ui?.thumb }),
)
const cornerClass = computed(() =>
  isUnstyled.value ? props.ui?.corner : vertical.value.corner({ class: props.ui?.corner }),
)
</script>

<template>
  <ScrollAreaRoot
    :type="props.type"
    :scroll-hide-delay="props.scrollHideDelay"
    :class="rootClass"
  >
    <ScrollAreaViewport :class="viewportClass">
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="showVertical"
      orientation="vertical"
      :class="isUnstyled ? props.ui?.scrollbar : vertical.scrollbar({ class: props.ui?.scrollbar })"
    >
      <ScrollAreaThumb :class="thumbClass" />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="showHorizontal"
      orientation="horizontal"
      :class="isUnstyled ? props.ui?.scrollbar : horizontal.scrollbar({ class: props.ui?.scrollbar })"
    >
      <ScrollAreaThumb :class="thumbClass" />
    </ScrollAreaScrollbar>

    <!-- Only meaningful when both bars are present and would otherwise meet. -->
    <ScrollAreaCorner v-if="props.orientation === 'both'" :class="cornerClass" />
  </ScrollAreaRoot>
</template>
