<script setup lang="ts">
import type { TableColumn, TimelineItem } from 'iryx-ui'
import { Download01Icon } from '@hugeicons/core-free-icons'
import { computed } from 'vue'
import { activity, byChannel, formatDay, formatMoment, formatMoney, invoices, revenue, statusVariant } from '../data'

/*
 * Totals are summed as integer cents, not floats. `0.1 + 0.2` is
 * 0.30000000000000004, and a column of invoices adds that error up until the
 * figure on screen disagrees with the one in the ledger.
 */
function sumCents(rows: typeof invoices): string {
  const cents = rows.reduce((total, row) => total + Math.round(Number(row.total) * 100), 0)
  return (cents / 100).toFixed(2)
}

const outstanding = computed(() => sumCents(invoices.filter(row => row.status === 'sent' || row.status === 'overdue')))
const overdue = computed(() => invoices.filter(row => row.status === 'overdue'))
const collected = computed(() => sumCents(invoices.filter(row => row.status === 'paid')))

const recent = computed(() => [...invoices].sort((a, b) => b.issued.localeCompare(a.issued)).slice(0, 5))

const columns: TableColumn[] = [
  { key: 'number', label: 'Invoice', width: '8rem' },
  { key: 'customer.name', label: 'Customer' },
  { key: 'issued', label: 'Issued', width: '9rem' },
  // `numeric` gives the column tabular figures, so digits line up down the
  // column rather than wandering with the width of each glyph.
  { key: 'total', label: 'Total', numeric: true, width: '8rem' },
  { key: 'status', label: 'Status', align: 'center', width: '7rem' },
]

const timeline = computed<TimelineItem[]>(() => activity.map(entry => ({
  title: entry.title,
  description: entry.description,
  time: formatMoment(entry.at),
  datetime: entry.at,
  variant: entry.status,
})))
</script>

<template>
  <div class="flex flex-col gap-6">
    <IPageHeader title="Overview" description="Where billing stands this month.">
      <template #actions>
        <IButton variant="outline" size="sm">
          <IIcon :icon="Download01Icon" data-icon="inline-start" />
          Export
        </IButton>
      </template>
    </IPageHeader>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ICard class="bg-muted/50 shadow-xs">
        <IStat label="Outstanding" :value="formatMoney(outstanding)" :delta="8.2" hint="Sent and overdue" />
      </ICard>
      <ICard class="bg-muted/50 shadow-xs">
        <!--
          Down is the good direction here, so `trend` overrides the colour the
          sign would otherwise pick: a falling overdue total is not a loss.
        -->
        <IStat
          label="Overdue"
          :value="formatMoney(sumCents(overdue))"
          :delta="-14"
          trend="up"
          :hint="`${overdue.length} invoices`"
        />
      </ICard>
      <ICard class="bg-muted/50 shadow-xs">
        <IStat label="Collected" :value="formatMoney(collected)" :delta="12.1" hint="This month" />
      </ICard>
      <ICard class="bg-muted/50 shadow-xs">
        <IStat label="Average days to pay" value="27" :delta="-4" trend="up" hint="Target 30" />
      </ICard>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <ICard title="Revenue" description="Last six months" class="shadow-xs lg:col-span-2">
        <ILineChart
          :data="revenue"
          variant="area"
          :tension="0.6"
          flush
          :height="260"
          locale="en-IE"
          :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
        />
      </ICard>

      <ICard title="By channel" description="Month to date" class="shadow-xs">
        <IBarChart
          :data="byChannel"
          orientation="horizontal"
          :height="260"
          locale="en-IE"
          :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
        />
      </ICard>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <ICard
        title="Recent invoices"
        padding="none"
        class="overflow-hidden shadow-xs lg:col-span-2"
        :ui="{ header: 'px-6 pt-6 mb-4' }"
      >
        <ITable
          :rows="recent"
          :columns="columns"
          row-key="id"
          :ui="{ table: '[&_th:first-child]:pl-6 [&_td:first-child]:pl-6 [&_th:last-child]:pr-6 [&_td:last-child]:pr-6' }"
          striped
          label="Recent invoices"
        >
          <template #cell-issued="{ row }">
            {{ formatDay(row.issued) }}
          </template>
          <template #cell-total="{ row }">
            {{ formatMoney(row.total) }}
          </template>
          <template #cell-status="{ row }">
            <IBadge :variant="statusVariant[row.status]" size="sm" class="capitalize">
              {{ row.status }}
            </IBadge>
          </template>
        </ITable>
      </ICard>

      <ICard title="Activity" class="shadow-xs">
        <ITimeline :items="timeline" size="sm" />
      </ICard>
    </div>
  </div>
</template>
