<script setup lang="ts">
import { AspectRatio } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'

export interface AspectRatioProps {
  /**
   * Width divided by height — `16 / 9`, `1`, `4 / 3`. Given as a number so
   * arithmetic works: `16 / 9` reads as the ratio it is.
   */
  ratio?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
}

/**
 * Holds a box at a fixed ratio whatever its width. Useful before the content
 * arrives: an image or an embed that sizes itself shifts everything below it
 * when it finally loads, and a reserved box is what stops the page jumping.
 */
const props = withDefaults(defineProps<AspectRatioProps>(), {
  ratio: 1,
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/*
 * Only a clip and a radius: this component owns the geometry, and anything
 * more opinionated would have to be undone by every second use.
 */
const classes = computed(() =>
  isUnstyled.value ? props.class : ['overflow-hidden rounded-xl', props.class],
)
</script>

<template>
  <AspectRatio :ratio="props.ratio" :class="classes">
    <slot />
  </AspectRatio>
</template>
