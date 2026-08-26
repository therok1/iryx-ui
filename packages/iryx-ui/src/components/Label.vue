<script setup lang="ts">
import type { LabelProps as RekaLabelProps } from 'reka-ui'
import type { ClassValue } from '../class-value'
import { Label } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { labelTheme } from '../theme/label'

export interface LabelProps extends RekaLabelProps {
  /** Append a red asterisk to mark the associated field as required. */
  required?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
}

const props = withDefaults(defineProps<LabelProps>(), {
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const classes = computed(() => {
  if (isUnstyled.value)
    return props.class
  return labelTheme({ required: props.required, class: props.class })
})
</script>

<template>
  <Label :for="props.for" :as="props.as" :as-child="props.asChild" :class="classes">
    <slot />
  </Label>
</template>
