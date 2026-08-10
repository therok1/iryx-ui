<script setup lang="ts">
import type { IconArray } from '@hugeicons/vue'
import type { IconLike } from '../composables/icon'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed } from 'vue'
import { isIconArray } from '../composables/icon'

export interface IconProps {
  icon?: IconLike
  class?: string
}

const props = defineProps<IconProps>()

const asArray = computed(() => (props.icon && isIconArray(props.icon) ? props.icon as IconArray : undefined))
</script>

<template>
  <HugeiconsIcon
    v-if="asArray"
    :icon="asArray"
    :class="props.class"
    aria-hidden="true"
  />
  <component
    :is="props.icon"
    v-else-if="props.icon"
    :class="props.class"
    aria-hidden="true"
  />
</template>
