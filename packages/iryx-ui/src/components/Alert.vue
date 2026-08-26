<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { Alert02Icon, AlertCircleIcon, Cancel01Icon, CheckmarkCircle02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { alertTheme } from '../theme/alert'
import Icon from './Icon.vue'

export interface AlertProps {
  /** Render as a different element or component. */
  as?: string
  variant?: 'info' | 'success' | 'warning' | 'danger'
  /** Heading text above the body. */
  title?: string
  /** Body text. Ignored when the default slot is used. */
  description?: string
  /**
   * Leading icon. Defaults to one matching the variant; pass a component to
   * override it, or `false` to drop it entirely.
   */
  icon?: IconLike | false
  /** Render a dismiss button that emits `close`. */
  closable?: boolean
  /** Accessible name for the dismiss button — override for non-English apps. */
  closeLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ title: 'text-base' }`. */
  ui?: {
    root?: string
    icon?: string
    content?: string
    title?: string
    description?: string
    actions?: string
    close?: string
  }
}

// `undefined` defaults are required: Vue casts absent boolean props to `false`.
// For `unstyled` that would shadow the global config; for `icon` the `| false`
// in its type makes Vue treat it as a Boolean prop, so an absent icon would
// read as `false` and silently suppress the default variant icon.
const props = withDefaults(defineProps<AlertProps>(), {
  as: 'div',
  closeLabel: 'Close',
  icon: undefined,
  unstyled: undefined,
})

defineEmits<{ close: [] }>()

/**
 * Dismissal as a model, so the common case is one binding rather than a
 * `close` handler plus a `v-if` in every consumer. `close` still fires, for
 * callers that want to confirm or persist before it goes.
 */
const open = defineModel<boolean>('open', { default: true })

const defaultIcons = {
  info: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  warning: Alert02Icon,
  danger: AlertCircleIcon,
} as const

const resolvedIcon = computed(() => {
  if (props.icon === false)
    return undefined
  return props.icon ?? defaultIcons[props.variant ?? 'info']
})

/**
 * Urgent variants interrupt the screen reader; informational ones are
 * announced politely so they don't cut across what the user is doing.
 */
const role = computed(() =>
  props.variant === 'danger' || props.variant === 'warning' ? 'alert' : 'status',
)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  alertTheme({ variant: props.variant, withTitle: Boolean(props.title) }),
)

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const iconClass = computed(() =>
  isUnstyled.value ? props.ui?.icon : theme.value.icon({ class: props.ui?.icon }),
)
const contentClass = computed(() =>
  isUnstyled.value ? props.ui?.content : theme.value.content({ class: props.ui?.content }),
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
const closeClass = computed(() =>
  isUnstyled.value ? props.ui?.close : theme.value.close({ class: props.ui?.close }),
)
</script>

<template>
  <Primitive v-if="open" :as="props.as" :role="role" :class="rootClass">
    <div v-if="resolvedIcon || $slots.icon" :class="iconClass">
      <slot name="icon">
        <Icon :icon="resolvedIcon" />
      </slot>
    </div>

    <div :class="contentClass">
      <p v-if="props.title || $slots.title" :class="titleClass">
        <slot name="title">
          {{ props.title }}
        </slot>
      </p>
      <div v-if="props.description || $slots.default" :class="descriptionClass">
        <slot>
          {{ props.description }}
        </slot>
      </div>
      <div v-if="$slots.actions" :class="actionsClass">
        <slot name="actions" />
      </div>
    </div>

    <button
      v-if="props.closable"
      type="button"
      :aria-label="props.closeLabel"
      :class="closeClass"
      @click="open = false; $emit('close')"
    >
      <slot name="close">
        <Icon :icon="Cancel01Icon" />
      </slot>
    </button>
  </Primitive>
</template>
