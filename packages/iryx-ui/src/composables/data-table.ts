import type { ModelRef } from 'vue'
import { computed, ref } from 'vue'

/** Which way a column is sorted. */
export type SortOrder = 'asc' | 'desc'

/** The active sort, or `null` when nothing is sorted. */
export interface TableSort {
  /** A column's `sortKey`, falling back to its `key`. */
  key: string
  order: SortOrder
}

/**
 * A column definition. Plain data, no render functions — anything beyond the
 * raw accessor value is a `#cell-<key>` slot on the component.
 */
export interface TableColumn<T = any> {
  /** Accessor path into the row, dot-notation for nested values. Also the slot suffix. */
  key: string
  /** Header text. */
  label?: string
  sortable?: boolean
  /** Sort by a different field than the one displayed, e.g. `'customer.name'` → `'customer_name'`. */
  sortKey?: string
  align?: 'start' | 'center' | 'end'
  /**
   * Render the column's cells with tabular figures, so digits line up down the
   * column instead of wandering with the width of each glyph. Implies end
   * alignment unless `align` says otherwise.
   */
  numeric?: boolean
  /** Inline width, e.g. `'12rem'` or `'1px'` to shrink to content. */
  width?: string
  /** Extra classes on every cell in the column; a function receives the row. */
  class?: string | ((row: T) => string)
  /** Hide the column outright, or per row (the cell renders empty). */
  hidden?: boolean | ((row: T) => boolean)
}

export interface UseDataTableOptions<T = any> {
  rows: () => T[]
  columns: () => TableColumn<T>[]
  /**
   * Total row count on the server. Providing it switches the table to server
   * mode: sorting and pagination are emitted rather than applied locally,
   * because the rows you passed are already the page the server returned.
   */
  total?: () => number | undefined
  /** Field identifying a row, used for selection and expansion. */
  rowKey?: () => string
  /** Controlled models. Any left undefined falls back to internal state. */
  sort?: ModelRef<TableSort | null | undefined>
  page?: ModelRef<number | undefined>
  perPage?: ModelRef<number | undefined>
  selection?: ModelRef<(string | number)[] | undefined>
  expanded?: ModelRef<(string | number)[] | undefined>
  /** Rows that cannot be selected are skipped by the header checkbox. */
  isRowSelectable?: (row: T) => boolean
}

/**
 * Use the caller's model when there is one, else keep local state.
 *
 * A `defineModel()` ref given a default already handles both directions — it
 * follows the prop when bound and holds its own value when not, emitting
 * either way — so it is passed straight through. The local fallback is for
 * calling this composable directly, without a component.
 */
function useModel<V>(model: ModelRef<V | undefined> | undefined, fallback: V) {
  if (model)
    return model as { value: V }
  const local = ref(fallback) as { value: V }
  return local
}

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

/** Read a dot-notation path off a row. */
export function getRowValue(row: any, path: string): unknown {
  return path.split('.').reduce<any>((current, key) => current?.[key], row)
}

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number')
    return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean')
    return Number(a) - Number(b)
  if (a instanceof Date && b instanceof Date)
    return a.getTime() - b.getTime()

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

/**
 * Headless state and derivations behind `ITable` — usable on its own if you
 * want the logic without the markup.
 */
