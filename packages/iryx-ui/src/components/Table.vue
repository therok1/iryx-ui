<script setup lang="ts" generic="T = any">
import type { ClassValue } from '../class-value'
import type { TableColumn, TableSort } from '../composables/data-table'
import { ArrowDown01Icon, ArrowRight01Icon, ArrowUp01Icon, UnfoldMoreIcon } from '@hugeicons/core-free-icons'
import { computed, useSlots } from 'vue'
import { useDataTable } from '../composables/data-table'
import { useIryxUiConfig } from '../config'
import { tableTheme } from '../theme/table'
import Checkbox from './Checkbox.vue'
import Icon from './Icon.vue'
import Skeleton from './Skeleton.vue'

export interface TableProps<Row = any> {
  /** The rows to render. In server mode this is already the page the server returned. */
  rows?: Row[]
  columns?: TableColumn<Row>[]
  /**
   * Total rows on the server. Providing it switches to server mode: the table
   * stops sorting and slicing locally and only emits state, because the rows
   * it was given are already the requested page.
   */
  total?: number
  /** Field identifying a row, used for selection and expansion. */
  rowKey?: string
  loading?: boolean
  /** Rows of skeletons while `loading` and there is nothing to show yet. */
  skeletonRows?: number
  selectable?: boolean
  /** Veto selection per row — the checkbox is hidden and the header skips it. */
  isRowSelectable?: (row: Row) => boolean
  expandable?: boolean
  /** Veto expansion per row; the chevron is hidden. */
  canExpandRow?: (row: Row) => boolean
  /** Emit `rowClick` and show a pointer cursor. */
  clickableRows?: boolean
  striped?: boolean
  hoverable?: boolean
  stickyHeader?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Text when there are no rows. Overridden by the `empty` slot. */
  emptyText?: string
  /** Accessible name for the actions column, whose header is blank. */
  actionsLabel?: string
  /** Accessible name for the table, since a visible caption is optional. */
  label?: string
  caption?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ td: 'py-1' }`. */
  ui?: {
    root?: string
    table?: string
    thead?: string
    tbody?: string
    tr?: string
    th?: string
    td?: string
    empty?: string
    caption?: string
  }
}

const props = withDefaults(defineProps<TableProps<T>>(), {
  rows: () => [],
  columns: () => [],
  rowKey: 'id',
  skeletonRows: 5,
  actionsLabel: 'Actions',
  emptyText: 'No results.',
  // Absent booleans must stay undefined so app-level config can win.
  unstyled: undefined,
  hoverable: undefined,
  total: undefined,
})

const emit = defineEmits<{
  rowClick: [row: T]
}>()

/*
 * Given a default, `defineModel` follows the prop when bound and keeps its own
 * value when not, emitting `update:*` either way. That is what makes the table
 * controlled or uncontrolled per model without a second code path — so state
 * can live in the URL, a store, or nowhere at all.
 */
const sort = defineModel<TableSort | null>('sort', { default: null })
const page = defineModel<number>('page', { default: 1 })
const perPage = defineModel<number>('perPage', { default: 10 })
const selection = defineModel<(string | number)[]>('selection', { default: () => [] })
const expanded = defineModel<(string | number)[]>('expanded', { default: () => [] })

const table = useDataTable<T>({
  rows: () => props.rows,
  columns: () => props.columns,
  total: () => props.total,
  rowKey: () => props.rowKey,
  isRowSelectable: props.isRowSelectable,
  sort,
  page,
  perPage,
  selection,
  expanded,
})

const slots = useSlots()
const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => tableTheme({
  size: props.size,
  striped: props.striped,
  hoverable: props.hoverable ?? true,
  stickyHeader: props.stickyHeader,
  clickable: props.clickableRows,
  /*
   * The two loading states are alternatives, never both at once. Skeletons
   * stand in for rows that do not exist yet, so they belong to the first load;
   * every load after that already has rows on screen, and replacing them would
   * throw away what the reader is looking at. The bar under the header says
   * "refreshing" without taking the content away.
   */
  loading: Boolean(props.loading) && table.pageRows.value.length > 0,
}))

function cls(slot: keyof NonNullable<TableProps['ui']>, extra?: ClassValue) {
  const override = props.ui?.[slot]
  return isUnstyled.value
    ? [override, extra]
    : (theme.value[slot] as (o?: any) => string)({ class: [override, extra] })
}

function slotCls(slot: 'sortButton' | 'sortIcon' | 'gutter' | 'headGutter' | 'expandButton' | 'expandedRow' | 'expandedCell' | 'actions' | 'headActions') {
  return isUnstyled.value ? undefined : theme.value[slot]()
}

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)

/**
 * Alignment lives on the column, so cells and their header stay in step.
 * A numeric column defaults to end alignment, which is where a reader's eye
 * compares magnitudes.
 */
function alignClass(column: TableColumn<T>) {
  if (isUnstyled.value)
    return undefined
  const align = column.align ?? (column.numeric ? 'end' : 'start')
  if (align === 'start')
    return undefined
  return align === 'end' ? 'text-end' : 'text-center'
}

/** Tabular figures on the cells only — the header is a label, not a number. */
function numericClass(column: TableColumn<T>) {
  return !isUnstyled.value && column.numeric ? 'tabular-nums' : undefined
}

function cellClass(row: T, column: TableColumn<T>) {
  return typeof column.class === 'function' ? column.class(row) : column.class
}

function isCellHidden(row: T, column: TableColumn<T>) {
  return typeof column.hidden === 'function' ? column.hidden(row) : false
}

/** Gutters plus every visible column — the span for the empty and expanded rows. */
const columnCount = computed(() =>
  table.visibleColumns.value.length
  + (props.selectable ? 1 : 0)
  + (props.expandable ? 1 : 0)
  + (slots['row-actions'] ? 1 : 0),
)

const showSkeletons = computed(() => props.loading && table.pageRows.value.length === 0)
const showEmpty = computed(() => !props.loading && table.pageRows.value.length === 0)

function ariaSort(column: TableColumn<T>) {
  if (!column.sortable)
    return undefined
  const order = table.sortOrderFor(column)
  return order === 'asc' ? 'ascending' : order === 'desc' ? 'descending' : 'none'
}

function onRowClick(row: T) {
  if (props.clickableRows)
    emit('rowClick', row)
}

defineExpose({ table })
</script>

<template>
  <div :class="rootClass">
    <table
      :class="cls('table')"
      :aria-label="props.label"
      :aria-busy="props.loading || undefined"
    >
      <caption v-if="props.caption || $slots.caption" :class="cls('caption')">
        <slot name="caption">
          {{ props.caption }}
        </slot>
      </caption>

      <thead :class="cls('thead')">
        <tr>
          <th v-if="props.expandable" :class="slotCls('headGutter')" />
          <th v-if="props.selectable" :class="slotCls('headGutter')">
            <Checkbox
              :model-value="table.headerSelection.value"
              aria-label="Select all rows on this page"
              @update:model-value="table.toggleAll"
            />
          </th>
          <th
            v-for="column in table.visibleColumns.value"
            :key="column.key"
            :class="cls('th', alignClass(column))"
            :style="column.width ? { width: column.width } : undefined"
            :aria-sort="ariaSort(column)"
            scope="col"
          >
            <slot :name="`header-${column.key}`" :column="column">
              <button
                v-if="column.sortable"
                type="button"
                :class="slotCls('sortButton')"
                @click="table.toggleSort(column)"
              >
                {{ column.label ?? column.key }}
                <Icon
                  :icon="table.sortOrderFor(column) === 'asc'
                    ? ArrowUp01Icon
                    : table.sortOrderFor(column) === 'desc' ? ArrowDown01Icon : UnfoldMoreIcon"
                  :class="slotCls('sortIcon')"
                />
              </button>
              <template v-else>
                {{ column.label ?? column.key }}
              </template>
            </slot>
          </th>

          <th v-if="$slots['row-actions']" :class="slotCls('headActions')">
            <span class="sr-only">{{ props.actionsLabel }}</span>
          </th>
        </tr>
      </thead>

      <tbody :class="cls('tbody')">
        <template v-if="showSkeletons">
          <tr v-for="row in props.skeletonRows" :key="`skeleton-${row}`" :class="cls('tr')">
            <td v-if="props.expandable" :class="slotCls('gutter')">
              <Skeleton class="size-4" />
            </td>
            <td v-if="props.selectable" :class="slotCls('gutter')">
              <Skeleton class="size-4" />
            </td>
            <td v-for="column in table.visibleColumns.value" :key="column.key" :class="cls('td')">
              <Skeleton class="h-4 w-24" />
            </td>
            <td v-if="$slots['row-actions']" :class="slotCls('actions')">
              <Skeleton class="size-4" />
            </td>
          </tr>
        </template>

        <tr v-else-if="showEmpty">
          <td :colspan="columnCount" :class="cls('empty')">
            <slot name="empty">
              {{ props.emptyText }}
            </slot>
          </td>
        </tr>

        <template v-for="row in table.pageRows.value" v-else :key="table.keyOf(row)">
          <tr
            :class="[
              cls('tr'),
              !isUnstyled && table.isSelected(row) ? 'bg-primary/5' : undefined,
            ]"
            :data-selected="table.isSelected(row) || undefined"
            @click="onRowClick(row)"
          >
            <td v-if="props.expandable" :class="slotCls('gutter')" @click.stop>
              <button
                v-if="!props.canExpandRow || props.canExpandRow(row)"
                type="button"
                :class="[slotCls('expandButton'), table.isExpanded(row) && !isUnstyled ? 'rotate-90' : undefined]"
                :aria-expanded="table.isExpanded(row)"
                aria-label="Toggle row details"
                @click="table.toggleExpanded(row)"
              >
                <Icon :icon="ArrowRight01Icon" />
              </button>
            </td>

            <td v-if="props.selectable" :class="slotCls('gutter')" @click.stop>
              <Checkbox
                v-if="!props.isRowSelectable || props.isRowSelectable(row)"
                :model-value="table.isSelected(row)"
                aria-label="Select row"
                @update:model-value="table.toggleRow(row)"
              />
            </td>

            <td
              v-for="column in table.visibleColumns.value"
              :key="column.key"
              :class="cls('td', [alignClass(column), numericClass(column), cellClass(row, column)].filter(Boolean).join(' ') || undefined)"
            >
              <template v-if="!isCellHidden(row, column)">
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                  :column="column"
                  :value="table.getRowValue(row, column.key)"
                >
                  {{ table.getRowValue(row, column.key) }}
                </slot>
              </template>
            </td>

            <!-- Stops a click on the menu from also selecting or expanding the row. -->
            <td v-if="$slots['row-actions']" :class="slotCls('actions')" @click.stop>
              <slot name="row-actions" :row="row" />
            </td>
          </tr>

          <tr v-if="props.expandable && table.isExpanded(row)" :class="[cls('tr'), slotCls('expandedRow')]">
            <td :colspan="columnCount" :class="slotCls('expandedCell')">
              <slot name="expanded" :row="row" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
