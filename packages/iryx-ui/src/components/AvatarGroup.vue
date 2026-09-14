<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { AvatarProps } from './Avatar.vue'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { avatarGroupTheme } from '../theme/avatar'
import Avatar from './Avatar.vue'
import Tooltip from './Tooltip.vue'

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
  /**
   * Show each person's `name` in a tooltip, and lift the avatar under the
   * pointer or focus out of the stack.
   */
  tooltip?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ overflow: 'bg-primary' }`. */
  ui?: {
    root?: string
    trigger?: string
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

const theme = computed(() => avatarGroupTheme({ size: props.size, tooltip: props.tooltip }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const triggerClass = computed(() =>
  isUnstyled.value ? props.ui?.trigger : theme.value.trigger({ class: props.ui?.trigger }),
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
    <span v-if="hiddenCount" :class="overflowClass">
      <slot name="overflow" :count="hiddenCount">+{{ hiddenCount }}</slot>
    </span>

    <Tooltip
      v-for="(item, index) in shown"
      :key="index"
      :text="item.name"
      :disabled="!props.tooltip || !item.name"
      :side-offset="10"
      :unstyled="isUnstyled"
    >
      <template #trigger>
        <span :class="triggerClass" :tabindex="props.tooltip && item.name ? 0 : undefined">
          <Avatar
            v-bind="item"
            :size="props.size"
            :shape="props.shape"
            :unstyled="isUnstyled"
            :class="itemClass"
          />
        </span>
      </template>
    </Tooltip>
  </div>
</template>
