<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { paginationTheme } from '../theme/pagination'

export interface PaginationProps {
  /** Total number of records, not pages. */
  total?: number
  itemsPerPage?: number
  /** How many pages to show either side of the current one. */
  siblingCount?: number
  /** Keep the first and last page visible however far away they are. */
  showEdges?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Accessible names — override for non-English apps. */
  prevLabel?: string
  nextLabel?: string
  label?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ item: 'rounded-full' }`. */
  ui?: {
    root?: string
    list?: string
    item?: string
    ellipsis?: string
  }
}

const props = withDefaults(defineProps<PaginationProps>(), {
  total: 0,
  itemsPerPage: 10,
  siblingCount: 1,
  showEdges: true,
  prevLabel: 'Previous page',
  nextLabel: 'Next page',
  label: 'Pagination',
  unstyled: undefined,
})

const page = defineModel<number>('page', { default: 1 })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => paginationTheme({ size: props.size }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const listClass = computed(() =>
  isUnstyled.value ? props.ui?.list : theme.value.list({ class: props.ui?.list }),
)
const ellipsisClass = computed(() =>
  isUnstyled.value ? props.ui?.ellipsis : theme.value.ellipsis({ class: props.ui?.ellipsis }),
)

/** The active page is filled; the rest are quiet until hovered. */
function itemClass(active: boolean) {
  if (isUnstyled.value)
    return props.ui?.item
  const base = theme.value.item({ class: props.ui?.item })
  return [base, active ? theme.value.active() : theme.value.inactive()]
}
</script>

<template>
  <PaginationRoot
    v-model:page="page"
    :total="props.total"
    :items-per-page="props.itemsPerPage"
    :sibling-count="props.siblingCount"
    :show-edges="props.showEdges"
    :aria-label="props.label"
    :class="rootClass"
  >
    <PaginationList v-slot="{ items }" :class="listClass">
      <PaginationPrev :aria-label="props.prevLabel" :class="itemClass(false)">
        <slot name="prev">
          <ChevronLeft />
        </slot>
      </PaginationPrev>

      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem
          v-if="item.type === 'page'"
          :value="item.value"
          :class="itemClass(item.value === page)"
        >
          {{ item.value }}
        </PaginationListItem>
        <PaginationEllipsis v-else :class="ellipsisClass">
          &#8230;
        </PaginationEllipsis>
      </template>

      <PaginationNext :aria-label="props.nextLabel" :class="itemClass(false)">
        <slot name="next">
          <ChevronRight />
        </slot>
      </PaginationNext>
    </PaginationList>
  </PaginationRoot>
</template>
