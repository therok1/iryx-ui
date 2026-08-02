<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useIryxUiConfig } from '../config'
import { cardTheme } from '../theme/card'

export interface CardProps {
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto the immediate child instead of rendering an element. */
  asChild?: boolean
  variant?: 'outline' | 'soft'
  /** Inner spacing. `none` leaves padding entirely to you. */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Heading text. Rendered in the header alongside `description`. */
  title?: string
  /** Secondary text under the title. */
  description?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ footer: 'justify-end' }`. */
  ui?: {
    root?: string
    header?: string
    title?: string
    description?: string
    body?: string
    footer?: string
  }
}

// `unstyled: undefined` is required: Vue casts absent boolean props to
// `false`, which would shadow the global config.
const props = withDefaults(defineProps<CardProps>(), {
  as: 'div',
  unstyled: undefined,
})

const slots = useSlots()

/** The header block is skipped entirely when there is nothing to put in it. */
const hasHeader = computed(() =>
  Boolean(props.title || props.description || slots.header || slots.title || slots.description),
)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => cardTheme({ variant: props.variant, padding: props.padding }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const headerClass = computed(() =>
  isUnstyled.value ? props.ui?.header : theme.value.header({ class: props.ui?.header }),
)
const titleClass = computed(() =>
  isUnstyled.value ? props.ui?.title : theme.value.title({ class: props.ui?.title }),
)
const descriptionClass = computed(() =>
  isUnstyled.value ? props.ui?.description : theme.value.description({ class: props.ui?.description }),
)
const bodyClass = computed(() =>
  isUnstyled.value ? props.ui?.body : theme.value.body({ class: props.ui?.body }),
)
const footerClass = computed(() =>
  isUnstyled.value ? props.ui?.footer : theme.value.footer({ class: props.ui?.footer }),
)
</script>

<template>
  <Primitive :as="props.as" :as-child="props.asChild" :class="rootClass">
    <div v-if="hasHeader" :class="headerClass">
      <slot name="header">
        <h3 v-if="props.title || $slots.title" :class="titleClass">
          <slot name="title">
            {{ props.title }}
          </slot>
        </h3>
        <p v-if="props.description || $slots.description" :class="descriptionClass">
          <slot name="description">
            {{ props.description }}
          </slot>
        </p>
      </slot>
    </div>

    <div :class="bodyClass">
      <slot />
    </div>

    <div v-if="$slots.footer" :class="footerClass">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
