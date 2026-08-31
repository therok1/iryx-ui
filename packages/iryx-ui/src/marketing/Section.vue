<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Primitive } from 'reka-ui'
import { computed, useSlots } from 'vue'
import Container from '../components/Container.vue'
import { useIryxUiConfig } from '../config'
import { sectionTheme } from '../theme/section'

export interface SectionProps {
  /** Render as a different element or component. */
  as?: string
  /** Small line above the heading, e.g. `Pricing`. */
  eyebrow?: string
  heading?: string
  description?: string
  /** `muted` tints the band, to separate it from the sections either side. */
  tone?: 'default' | 'muted'
  /** Rule along the top edge. */
  bordered?: boolean
  align?: 'start' | 'center'
  /** Vertical rhythm. `none` leaves it to you. */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Maximum content width, passed to the container. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ heading: 'text-5xl' }`. */
  ui?: {
    root?: string
    container?: string
    header?: string
    eyebrow?: string
    heading?: string
    description?: string
    body?: string
  }
}

const props = withDefaults(defineProps<SectionProps>(), {
  as: 'section',
  unstyled: undefined,
})

const slots = useSlots()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const hasHeader = computed(() =>
  Boolean(props.eyebrow ?? props.heading ?? props.description)
  || Boolean(slots.eyebrow ?? slots.heading ?? slots.description),
)

const theme = computed(() => sectionTheme({
  tone: props.tone,
  bordered: props.bordered,
  align: props.align,
  padding: props.padding,
  hasHeader: hasHeader.value,
}))

function slotClass(slot: keyof NonNullable<SectionProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}

const rootClass = computed(() => slotClass('root', props.class))
</script>

<template>
  <Primitive :as="props.as" :class="rootClass">
    <Container :size="props.size" :class="props.ui?.container">
      <div v-if="hasHeader" :class="slotClass('header')">
        <p v-if="props.eyebrow || slots.eyebrow" :class="slotClass('eyebrow')">
          <slot name="eyebrow">
            {{ props.eyebrow }}
          </slot>
        </p>

        <h2 v-if="props.heading || slots.heading" :class="slotClass('heading')">
          <slot name="heading">
            {{ props.heading }}
          </slot>
        </h2>

        <p v-if="props.description || slots.description" :class="slotClass('description')">
          <slot name="description">
            {{ props.description }}
          </slot>
        </p>
      </div>

      <div v-if="slots.default" :class="slotClass('body')">
        <slot />
      </div>
    </Container>
  </Primitive>
</template>
