<script setup lang="ts">
import { Mail01Icon } from '@hugeicons/core-free-icons'
import { computed } from 'vue'
import { formatMoney, invoices } from '../data'

const customers = computed(() => {
  const byName = new Map<string, { name: string, email: string, cents: number, count: number, overdue: number }>()

  for (const invoice of invoices) {
    const entry = byName.get(invoice.customer.name) ?? {
      name: invoice.customer.name,
      email: invoice.customer.email,
      cents: 0,
      count: 0,
      overdue: 0,
    }
    entry.cents += Math.round(Number(invoice.total) * 100)
    entry.count += 1
    if (invoice.status === 'overdue')
      entry.overdue += 1
    byName.set(invoice.customer.name, entry)
  }

  return [...byName.values()].sort((a, b) => b.cents - a.cents)
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <IPageHeader title="Customers" :description="`${customers.length} accounts billed this quarter.`" />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <ICard
        v-for="customer in customers"
        :key="customer.name"
        padding="none"
        class="overflow-hidden shadow-xs"
      >
        <div class="flex items-start gap-3 border-b border-border bg-muted/50 p-4">
          <IAvatar :name="customer.name" size="md" class="bg-background" />

          <div class="min-w-0 flex-1">
            <p class="truncate font-medium">
              {{ customer.name }}
            </p>
            <p class="truncate text-sm text-muted-foreground">
              {{ customer.email }}
            </p>
          </div>

          <IBadge v-if="customer.overdue" variant="danger" size="sm">
            {{ customer.overdue }} overdue
          </IBadge>
        </div>

        <div class="flex items-end justify-between gap-3 p-4 pb-0">
          <div>
            <p class="text-sm text-muted-foreground">
              Billed
            </p>
            <p class="text-lg font-semibold tabular-nums">
              {{ formatMoney((customer.cents / 100).toFixed(2)) }}
            </p>
          </div>

          <IButton
            as="a"
            :href="`mailto:${customer.email}`"
            variant="outline"
            size="sm"
          >
            <IIcon :icon="Mail01Icon" data-icon="inline-start" />
            Email
          </IButton>
        </div>

        <p class="px-4 pt-2 pb-4 text-xs text-muted-foreground">
          {{ customer.count }} {{ customer.count === 1 ? 'invoice' : 'invoices' }}
        </p>
      </ICard>
    </div>
  </div>
</template>
