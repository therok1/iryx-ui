<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { descriptionListTheme } from '../theme/description-list'

export interface DescriptionListItem {
  term: string
  description?: string | number
  /** Passed to the slots, so a row can be rendered by name rather than by index. */
  key?: string
}

export interface DescriptionListProps {
  items?: DescriptionListItem[]
  /** `horizontal` puts the term and the description side by side on one row. */
  orientation?: 'vertical' | 'horizontal'
  /** Separate the rows with a rule instead of whitespace. */
  divided?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ term: 'text-foreground' }`. */
  ui?: {
    root?: string
    item?: string
    term?: string
    description?: string
  }
}

const props = withDefaults(defineProps<DescriptionListProps>(), {
  items: () => [],
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  descriptionListTheme({ orientation: props.orientation, divided: props.divided }),
)

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const itemClass = computed(() =>
  isUnstyled.value ? props.ui?.item : theme.value.item({ class: props.ui?.item }),
)
const termClass = computed(() =>
  isUnstyled.value ? props.ui?.term : theme.value.term({ class: props.ui?.term }),
)
const descriptionClass = computed(() =>
  isUnstyled.value
    ? props.ui?.description
    : theme.value.description({ class: props.ui?.description }),
)
</script>

<template>
  <Primitive as="dl" :class="rootClass">
    <div v-for="(item, index) in props.items" :key="item.key ?? item.term" :class="itemClass">
      <dt :class="termClass">
        <slot name="term" :item="item" :index="index">
          {{ item.term }}
        </slot>
      </dt>
      <dd :class="descriptionClass">
        <slot name="description" :item="item" :index="index">
          {{ item.description }}
        </slot>
      </dd>
    </div>
    <slot />
  </Primitive>
</template>
