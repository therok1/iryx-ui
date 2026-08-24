<script setup lang="ts">
import type { FormError, TableColumn } from 'iryx-ui'
import type { Invoice } from '../data'
import { Add01Icon, Download01Icon, MoreVerticalIcon } from '@hugeicons/core-free-icons'
import { useConfirm, useToast } from 'iryx-ui'
import { computed, reactive, ref } from 'vue'
import { formatDay, formatMoney, invoices, statusVariant } from '../data'

const { toast, success } = useToast()
const { confirm } = useConfirm()

/*
 * A copy, not the imported array. The module export is the seed; the page
 * owns the list from mount on, so creating an invoice shows up immediately
 * and nothing writes back into shared module state.
 */
const rows = ref<Invoice[]>([...invoices])

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
  return rows.value.filter((row) => {
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

const creating = ref(false)

/** Today, as the ISO date the pickers and the data both use. */
function today(): string {
  return new Date().toISOString().slice(0, 10)
}

const draft = reactive({
  customer: '',
  issued: today(),
  terms: '30',
  total: '',
  notes: '',
})

/** Every customer already billed, for the combobox to offer. */
const customerOptions = computed(() => {
  const names = [...new Set(rows.value.map(row => row.customer.name))].sort()
  return names.map(name => ({ label: name, value: name }))
})

/** Added by the combobox's create row, so a new name can be picked at once. */
const addedCustomers = ref<string[]>([])

const customerItems = computed(() => [
  ...addedCustomers.value.map(name => ({ label: name, value: name })),
  ...customerOptions.value.filter(option => !addedCustomers.value.includes(option.value)),
])

function onCreateCustomer(name: string): void {
  // The combobox deliberately does not set a value for a row that did not
  // exist. Adding it to the list and then selecting it is the caller's half.
  addedCustomers.value = [name, ...addedCustomers.value]
  draft.customer = name
}

function validateDraft(values: typeof draft): FormError[] {
  const errors: FormError[] = []

  if (!values.customer.trim())
    errors.push({ name: 'customer', message: 'An invoice needs someone to bill.' })

  if (!values.issued)
    errors.push({ name: 'issued', message: 'Pick the date it goes out.' })

  // Money as a string, checked as one: parsing to a float to validate would
  // round the very value the check is meant to protect.
  if (!/^\d+(?:\.\d{1,2})?$/.test(values.total) || Number(values.total) <= 0)
    errors.push({ name: 'total', message: 'Enter an amount, to at most two decimal places.' })

  return errors
}

/** Next in the run, so the number follows the ones already on the page. */
function nextNumber(): string {
  const highest = rows.value.reduce((top, row) => {
    const n = Number(row.number.replace(/\D/g, ''))
    return Number.isFinite(n) ? Math.max(top, n) : top
  }, 2040)
  return `INV-${highest + 1}`
}

/** Due date is issue date plus the terms, in whole days. */
function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function openCreate(): void {
  draft.customer = ''
  draft.issued = today()
  draft.terms = '30'
  draft.total = ''
  draft.notes = ''
  creating.value = true
}

function createInvoice(): void {
  const invoice: Invoice = {
    id: `new-${Date.now()}`,
    number: nextNumber(),
    customer: {
      name: draft.customer,
      email: rows.value.find(row => row.customer.name === draft.customer)?.customer.email
        ?? `ap@${draft.customer.toLowerCase().replace(/[^a-z0-9]+/g, '')}.example`,
    },
    issued: draft.issued,
    due: addDays(draft.issued, Number(draft.terms) || 30),
    // A new invoice is a draft: nothing has been sent yet.
    status: 'draft',
    total: Number(draft.total).toFixed(2),
  }

  rows.value = [invoice, ...rows.value]
  creating.value = false
  resetPage()
  success(`${invoice.number} created as a draft`)
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
    <IPageHeader title="Invoices" :description="`${filtered.length} of ${rows.length} invoices`">
      <template #actions>
        <IButton size="sm" @click="openCreate">
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
    <!--
      A drawer rather than a dialog: an invoice form is a side task off the
      list, and the list stays visible behind it.
    -->
    <IDrawer
      v-model:open="creating"
      side="right"
      size="md"
      title="New invoice"
      description="It is saved as a draft — nothing is sent yet."
    >
      <IForm :state="draft" :validate="validateDraft" @submit="createInvoice">
        <div class="flex flex-col gap-4">
          <IFormField
            name="customer"
            label="Customer"
            help="Type a name that is not on the list to add it."
            required
          >
            <ICombobox
              v-model="draft.customer"
              :items="customerItems"
              placeholder="Search customers"
              clearable
              create
              @create="onCreateCustomer"
            />
          </IFormField>

          <div class="grid gap-4 sm:grid-cols-2">
            <IFormField name="issued" label="Issue date" required>
              <IDatePicker v-model="draft.issued" />
            </IFormField>

            <IFormField name="terms" label="Payment terms" hint="Days">
              <INumberInput v-model="draft.terms" min="1" max="180" />
            </IFormField>
          </div>

          <IFormField
            name="total"
            label="Amount"
            :help="`Due ${formatDay(addDays(draft.issued, Number(draft.terms) || 30))}`"
            required
          >
            <INumberInput v-model="draft.total" min="0" :precision="2" placeholder="0.00" />
          </IFormField>

          <IFormField name="notes" label="Notes" hint="Optional">
            <ITextarea v-model="draft.notes" :rows="3" placeholder="Anything the customer should see." />
          </IFormField>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <IButton variant="ghost" type="button" @click="creating = false">
            Cancel
          </IButton>
          <IButton type="submit">
            Create draft
          </IButton>
        </div>
      </IForm>
    </IDrawer>

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
