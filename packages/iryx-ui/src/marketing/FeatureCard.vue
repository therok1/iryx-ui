<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { computed, useSlots } from 'vue'
import Card from '../components/Card.vue'
import Icon from '../components/Icon.vue'
import { useIryxUiConfig } from '../config'
import { featureCardTheme } from '../theme/feature-card'

export interface FeatureCardProps {
  /** A Hugeicons export, or any component that renders an SVG. */
  icon?: IconLike
  title?: string
  description?: string
  align?: 'start' | 'center'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ icon: 'bg-success/10' }`. */
  ui?: {
    root?: string
    icon?: string
    title?: string
    description?: string
  }
}

const props = withDefaults(defineProps<FeatureCardProps>(), {
  unstyled: undefined,
})

const slots = useSlots()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => featureCardTheme({ align: props.align }))

function slotClass(slot: keyof NonNullable<FeatureCardProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}
</script>

<template>
  <Card :unstyled="props.unstyled" :class="slotClass('root', props.class)">
    <div v-if="props.icon || slots.icon" :class="slotClass('icon')">
      <slot name="icon">
        <Icon :icon="props.icon" />
      </slot>
    </div>

    <h3 v-if="props.title || slots.title" :class="slotClass('title')">
      <slot name="title">
        {{ props.title }}
      </slot>
    </h3>

    <p v-if="props.description || slots.description" :class="slotClass('description')">
      <slot name="description">
        {{ props.description }}
      </slot>
    </p>

    <slot />
  </Card>
</template>
