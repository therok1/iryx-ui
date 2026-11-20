<script setup lang="ts">
import type { TableColumn } from 'iryx-ui'
import {
  Analytics01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Invoice01Icon,
} from '@hugeicons/core-free-icons'
import { computed, ref } from 'vue'
import { byChannel, formatDay, formatMoney, invoices, revenue, statusVariant } from '../data'

function sumCents(rows: typeof invoices): string {
  const cents = rows.reduce((total, row) => total + Math.round(Number(row.total) * 100), 0)
  return (cents / 100).toFixed(2)
}

const euro = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 } as const

const total = computed(() => sumCents(invoices))
const collected = computed(() => sumCents(invoices.filter(row => row.status === 'paid')))
const outstanding = computed(() => sumCents(invoices.filter(row => row.status === 'sent' || row.status === 'overdue')))

const byStatus = computed(() => ([
  { label: 'Paid', status: 'paid', slot: 4 },
  { label: 'Sent', status: 'sent', slot: 0 },
  { label: 'Overdue', status: 'overdue', slot: 2 },
  { label: 'Draft', status: 'draft', slot: 6 },
] as const).map(entry => ({ ...entry, value: Number(sumCents(invoices.filter(row => row.status === entry.status))) })))

const share = (value: number) => `${Math.round((value / Number(total.value)) * 100)}%`

// Collected vs a monthly target, split by how it arrived.
const target = 40000
const collection = [
  { label: 'Transfer', value: 6200, variant: 'primary' },
  { label: 'Card', value: 2800, variant: 'info' },
  { label: 'Direct debit', value: 707, variant: 'neutral' },
] as const

const dot = { primary: 'bg-primary', info: 'bg-info', neutral: 'bg-muted-foreground' } as const
const collectionRows = computed(() => [
  ...collection.map(row => ({ label: row.label, amount: formatMoney(String(row.value)), dot: dot[row.variant] })),
  { label: 'Outstanding', amount: formatMoney(outstanding.value), dot: 'bg-border' },
])

const daysToPay = [
  { label: 'Meridian Foods', delta: -3, days: 21 },
  { label: 'Halcyon Labs', delta: -1, days: 26 },
  { label: 'Northgate Supply', delta: 6, days: 44 },
  { label: 'Copperline Media', delta: -2, days: 19 },
]

const metric = ref('Revenue')
const channelMax = Math.max(...byChannel.map(row => row.value))
const channelVariant = ['primary', 'info', 'warning', 'neutral'] as const

const recent = computed(() => [...invoices].sort((a, b) => b.issued.localeCompare(a.issued)).slice(0, 5))

