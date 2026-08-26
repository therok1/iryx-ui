<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { emptyStateTheme } from '../theme/empty-state'
import Icon from './Icon.vue'

export interface EmptyStateProps {
  /** Render as a different element or component. */
  as?: string
  /** Illustrative icon shown above the title. Omitted when not given. */
  icon?: IconLike | false
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ title: 'text-xl' }`. */
  ui?: {
    root?: string
    icon?: string
    title?: string
    description?: string
    actions?: string
  }
}

// `undefined` defaults are required: Vue casts absent boolean props to `false`.
// For `unstyled` that would shadow the global config; `icon` has `| false` in
// its type, which makes Vue treat it as a Boolean prop and do the same.
const props = withDefaults(defineProps<EmptyStateProps>(), {
  as: 'div',
  icon: undefined,
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const resolvedIcon = computed(() => (props.icon === false ? undefined : props.icon))

const theme = computed(() => emptyStateTheme({ size: props.size }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const iconClass = computed(() =>
  isUnstyled.value ? props.ui?.icon : theme.value.icon({ class: props.ui?.icon }),
)
const titleClass = computed(() =>
  isUnstyled.value ? props.ui?.title : theme.value.title({ class: props.ui?.title }),
)
const descriptionClass = computed(() =>
  isUnstyled.value ? props.ui?.description : theme.value.description({ class: props.ui?.description }),
)
const actionsClass = computed(() =>
  isUnstyled.value ? props.ui?.actions : theme.value.actions({ class: props.ui?.actions }),
)
</script>

<template>
  <Primitive :as="props.as" :class="rootClass">
    <div v-if="resolvedIcon || $slots.icon" :class="iconClass">
      <slot name="icon">
        <Icon :icon="resolvedIcon" />
      </slot>
    </div>

    <p v-if="props.title || $slots.title" :class="titleClass">
      <slot name="title">
        {{ props.title }}
      </slot>
    </p>

    <p v-if="props.description || $slots.description" :class="descriptionClass">
      <slot name="description">
        {{ props.description }}
      </slot>
    </p>

    <slot />

    <div v-if="$slots.actions" :class="actionsClass">
      <slot name="actions" />
    </div>
  </Primitive>
</template>
