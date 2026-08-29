<script setup lang="ts">
import type { IconArray } from '@hugeicons/vue'
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed } from 'vue'
import { isIconArray } from '../composables/icon'

export interface IconProps {
  icon?: IconLike
  /**
   * Names the icon for assistive technology. Icons are decorative by default
   * and hidden; set this only when the icon is the sole carrier of meaning,
   * such as inside a control with no visible text.
   */
  label?: string
  class?: ClassValue
}

const props = defineProps<IconProps>()

const asArray = computed(() => (props.icon && isIconArray(props.icon) ? props.icon as IconArray : undefined))

const a11y = computed(() => (props.label
  ? { 'role': 'img', 'aria-label': props.label }
  : { 'aria-hidden': 'true' }))
</script>

<template>
  <HugeiconsIcon
    v-if="asArray"
    :icon="asArray"
    :class="props.class"
    v-bind="a11y"
  />
  <component
    :is="props.icon"
    v-else-if="props.icon"
    :class="props.class"
    v-bind="a11y"
  />
</template>
