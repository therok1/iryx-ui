<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { pageHeaderTheme } from '../theme/page-header'

export interface PageHeaderProps {
  /** Render as a different element or component. */
  as?: string
  title?: string
  description?: string
  /**
   * Heading level for the title. A page header is usually the `h1`, but a
   * panel or a nested view may need to sit lower in the outline.
   */
  level?: 1 | 2 | 3
  /** Draw a rule underneath, for pages that run straight into content. */
  bordered?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ title: 'text-3xl' }`. */
  ui?: {
    root?: string
    top?: string
    row?: string
    heading?: string
    title?: string
    description?: string
    actions?: string
  }
}

const props = withDefaults(defineProps<PageHeaderProps>(), {
  as: 'header',
  level: 1,
  bordered: undefined,
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const headingTag = computed(() => `h${props.level}` as const)

const theme = computed(() => pageHeaderTheme({ bordered: props.bordered }))

type Slot = keyof NonNullable<PageHeaderProps['ui']>

function slotClass(slot: Slot) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? override : theme.value[slot]({ class: override })
}
</script>

<template>
  <Primitive
    :as="props.as"
    :class="isUnstyled ? [props.ui?.root, props.class] : theme.root({ class: [props.ui?.root, props.class] })"
  >
    <div v-if="$slots.breadcrumb" :class="slotClass('top')">
      <slot name="breadcrumb" />
    </div>

    <div :class="slotClass('row')">
      <div :class="slotClass('heading')">
        <component :is="headingTag" v-if="props.title || $slots.title" :class="slotClass('title')">
          <slot name="title">
            {{ props.title }}
          </slot>
        </component>
        <p v-if="props.description || $slots.description" :class="slotClass('description')">
          <slot name="description">
            {{ props.description }}
          </slot>
        </p>
      </div>

      <div v-if="$slots.actions" :class="slotClass('actions')">
        <slot name="actions" />
      </div>
    </div>

    <slot />
  </Primitive>
</template>
