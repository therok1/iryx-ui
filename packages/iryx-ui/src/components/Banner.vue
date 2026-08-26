<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { bannerTheme } from '../theme/banner'
import Icon from './Icon.vue'

export interface BannerProps {
  /** Render as a different element or component. */
  as?: string
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'primary'
  /**
   * `static` sits in the flow, `top` sticks to the top of the scroll
   * container, `bottom` pins to the bottom of the viewport.
   */
  position?: 'static' | 'top' | 'bottom'
  /** Bold lead-in before the message. */
  title?: string
  /** Message text. Ignored when the default slot is used. */
  description?: string
  /** Leading icon. None by default — a banner is ambient, not a status report. */
  icon?: IconLike
  /** Constrain the text to a readable measure while the fill still spans full width. */
  contained?: boolean
  align?: 'start' | 'center'
  /** Render a dismiss button. */
  closable?: boolean
  /** Accessible name for the dismiss button — override for non-English apps. */
  closeLabel?: string
  /**
   * Accessible name for the landmark. A banner is a region rather than an
   * alert: it is ambient, so it must not interrupt a screen reader mid-task.
   */
  label?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ container: 'max-w-3xl' }`. */
  ui?: {
    root?: string
    container?: string
    icon?: string
    content?: string
    title?: string
    actions?: string
    close?: string
  }
}

const props = withDefaults(defineProps<BannerProps>(), {
  as: 'div',
  closeLabel: 'Dismiss',
  label: 'Announcement',
  // Absent booleans must stay undefined so app-level config can win.
  unstyled: undefined,
  contained: undefined,
})

defineEmits<{ close: [] }>()

/** Dismissal as a model, matching IAlert — bind it, or let the banner hide itself. */
const open = defineModel<boolean>('open', { default: true })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => bannerTheme({
  variant: props.variant,
  position: props.position,
  contained: props.contained ?? false,
  align: props.align,
}))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)

function cls(slot: 'container' | 'icon' | 'content' | 'title' | 'actions' | 'close') {
  const override = props.ui?.[slot]
  return isUnstyled.value ? override : theme.value[slot]({ class: override })
}
</script>

<template>
  <Primitive
    v-if="open"
    :as="props.as"
    role="region"
    :aria-label="props.label"
    :class="rootClass"
  >
    <div :class="cls('container')">
      <span v-if="props.icon || $slots.icon" :class="cls('icon')">
        <slot name="icon">
          <Icon :icon="props.icon" />
        </slot>
      </span>

      <p :class="cls('content')">
        <strong v-if="props.title || $slots.title" :class="cls('title')">
          <slot name="title">{{ props.title }}</slot>
        </strong>
        {{ ' ' }}
        <slot>{{ props.description }}</slot>
      </p>

      <span v-if="$slots.actions" :class="cls('actions')">
        <slot name="actions" />
      </span>

      <button
        v-if="props.closable"
        type="button"
        :aria-label="props.closeLabel"
        :class="cls('close')"
        @click="open = false; $emit('close')"
      >
        <slot name="close">
          <Icon :icon="Cancel01Icon" />
        </slot>
      </button>
    </div>
  </Primitive>
</template>