export function useDataTable<T = any>(options: UseDataTableOptions<T>) {
  const sort = useModel(options.sort, null as TableSort | null)
  const page = useModel(options.page, 1)
  const perPage = useModel(options.perPage, 10)
  const selection = useModel(options.selection, [] as (string | number)[])
  const expanded = useModel(options.expanded, [] as (string | number)[])

  /** Server mode is inferred from `total`: knowing it means the server paginated. */
  const isServerMode = computed(() => options.total?.() !== undefined)
  const rowKey = computed(() => options.rowKey?.() ?? 'id')

  const visibleColumns = computed(() =>
    options.columns().filter(column => column.hidden !== true),
  )

  /** Rows after local sorting — untouched in server mode. */
  const sortedRows = computed(() => {
    const rows = options.rows()
    const active = sort.value
    if (isServerMode.value || !active)
      return rows

    const column = options.columns().find(c => (c.sortKey ?? c.key) === active.key)
    const path = column?.key ?? active.key
    const direction = active.order === 'asc' ? 1 : -1

    // Sorting a copy keeps the caller's array intact — theirs may be a prop.
    return [...rows].sort((a, b) => {
      const av = getRowValue(a, path)
      const bv = getRowValue(b, path)
      // Blanks sink to the bottom in both directions, so reversing the sort
      // never floats empty cells above real data.
      if (isBlank(av) || isBlank(bv))
        return isBlank(av) && isBlank(bv) ? 0 : isBlank(av) ? 1 : -1
      return compare(av, bv) * direction
    })
  })

  const total = computed(() => options.total?.() ?? sortedRows.value.length)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / Math.max(1, perPage.value))))

  /** The rows actually rendered. In server mode that is whatever was passed in. */
  const pageRows = computed(() => {
    if (isServerMode.value)
      return sortedRows.value
    const start = (page.value - 1) * perPage.value
    return sortedRows.value.slice(start, start + perPage.value)
  })

  function keyOf(row: T): string | number {
    return getRowValue(row, rowKey.value) as string | number
  }

  /**
   * Cycle a column: unsorted → ascending → descending → unsorted.
   * Clearing to `null` is distinct from "never sorted", which is what lets a
   * server-mode caller fall back to its own default ordering.
   */
  function toggleSort(column: TableColumn<T>) {
    if (!column.sortable)
      return
    const key = column.sortKey ?? column.key
    const active = sort.value

    if (active?.key !== key)
      sort.value = { key, order: 'asc' }
    else if (active.order === 'asc')
      sort.value = { key, order: 'desc' }
    else
      sort.value = null

    // A reordered list makes the old page number meaningless.
    page.value = 1
  }

  function sortOrderFor(column: TableColumn<T>): SortOrder | null {
    const key = column.sortKey ?? column.key
    return sort.value?.key === key ? sort.value.order : null
  }

  const selectableRows = computed(() =>
    pageRows.value.filter(row => !options.isRowSelectable || options.isRowSelectable(row)),
  )

  function isSelected(row: T): boolean {
    return selection.value.includes(keyOf(row))
  }

  function toggleRow(row: T) {
    if (options.isRowSelectable && !options.isRowSelectable(row))
      return
    const key = keyOf(row)
    selection.value = isSelected(row)
      ? selection.value.filter(k => k !== key)
      : [...selection.value, key]
  }

  /** Tri-state for the header checkbox, scoped to the rows on screen. */
  const headerSelection = computed<boolean | 'indeterminate'>(() => {
    const rows = selectableRows.value
    if (rows.length === 0)
      return false
    const selected = rows.filter(isSelected).length
    if (selected === 0)
      return false
    return selected === rows.length ? true : 'indeterminate'
  })

  /**
   * Select or clear every selectable row on the current page, leaving
   * selections made on other pages alone.
   */
  function toggleAll(value: boolean | 'indeterminate') {
    const keys = selectableRows.value.map(keyOf)
    if (value === true) {
      const merged = new Set(selection.value)
      keys.forEach(key => merged.add(key))
      selection.value = [...merged]
    }
    else {
      const dropped = new Set(keys)
      selection.value = selection.value.filter(key => !dropped.has(key))
    }
  }

  function isExpanded(row: T): boolean {
    return expanded.value.includes(keyOf(row))
  }

  function toggleExpanded(row: T) {
    const key = keyOf(row)
    expanded.value = isExpanded(row)
      ? expanded.value.filter(k => k !== key)
      : [...expanded.value, key]
  }

  return {
    sort,
    page,
    perPage,
    selection,
    expanded,
    isServerMode,
    visibleColumns,
    pageRows,
    total,
    pageCount,
    keyOf,
    toggleSort,
    sortOrderFor,
    headerSelection,
    isSelected,
    toggleRow,
    toggleAll,
    isExpanded,
    toggleExpanded,
    getRowValue,
  }
}
