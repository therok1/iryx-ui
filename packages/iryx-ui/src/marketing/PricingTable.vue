<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { PricingCardProps } from './PricingCard.vue'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import PricingCard from './PricingCard.vue'

export interface PricingPlan extends PricingCardProps {
  /** Identity for the list and for the `select` event. */
  id?: string | number
}

export interface PricingTableProps {
  /** Render as a different element or component. */
  as?: string
  plans?: PricingPlan[]
  /** Badge for the featured plan. A plan's own `badge` wins over it. */
  badge?: string
  /**
   * Columns from `lg` up. Defaults to one per plan, which is right until there
   * are more than four — past that, set it and let them wrap.
   */
  columns?: 1 | 2 | 3 | 4
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
}

const props = withDefaults(defineProps<PricingTableProps>(), {
  as: 'div',
  unstyled: undefined,
})

const emit = defineEmits<{ select: [plan: PricingPlan] }>()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/*
 * `items-start` matters: without it every card stretches to the tallest, and a
 * featured card's ring then wraps empty space under its own button.
 */
const columnClass = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const

const rootClass = computed(() => {
  const columns = props.columns ?? Math.min(props.plans?.length ?? 1, 4) as 1 | 2 | 3 | 4
  return isUnstyled.value
    ? props.class
    : ['grid items-start gap-4', columnClass[columns], props.class]
})
</script>

<template>
  <Primitive :as="props.as" :class="rootClass">
    <slot>
      <PricingCard
        v-for="(plan, index) in props.plans"
        :key="plan.id ?? plan.name ?? index"
        v-bind="plan"
        :badge="plan.badge ?? props.badge"
        :unstyled="props.unstyled"
        @select="emit('select', plan)"
      />
    </slot>
  </Primitive>
</template>
