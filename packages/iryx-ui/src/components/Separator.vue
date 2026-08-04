<script setup lang="ts">
import { Separator } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useIryxUiConfig } from '../config'
import { separatorTheme } from '../theme/separator'

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  /** Text shown in the middle of the rule. */
  label?: string
  /**
   * Purely visual, so it is hidden from assistive tech. Set false when the
   * rule genuinely divides sections of content.
   */
  decorative?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ line: 'bg-primary' }`. */
  ui?: {
    root?: string
    line?: string
    label?: string
  }
}

// `unstyled: undefined` is required: Vue casts absent boolean props to
// `false`, which would shadow the global config.
const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
  decorative: true,
  unstyled: undefined,
})

const slots = useSlots()
/** A labelled rule renders two lines around the text, so it stays readable. */
const hasLabel = computed(() => Boolean(props.label || slots.default))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => separatorTheme({ orientation: props.orientation }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const lineClass = computed(() =>
  isUnstyled.value ? props.ui?.line : theme.value.line({ class: props.ui?.line }),
)
const labelClass = computed(() =>
  isUnstyled.value ? props.ui?.label : theme.value.label({ class: props.ui?.label }),
)
</script>

<template>
  <div v-if="hasLabel" :class="rootClass">
    <Separator :orientation="props.orientation" :decorative="props.decorative" :class="lineClass" />
    <span :class="labelClass">
      <slot>{{ props.label }}</slot>
    </span>
    <Separator :orientation="props.orientation" decorative :class="lineClass" />
  </div>

  <Separator
    v-else
    :orientation="props.orientation"
    :decorative="props.decorative"
    :class="isUnstyled ? [props.ui?.line, props.class] : theme.line({ class: [props.ui?.line, props.class] })"
  />
</template>
