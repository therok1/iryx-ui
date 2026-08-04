<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { skeletonTheme } from '../theme/skeleton'

export interface SkeletonProps {
  /** Render as a different element or component. */
  as?: string
  variant?: 'text' | 'rect' | 'circle'
  /** Repeat as stacked lines. Useful for paragraphs of placeholder copy. */
  lines?: number
  /** Accessible description of what is loading. */
  label?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
}

// `unstyled: undefined` is required: Vue casts absent boolean props to
// `false`, which would shadow the global config.
const props = withDefaults(defineProps<SkeletonProps>(), {
  as: 'div',
  lines: 1,
  label: 'Loading',
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const classes = computed(() => {
  if (isUnstyled.value)
    return props.class
  return skeletonTheme({ variant: props.variant, class: props.class })
})

/**
 * Multiple lines share one status region, so a screen reader announces
 * "Loading" once rather than once per line.
 */
const count = computed(() => Math.max(1, props.lines))
</script>

<template>
  <div v-if="count > 1" role="status" :aria-label="props.label" class="flex w-full flex-col gap-2">
    <Primitive
      v-for="line in count"
      :key="line"
      :as="props.as"
      :class="classes"
      aria-hidden="true"
    />
  </div>

  <Primitive v-else :as="props.as" role="status" :aria-label="props.label" :class="classes" />
</template>
