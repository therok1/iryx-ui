<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { TreeItem, TreeRoot } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { treeTheme } from '../theme/tree'
import Icon from './Icon.vue'

export interface TreeItemOption {
  label: string
  /** Identifies the node. Defaults to the label. */
  value?: string
  icon?: IconLike
  disabled?: boolean
  /**
   * Number shown against the row's trailing edge — how many files are in a
   * folder, how many results are under a category.
   */
  count?: number
  /** Nested nodes. A node with children can be expanded. */
  children?: TreeItemOption[]
}

export interface TreeProps {
  items?: TreeItemOption[]
  /** Selected node values. Always an array, whether or not `multiple` is set. */
  modelValue?: string[]
  /** Which nodes start open, by value. Two-way via `v-model:expanded`. */
  expanded?: string[]
  multiple?: boolean
  /** Selecting a parent selects everything under it. Needs `multiple`. */
  propagateSelect?: boolean
  size?: 'sm' | 'md'
  /** Indent added per level of depth, in pixels. */
  indent?: number
  disabled?: boolean
  /** Names the tree, e.g. "Project files". */
  ariaLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ item: 'py-2' }`. */
  ui?: {
    root?: string
    item?: string
    expander?: string
    spacer?: string
    icon?: string
    label?: string
    count?: string
  }
}

/**
 * A nested list that can be expanded and collapsed — a file browser, a
 * category hierarchy, an org chart.
 *
 * Reka flattens the tree for us and hands back each node with its depth, so
 * this renders one flat list of rows rather than recursing. That is what
 * keeps keyboard navigation working across the whole tree: arrow keys move
 * between rows regardless of how deeply nested they are.
 */
const props = withDefaults(defineProps<TreeProps>(), {
  indent: 16,
  unstyled: undefined,
})

const emits = defineEmits<{
  'update:modelValue': [value: string[]]
  'update:expanded': [value: string[]]
}>()

const entries = computed(() => props.items ?? [])

/** Same fallback the rest of the library uses: the label identifies it. */
const keyOf = (item: TreeItemOption) => item.value ?? item.label

const hasChildren = (item: TreeItemOption) => Boolean(item.children?.length)

/**
 * Padding on the row's leading edge before any indent is added, so a
 * top-level chevron does not sit flush against the tree's border.
 *
 * It has to be part of this calculation rather than a class: the inline
 * style below sets `padding-left` outright and would overwrite a `pl-2`.
 */
const BASE_INSET = 8

/** Reka's `flattenItems` reports a 1-based level, so the top level is zero indent. */
const insetFor = (level: number) => `${BASE_INSET + (level - 1) * props.indent}px`

/**
 * Reka's selection is held as the item *objects*, not their keys. The rest of
 * this library models a selection as an array of values, so the two are
 * translated at this boundary — flatten once to look nodes up by key.
 */
const byKey = computed(() => {
  const map = new Map<string, TreeItemOption>()
  const walk = (nodes: TreeItemOption[]) => {
    for (const node of nodes) {
      map.set(keyOf(node), node)
      if (node.children?.length)
        walk(node.children)
    }
  }
  walk(entries.value)
  return map
})

const selectedItems = computed(() =>
  (props.modelValue ?? []).map(value => byKey.value.get(value)).filter(Boolean) as TreeItemOption[],
)

/** Reka hands back one item when single-select, an array when multiple. */
function toValues(payload: unknown): string[] {
  const list = Array.isArray(payload) ? payload : [payload]
  return list.filter(Boolean).map(item => keyOf(item as TreeItemOption))
}

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => treeTheme({ size: props.size }))

/** Joined rather than left as an array: `Icon` takes a plain `class` string. */
function slotClass(name: keyof NonNullable<TreeProps['ui']>, extra?: ClassValue) {
  const override = [props.ui?.[name], extra].filter(Boolean).join(' ')
  return isUnstyled.value ? override : theme.value[name]({ class: override })
}
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    :items="entries"
    :model-value="props.multiple ? selectedItems : selectedItems[0]"
    :expanded="props.expanded"
    :get-key="keyOf"
    :get-children="item => item.children"
    :multiple="props.multiple"
    :propagate-select="props.propagateSelect"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel"
    :class="slotClass('root', props.class)"
    @update:model-value="value => emits('update:modelValue', toValues(value))"
    @update:expanded="value => emits('update:expanded', value)"
  >
    <TreeItem
      v-for="item in flattenItems"
      v-slot="{ isExpanded }"
      :key="item._id"
      v-bind="item.bind"
      :disabled="item.value.disabled"
      :class="slotClass('item')"
      :style="{ paddingLeft: insetFor(item.level) }"
    >
      <slot name="item" :item="item.value" :level="item.level" :expanded="isExpanded">
        <!--
          A chevron on a branch, an equally sized blank on a leaf. Without the
          blank, a leaf's label would sit where its siblings' chevrons are and
          the column of labels would zig-zag.
        -->
        <Icon
          v-if="hasChildren(item.value)"
          :icon="ArrowRight01Icon"
          :data-expanded="isExpanded ? '' : undefined"
          :class="slotClass('expander')"
        />
        <span v-else :class="slotClass('spacer')" />

        <Icon v-if="item.value.icon" :icon="item.value.icon" :class="slotClass('icon')" />
        <span :class="slotClass('label')">{{ item.value.label }}</span>
        <span v-if="item.value.count !== undefined" :class="slotClass('count')">
          {{ item.value.count }}
        </span>
      </slot>
    </TreeItem>
  </TreeRoot>
</template>
