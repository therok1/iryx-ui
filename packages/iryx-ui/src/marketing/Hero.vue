<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Primitive } from 'reka-ui'
import { computed, useSlots } from 'vue'
import Container from '../components/Container.vue'
import { useIryxUiConfig } from '../config'
import { heroTheme } from '../theme/hero'

export interface HeroProps {
  /** Render as a different element or component. */
  as?: string
  heading?: string
  description?: string
  /** Line under the calls to action, e.g. pricing small print. */
  note?: string
  /**
   * The moving wash behind the content. `aurora` turns, `bloom` drifts; both
   * stop under `prefers-reduced-motion`.
   */
  backdrop?: 'none' | 'aurora' | 'bloom'
  /** Faint ruled grid over the backdrop. */
  grid?: boolean
  align?: 'start' | 'center'
  /** Vertical rhythm. `none` leaves it to you. */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Maximum content width, passed to the container. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ heading: 'text-7xl' }`. */
  ui?: {
    root?: string
    container?: string
    badge?: string
    heading?: string
    description?: string
    actions?: string
    note?: string
    media?: string
  }
}

const props = withDefaults(defineProps<HeroProps>(), {
  as: 'section',
  backdrop: 'aurora',
  unstyled: undefined,
})

const slots = useSlots()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => heroTheme({ align: props.align, padding: props.padding }))

function slotClass(slot: keyof NonNullable<HeroProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}

const rootClass = computed(() => slotClass('root', props.class))
</script>

<template>
  <Primitive :as="props.as" :class="rootClass">
    <div v-if="props.backdrop !== 'none' && !isUnstyled" :class="`iryx-hero-${props.backdrop}`" aria-hidden="true" />
    <div v-if="props.grid && !isUnstyled" class="iryx-hero-grid" aria-hidden="true" />

    <Container :size="props.size" :class="slotClass('container')">
      <div v-if="slots.badge" :class="slotClass('badge')">
        <slot name="badge" />
      </div>

      <h1 v-if="props.heading || slots.heading" :class="slotClass('heading')">
        <slot name="heading">
          {{ props.heading }}
        </slot>
      </h1>

      <p v-if="props.description || slots.description" :class="slotClass('description')">
        <slot name="description">
          {{ props.description }}
        </slot>
      </p>

      <div v-if="slots.actions" :class="slotClass('actions')">
        <slot name="actions" />
      </div>

      <p v-if="props.note || slots.note" :class="slotClass('note')">
        <slot name="note">
          {{ props.note }}
        </slot>
      </p>

      <div v-if="slots.media" :class="slotClass('media')">
        <slot name="media" />
      </div>

      <slot />
    </Container>
  </Primitive>
</template>
