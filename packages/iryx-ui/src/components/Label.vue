<script setup lang="ts">
import type { LabelProps as RekaLabelProps } from 'reka-ui'
import { Label } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { labelTheme } from '../theme/label'

export interface LabelProps extends RekaLabelProps {
  /** Append a red asterisk to mark the associated field as required. */
  required?: boolean
  /**
   * Indent the label to line up with the control's text rather than its outer
   * edge. Match it to the control's size; use `none` when the label wraps its
   * control, as with a checkbox.
   */
  indent?: 'none' | 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
}

const props = withDefaults(defineProps<LabelProps>(), {
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const classes = computed(() => {
  if (isUnstyled.value)
    return props.class
  return labelTheme({ required: props.required, indent: props.indent, class: props.class })
})
</script>

<template>
  <Label :for="props.for" :as="props.as" :as-child="props.asChild" :class="classes">
    <slot />
  </Label>
</template>
