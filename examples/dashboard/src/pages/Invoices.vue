<script setup lang="ts">
import type { TableColumn } from 'iryx-ui'
import type { Invoice } from '../data'
import { Add01Icon, Download01Icon, MoreVerticalIcon } from '@hugeicons/core-free-icons'
import { useConfirm, useToast } from 'iryx-ui'
import { computed, ref } from 'vue'
import { formatDay, formatMoney, invoices, statusVariant } from '../data'

const { toast, success } = useToast()
const { confirm } = useConfirm()

const query = ref('')
const status = ref('all')
const selection = ref<string[]>([])
const page = ref(1)
const perPage = 8

/*
 * 'all', not ''. Reka reserves the empty string to mean *nothing selected*
 * and refuses it as an item value outright, so a real "no filter" option
 * needs a value of its own.
 */
const statuses = [
  { label: 'All statuses', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Sent', value: 'sent' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Draft', value: 'draft' },
]

/*
 * Filtering and paging happen here because the whole list is already in
 * memory. Past a few hundred rows this moves to the server: `ITable` takes a
 * `total` for exactly that case, so it reports the full count while holding
 * only the current page.
 */
const filtered = computed(() => {
  const term = query.value.trim().toLowerCase()
  return invoices.filter((row) => {
    if (status.value !== 'all' && row.status !== status.value)
      return false
    if (!term)
      return true
    return row.number.toLowerCase().includes(term) || row.customer.name.toLowerCase().includes(term)
  })
})

const paged = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

// A filter that shortens the list can strand the reader on a page that no
// longer exists, showing an empty table with rows behind it.
function resetPage(): void {
  page.value = 1
}

const columns: TableColumn<Invoice>[] = [
  { key: 'number', label: 'Invoice', sortable: true, width: '8rem' },
  { key: 'customer.name', label: 'Customer', sortable: true, sortKey: 'customer.name' },
  { key: 'issued', label: 'Issued', sortable: true, width: '9rem' },
  { key: 'due', label: 'Due', sortable: true, width: '9rem' },
  { key: 'total', label: 'Total', sortable: true, numeric: true, width: '8rem' },
  { key: 'status', label: 'Status', sortable: true, align: 'center', width: '7rem' },
]

function rowActions(row: Invoice) {
  return [
    { label: 'Send reminder', onSelect: () => toast(`Reminder sent for ${row.number}`) },
    { label: 'Download PDF', icon: Download01Icon, onSelect: () => {} },
    '-' as const,
    { label: 'Void invoice', danger: true, onSelect: () => voidInvoice(row) },
  ]
}

async function voidInvoice(row: Invoice): Promise<void> {
  const confirmed = await confirm({
    title: `Void ${row.number}?`,
    description: 'The invoice stays on the record as voided. This cannot be undone.',
    confirmLabel: 'Void invoice',
    danger: true,
  })
  if (confirmed)
    success(`${row.number} voided`)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <IPageHeader title="Invoices" :description="`${filtered.length} of ${invoices.length} invoices`">
      <template #actions>
        <IButton size="sm">
          <IIcon :icon="Add01Icon" data-icon="inline-start" />
          New invoice
        </IButton>
      </template>
    </IPageHeader>

    <div class="flex flex-wrap items-center gap-3">
      <IInput
        v-model="query"
        placeholder="Search invoice or customer"
        clearable
        class="w-full sm:w-72"
        @update:model-value="resetPage"
      />
      <ISelect
        v-model="status"
        :items="statuses"
        placeholder="All statuses"
        class="w-44"
        @update:model-value="resetPage"
      />

      <IBadge v-if="selection.length" variant="info" class="ml-auto">
        {{ selection.length }} selected
      </IBadge>
    </div>

    <!--
      `padding="none"`, not `ui.body`: the padding lives on the card *root*, so
      zeroing the body leaves the root's own inset behind and the row rules stop
      short of the border. `overflow-hidden` clips the table to the radius.
    -->
    <ICard padding="none" class="overflow-hidden shadow-xs">
      <ITable
        v-model:selection="selection"
        :rows="paged"
        :columns="columns"
        row-key="id"
        :ui="{ table: '[&_th:first-child]:pl-6 [&_td:first-child]:pl-6 [&_th:last-child]:pr-6 [&_td:last-child]:pr-6' }"
        selectable
        striped
        hoverable
        label="Invoices"
        empty-text="No invoices match those filters."
      >
        <template #cell-issued="{ row }">
          {{ formatDay(row.issued) }}
        </template>
        <template #cell-due="{ row }">
          {{ formatDay(row.due) }}
        </template>
        <template #cell-total="{ row }">
          {{ formatMoney(row.total) }}
        </template>
        <template #cell-status="{ row }">
          <IBadge :variant="statusVariant[row.status]" size="sm" class="capitalize">
            {{ row.status }}
          </IBadge>
        </template>

        <!--
          A trailing column sized to its content. Clicks inside it never reach
          the row, so an action never doubles as a row selection.
        -->
        <template #row-actions="{ row }">
          <IDropdownMenu :items="rowActions(row)" align="end">
            <template #trigger>
              <IButton variant="ghost" size="sm" square :aria-label="`Actions for ${row.number}`">
                <IIcon :icon="MoreVerticalIcon" data-icon />
              </IButton>
            </template>
          </IDropdownMenu>
        </template>
      </ITable>
    </ICard>

    <IPagination
      v-model:page="page"
      :total="filtered.length"
      :items-per-page="perPage"
      align="end"
    />
  </div>
</template>
