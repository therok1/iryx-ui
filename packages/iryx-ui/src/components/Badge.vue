<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { badgeTheme } from '../theme/badge'

export interface BadgeProps {
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto the immediate child instead of rendering an element. */
  asChild?: boolean
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  /** `soft` is a tinted background; `solid` is a filled block of colour. */
  tone?: 'soft' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  /** Show a small leading dot in the current text colour. */
  dot?: boolean
  /** Text content. Ignored when the default slot is used. */
  label?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ dot: 'size-3' }`. */
  ui?: {
    root?: string
    dot?: string
  }
}

const props = withDefaults(defineProps<BadgeProps>(), {
  as: 'span',
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  badgeTheme({ variant: props.variant, tone: props.tone, size: props.size }),
)

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const dotClass = computed(() =>
  isUnstyled.value ? props.ui?.dot : theme.value.dot({ class: props.ui?.dot }),
)
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" :class="rootClass">
    <span v-if="props.dot" :class="dotClass" aria-hidden="true" />
    <slot>{{ props.label }}</slot>
  </Primitive>
</template>
