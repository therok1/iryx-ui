<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { containerTheme } from '../theme/container'

export interface ContainerProps {
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto the immediate child instead of rendering an element. */
  asChild?: boolean
  /** Maximum content width. `full` removes the cap but keeps the gutter. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Horizontal gutter. `none` leaves it to you. */
  gutter?: 'none' | 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ root: 'py-10' }`. */
  ui?: {
    root?: string
  }
}

const props = withDefaults(defineProps<ContainerProps>(), {
  as: 'div',
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => containerTheme({ size: props.size, gutter: props.gutter }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" :class="rootClass">
    <slot />
  </Primitive>
</template>
