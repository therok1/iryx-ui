<script setup lang="ts">
import type { AvatarProps } from './Avatar.vue'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { avatarGroupTheme } from '../theme/avatar'
import Avatar from './Avatar.vue'

/** One member of the stack — an `IAvatar`'s own props, minus the shared ones. */
export type AvatarGroupItem = Omit<AvatarProps, 'size' | 'shape' | 'unstyled' | 'class' | 'ui'>

export interface AvatarGroupProps {
  items?: AvatarGroupItem[]
  /**
   * Show at most this many, closing the stack with a "+n" chip. Without it
   * every avatar is rendered, which stops being readable somewhere past six.
   */
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ overflow: 'bg-primary' }`. */
  ui?: {
    root?: string
    item?: string
    overflow?: string
  }
}

/**
 * A row of avatars overlapped into a stack — who is on a thread, who is
 * assigned to an issue.
 */
const props = withDefaults(defineProps<AvatarGroupProps>(), {
  unstyled: undefined,
})

const all = computed(() => props.items ?? [])

/**
 * Reversed for painting order: the stack is laid out `flex-row-reverse`, so
 * the first person ends up on top without a z-index per child. The visible
 * order is still the order given.
 */
const shown = computed(() => {
  const limit = props.max
  const visible = limit !== undefined && all.value.length > limit ? all.value.slice(0, limit) : all.value
  return [...visible].reverse()
})

const hiddenCount = computed(() => {
  const limit = props.max
  if (limit === undefined || all.value.length <= limit)
    return 0
  return all.value.length - limit
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => avatarGroupTheme({ size: props.size }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const itemClass = computed(() =>
  isUnstyled.value ? props.ui?.item : theme.value.item({ class: props.ui?.item }),
)
const overflowClass = computed(() =>
  isUnstyled.value ? props.ui?.overflow : theme.value.overflow({ class: props.ui?.overflow }),
)
</script>

<template>
  <div :class="rootClass">
    <!--
      The chip comes first in the DOM because the row is reversed, which puts
      it visually last — at the end of the stack, where "and n more" belongs.
    -->
    <span v-if="hiddenCount" :class="overflowClass">
      <slot name="overflow" :count="hiddenCount">+{{ hiddenCount }}</slot>
    </span>

    <Avatar
      v-for="(item, index) in shown"
      :key="index"
      v-bind="item"
      :size="props.size"
      :shape="props.shape"
      :unstyled="isUnstyled"
      :class="itemClass"
    />
  </div>
</template>
