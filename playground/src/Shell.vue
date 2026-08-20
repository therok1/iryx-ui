<script setup lang="ts">
/*
 * The app shell needs the whole viewport to demonstrate anything — it decides
 * what scrolls — so it lives on its own page rather than inside the scrolling
 * component playground. Served at /shell.html.
 */
import type { SidebarItems } from 'iryx-ui'
import {
  Analytics01Icon,
  CreditCardIcon,
  Home01Icon,
  InboxIcon,
  Invoice01Icon,
  Settings01Icon,
  SidebarLeft01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { ref } from 'vue'

const collapsed = ref(false)
const scroll = ref<'main' | 'page'>('main')
const sidebarPosition = ref<'left' | 'right'>('left')

const sections: SidebarItems = [
  {
    section: 'Workspace',
    items: [
      { label: 'Overview', href: '#', icon: Home01Icon, active: true },
      { label: 'Inbox', href: '#', icon: InboxIcon, badge: 12 },
      { label: 'Reports', href: '#', icon: Analytics01Icon },
    ],
  },
  {
    section: 'Billing',
    items: [
      {
        label: 'Invoices',
        icon: Invoice01Icon,
        defaultOpen: true,
        items: [
          { label: 'Drafts', href: '#' },
          { label: 'Sent', href: '#', badge: 3 },
          { label: 'Overdue', href: '#' },
        ],
      },
      { label: 'Payments', href: '#', icon: CreditCardIcon },
    ],
  },
  { label: 'Settings', href: '#', icon: Settings01Icon },
]

// Enough rows to overflow the viewport, so it is obvious which region scrolls.
const rows = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  number: `INV-${String(index + 1).padStart(3, '0')}`,
  customer: ['Acme Corp', 'Globex Ltd', 'Initech', 'Umbrella Co'][index % 4],
  total: (index + 1) * 137.25,
}))

const columns = [
  { key: 'number', label: 'Invoice' },
  { key: 'customer', label: 'Customer' },
  { key: 'total', label: 'Total', numeric: true },
]
</script>

<template>
  <IApp>
    <IAppShell :scroll="scroll" :sidebar-position="sidebarPosition">
      <template #header>
        <header class="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
          <IButton
            variant="ghost"
            size="sm"
            aria-label="Toggle sidebar"
            @click="collapsed = !collapsed"
          >
            <HugeiconsIcon :icon="SidebarLeft01Icon" :size="16" />
          </IButton>
          <span class="font-semibold">Iryx</span>

          <div class="ml-auto flex items-center gap-2">
            <IButton
              size="sm"
              :variant="scroll === 'main' ? 'solid' : 'outline'"
              @click="scroll = 'main'"
            >
              scroll: main
            </IButton>
            <IButton
              size="sm"
              :variant="scroll === 'page' ? 'solid' : 'outline'"
              @click="scroll = 'page'"
            >
              scroll: page
            </IButton>
            <IButton
              size="sm"
              variant="outline"
              @click="sidebarPosition = sidebarPosition === 'left' ? 'right' : 'left'"
            >
              side: {{ sidebarPosition }}
            </IButton>
          </div>
        </header>
      </template>

      <template #sidebar>
        <ISidebar
          v-model:collapsed="collapsed"
          :items="sections"
          :side="sidebarPosition"
          label="Main"
        >
          <template #footer="{ collapsed: isCollapsed }">
            <span class="truncate text-xs text-muted-foreground">
              {{ isCollapsed ? 'v0.12' : 'iryx-ui v0.12.0' }}
            </span>
          </template>
        </ISidebar>
      </template>

      <IContainer size="lg" class="py-8">
        <IPageHeader
          title="Invoices"
          description="Everything you have sent this year."
          bordered
        >
          <template #breadcrumb>
            <IBreadcrumb :items="[{ label: 'Home', href: '#' }, { label: 'Billing', href: '#' }, { label: 'Invoices' }]" />
          </template>
          <template #actions>
            <IButton variant="outline">
              Export
            </IButton>
            <IButton>New invoice</IButton>
          </template>
        </IPageHeader>

        <ITable class="mt-6" :columns="columns" :rows="rows" :per-page="40" />
      </IContainer>
    </IAppShell>
  </IApp>
</template>
