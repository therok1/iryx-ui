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

const props = withDefaults(defineProps<SkeletonProps>(), {
  as: 'div',
  lines: 1,
  label: 'Loading',
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/**
 * Multiple lines share one status region, so a screen reader announces
 * "Loading" once rather than once per line.
 */
const count = computed(() => Math.max(1, props.lines))

/**
 * `class` belongs to whichever element is the component's root, as everywhere
 * else in the library. With one line that is the line itself; with several it
 * is the wrapper around them.
 *
 * Getting this wrong is not subtle in effect but is invisible in the markup:
 * `class="max-w-md"` used to land on every *line*, so each line was capped and
 * left-aligned inside a wrapper that stayed full width — the stack looked
 * ragged and could not be centred by its container.
 */
const lineClasses = computed(() =>
  isUnstyled.value ? undefined : skeletonTheme({ variant: props.variant }),
)

const rootClasses = computed(() => {
  if (isUnstyled.value)
    return props.class
  return count.value > 1
    ? props.class
    : skeletonTheme({ variant: props.variant, class: props.class })
})
</script>

<template>
  <div
    v-if="count > 1"
    role="status"
    :aria-label="props.label"
    :class="[isUnstyled ? undefined : 'flex w-full flex-col gap-2', rootClasses]"
  >
    <Primitive
      v-for="line in count"
      :key="line"
      :as="props.as"
      :class="lineClasses"
      aria-hidden="true"
    />
  </div>

  <Primitive v-else :as="props.as" role="status" :aria-label="props.label" :class="rootClasses" />
</template>