const columns: TableColumn[] = [
  { key: 'number', label: 'Invoice', width: '8rem' },
  { key: 'customer.name', label: 'Customer' },
  { key: 'issued', label: 'Issued', width: '9rem' },
  { key: 'total', label: 'Total', numeric: true, width: '8rem' },
  { key: 'status', label: 'Status', align: 'center', width: '7rem' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <IPageHeader title="Overview">
      <template #actions>
        <IButton variant="outline" size="sm">
          <IIcon :icon="Calendar03Icon" data-icon="inline-start" />
          Last 30 days
        </IButton>
      </template>
    </IPageHeader>

    <div class="grid gap-4 xl:grid-cols-[1.15fr_1fr_0.85fr]">
      <ITray label="Invoiced" :icon="Invoice01Icon">
        <ICard padding="md" class="flex flex-1 flex-col">
          <div class="flex items-start gap-4">
            <div class="min-w-0 flex-1 sm:flex-none sm:basis-3/5">
              <IStat delta-placement="hint" :value="formatMoney(total)" :delta="9.4" hint="vs. last month" :ui="{ row: 'flex-nowrap' }" />
              <ISeparator class="my-4" />
              <ul class="space-y-1.5 text-xs">
                <li v-for="row in byStatus" :key="row.label" class="flex items-center gap-2">
                  <span class="size-1.5 rounded-full" :style="{ background: `var(--iryx-chart-${row.slot + 1})` }" />
                  <span class="flex-1 text-muted-foreground">{{ row.label }}</span>
                  <span class="font-medium tabular-nums">{{ share(row.value) }}</span>
                </li>
              </ul>
            </div>
            <div class="flex min-w-28 flex-1 justify-center max-sm:hidden">
              <IDonutChart
                :data="byStatus"
                :size="112"
                :thickness="12"
                locale="en-IE"
                :format="euro"
                label="Invoiced total by status"
                :legend="false"
              >
                <template #center>
                  <span class="text-lg font-semibold tabular-nums">{{ share(byStatus[0]!.value) }}</span>
                  <span class="text-[11px] text-muted-foreground">paid</span>
                </template>
              </IDonutChart>
            </div>
          </div>
        </ICard>
      </ITray>

      <ITray label="Collected" :icon="CheckmarkCircle02Icon">
        <ICard padding="md" class="flex flex-1 flex-col">
          <IStat delta-placement="hint" :value="formatMoney(collected)" :delta="12.1" hint="vs. target" />
          <IProgress :segments="[...collection]" :max="target" size="sm" class="my-4" label="Collected by method" :ui="{ header: 'sr-only', legend: 'hidden' }" />
          <ul class="space-y-1.5 text-xs">
            <li v-for="row in collectionRows" :key="row.label" class="flex items-center gap-2">
              <span class="size-1.5 rounded-full" :class="row.dot" />
              <span class="flex-1 text-muted-foreground">{{ row.label }}</span>
              <span class="font-medium tabular-nums">{{ row.amount }}</span>
            </li>
          </ul>
        </ICard>
      </ITray>

      <ITray label="Days to pay" :icon="Clock01Icon">
        <ICard padding="md" class="flex flex-1 flex-col">
          <IStat delta-placement="hint" value="27 days" :delta="-4" trend="up" hint="vs. last month (faster)" />
          <ISeparator class="my-4" />
          <ul class="space-y-1.5 text-xs">
            <li v-for="row in daysToPay" :key="row.label" class="flex items-center gap-2">
              <span class="flex-1 text-muted-foreground">{{ row.label }}</span>
              <span class="w-8 tabular-nums" :class="row.delta < 0 ? 'text-success' : 'text-danger'">
                {{ row.delta > 0 ? '+' : '' }}{{ row.delta }}
              </span>
              <span class="w-14 text-right font-medium tabular-nums">{{ row.days }} days</span>
            </li>
          </ul>
        </ICard>
      </ITray>
    </div>

    <ITray label="Revenue vs. channel" :icon="Analytics01Icon">
      <ICard padding="md" class="flex-[2]">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <div>
            <p class="text-sm font-medium">
              All customers
            </p>
            <p class="text-xs text-muted-foreground">
              Last six months
            </p>
          </div>
          <IToggleGroup v-model="metric" :items="['Revenue', 'Invoices']" size="xs" variant="plain" class="ml-auto" />
        </div>
        <ILineChart
          :data="revenue"
          variant="area"
          :tension="0.6"
          flush
          :height="260"
          locale="en-IE"
          :format="euro"
        />
      </ICard>

      <ICard padding="md" class="flex flex-1 flex-col">
        <p class="text-sm font-medium">
          By channel
        </p>
        <p class="text-xs text-muted-foreground">
          Month to date
        </p>
        <IStat delta-placement="hint" :value="formatMoney('58420')" :delta="17.1" hint="vs. last month" class="mt-6" />
        <ISeparator class="my-5" />
        <ul class="space-y-3 text-xs">
          <li v-for="(row, index) in byChannel" :key="row.label" class="grid grid-cols-[5.5rem_1fr_4rem] items-center gap-3">
            <span class="text-muted-foreground">{{ row.label }}</span>
            <IProgress :model-value="row.value" :max="channelMax" :variant="channelVariant[index]" size="sm" :label="row.label" :ui="{ label: 'sr-only' }" />
            <span class="text-right font-medium tabular-nums">{{ formatMoney(String(row.value)) }}</span>
          </li>
        </ul>
      </ICard>
    </ITray>

    <ITray label="Recent invoices" :icon="Invoice01Icon">
      <ICard padding="none" class="flex-1 overflow-hidden">
        <ITable
          :rows="recent"
          :columns="columns"
          row-key="id"
          :ui="{ table: '[&_th:first-child]:pl-6 [&_td:first-child]:pl-6 [&_th:last-child]:pr-6 [&_td:last-child]:pr-6' }"
          label="Recent invoices"
        >
          <template #cell-issued="{ row }">
            {{ formatDay(row.issued) }}
          </template>
          <template #cell-total="{ row }">
            {{ formatMoney(row.total) }}
          </template>
          <template #cell-status="{ row }">
            <IBadge :variant="statusVariant[row.status as keyof typeof statusVariant]" size="sm" class="capitalize">
              {{ row.status }}
            </IBadge>
          </template>
        </ITable>
      </ICard>
    </ITray>
  </div>
</template>
