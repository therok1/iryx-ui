<script setup lang="ts">
import type { ButtonSize } from '../composables/button-group'
import { Primitive } from 'reka-ui'
import { computed, provide } from 'vue'
import { buttonGroupContextKey } from '../composables/button-group'
import { useIryxUiConfig } from '../config'
import { buttonGroupTheme } from '../theme/button-group'

export interface ButtonGroupProps {
  /** Render as a different element or component. */
  as?: string
  orientation?: 'horizontal' | 'vertical'
  /**
   * Size applied to every button inside, so it only has to be set once.
   * A button's own `size` still wins.
   */
  size?: ButtonSize
  /** Stretch to fill the container, splitting the width between children. */
  block?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
}

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  as: 'div',
  unstyled: undefined,
})

// Children read this to pick up the shared size.
provide(buttonGroupContextKey, { size: computed(() => props.size) })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const classes = computed(() => {
  if (isUnstyled.value)
    return props.class
  return buttonGroupTheme({
    orientation: props.orientation,
    block: props.block,
    class: props.class,
  })
})
</script>

<template>
  <Primitive :as="props.as" role="group" :class="classes">
    <slot />
  </Primitive>
</template>
