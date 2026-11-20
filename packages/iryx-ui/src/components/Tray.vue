<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import type { TraySlots } from '../theme/tray'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { trayTheme } from '../theme/tray'
import Icon from './Icon.vue'

export interface TrayProps {
  /** Header text. */
  label?: string
  /** Icon before the label. */
  icon?: IconLike
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  ui?: { root?: string, header?: string, icon?: string, actions?: string, body?: string }
}

const props = withDefaults(defineProps<TrayProps>(), { unstyled: undefined })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)
const theme = trayTheme()

function cls(slot: TraySlots, extra?: ClassValue) {
  const custom = [props.ui?.[slot], extra]
  return isUnstyled.value ? custom : theme[slot]({ class: custom })
}
</script>

<template>
  <section :class="cls('root', props.class)">
    <header v-if="props.label || props.icon || $slots.header || $slots.actions" :class="cls('header')">
      <slot name="header">
        <Icon v-if="props.icon" :icon="props.icon" :class="cls('icon')" />
        {{ props.label }}
      </slot>
      <div v-if="$slots.actions" :class="cls('actions')">
        <slot name="actions" />
      </div>
    </header>
    <div :class="cls('body')">
      <slot />
    </div>
  </section>
</template>
