<script setup lang="ts">
import type { DropdownMenuEntry, IconLike, SidebarItems } from 'iryx-ui'
import {
  Download01Icon,
  File01Icon,
  Home01Icon,
  Invoice01Icon,
  Logout01Icon,
  Moon02Icon,
  MoreHorizontalIcon,
  Search01Icon,
  Settings01Icon,
  SidebarLeftIcon,
  Sun03Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { useAppearance } from 'iryx-ui'
import { computed, ref } from 'vue'
import { invoices, user } from './data'

import Customers from './pages/Customers.vue'
import Invoices from './pages/Invoices.vue'
import Overview from './pages/Overview.vue'
import Settings from './pages/Settings.vue'

const pages = { overview: Overview, invoices: Invoices, customers: Customers, settings: Settings }
type PageName = keyof typeof pages

const page = ref<PageName>('overview')

const nav: { name: PageName, label: string, icon: IconLike, badge?: string }[] = [
  { name: 'overview', label: 'Overview', icon: Home01Icon },
  { name: 'invoices', label: 'Invoices', icon: Invoice01Icon },
  { name: 'customers', label: 'Customers', icon: UserGroupIcon },
  { name: 'settings', label: 'Settings', icon: Settings01Icon },
]

function toLink(entry: typeof nav[number]) {
  return {
    label: entry.label,
    icon: entry.icon,
    badge: entry.badge,
    active: page.value === entry.name,
    onSelect: () => (page.value = entry.name),
  }
}

// Sidebar sub-links open Invoices pre-filtered.
const invoiceFilter = ref('all')
const overdueCount = String(invoices.filter(row => row.status === 'overdue').length)

const items = computed<SidebarItems>(() => nav.map((entry) => {
  if (entry.name !== 'invoices')
    return toLink(entry)
  const sub = (label: string, status: string, badge?: string) => ({
    label,
    badge,
    active: page.value === 'invoices' && invoiceFilter.value === status,
    onSelect: () => {
      page.value = 'invoices'
      invoiceFilter.value = status
    },
  })
  return {
    label: entry.label,
    icon: entry.icon,
    defaultOpen: true,
    items: [sub('All invoices', 'all'), sub('Overdue', 'overdue', overdueCount), sub('Drafts', 'draft')],
  }
}))

const collapsed = ref(false)

const sidebarUi = {
  footer: 'flex-col items-stretch gap-2 px-2',
  linkBadge: 'flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background',
}

const { isDark, setAppearance } = useAppearance()

const appearances = [
  { label: 'Light', value: 'light', icon: Sun03Icon },
  { label: 'Dark', value: 'dark', icon: Moon02Icon },
]

const crumbs = computed(() => {
  const current = nav.find(entry => entry.name === page.value)!
  return page.value === 'overview'
    ? [{ label: current.label }]
    : [{ label: 'Billing', onSelect: () => (page.value = 'overview') }, { label: current.label }]
})

const account: DropdownMenuEntry[] = [
  { label: 'Account settings', icon: Settings01Icon, onSelect: () => (page.value = 'settings') },
  { label: 'Sign out', icon: Logout01Icon, danger: true, onSelect: () => {} },
]
</script>

<template>
  <IApp>
    <IAppShell
      scroll="main"
      :ui="{ navDrawerBody: 'pt-0', panel: 'md:mt-0', main: '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden' }"
    >
      <template #topbar>
        <div class="flex h-14 items-center gap-3 px-4 max-md:hidden">
          <span class="flex w-56 items-center gap-2.5 font-semibold tracking-tight">
            <img src="/logo.svg" alt="" class="h-4 w-auto">
            Iryx UI
          </span>

          <IInput
            placeholder="Search invoices, customers…"
            size="sm"
            class="ml-auto w-72"
          >
            <template #leading>
              <IIcon :icon="Search01Icon" />
            </template>
          </IInput>

          <IToggleGroup
            :model-value="isDark ? 'dark' : 'light'"
            :items="appearances"
            variant="plain"
            size="sm"
            icon-only
            aria-label="Appearance"
            @update:model-value="value => value && setAppearance(value as 'light' | 'dark')"
          />

          <IButton size="sm">
            <IIcon :icon="Download01Icon" data-icon="inline-start" />
            Export
          </IButton>

          <IDropdownMenu
            :items="account"
            align="end"
            class="min-w-56"
          >
            <template #trigger>
              <button type="button" aria-label="Account menu" class="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                <IAvatar :name="user.name" size="sm" status="online" />
              </button>
            </template>

            <template #header>
              <div class="flex items-center gap-2.5">
                <IAvatar :name="user.name" size="sm" />
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium">
                    {{ user.name }}
                  </p>
                  <p class="truncate text-xs text-muted-foreground">
                    {{ user.email }}
                  </p>
                </div>
              </div>
            </template>
          </IDropdownMenu>
        </div>
      </template>

      <template #header>
        <div class="flex h-11 items-center gap-3 px-4">
          <IButton
            variant="ghost"
            size="sm"
            square
            class="-ml-2 max-md:hidden"
            :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            :aria-pressed="!collapsed"
            @click="collapsed = !collapsed"
          >
            <IIcon :icon="SidebarLeftIcon" data-icon />
          </IButton>
          <IBreadcrumb :items="crumbs" class="text-sm" />
          <IButton variant="ghost" size="sm" square aria-label="More" class="ml-auto">
            <IIcon :icon="MoreHorizontalIcon" data-icon />
          </IButton>
        </div>
      </template>

      <template #sidebar="{ inDrawer }">
        <ISidebar
          v-model:collapsed="collapsed"
          :items="items"
          :class="!collapsed || inDrawer ? 'w-60' : undefined"
          :ui="inDrawer ? { ...sidebarUi, header: '-mt-1 mb-3 h-6 px-3 py-0' } : sidebarUi"
        >
          <template v-if="inDrawer" #header>
            <span class="flex items-center gap-2.5 font-semibold tracking-tight">
              <img src="/logo.svg" alt="" class="h-4 w-auto">
              Iryx UI
            </span>
          </template>

          <template #footer>
            <div v-if="!collapsed || inDrawer" class="min-w-52 rounded-xl border border-border bg-background p-3 text-xs">
              <p class="flex items-center gap-2 text-sm font-medium">
                <IIcon :icon="File01Icon" class="size-4 text-muted-foreground" />
                August statement
              </p>
              <p class="mt-1 mb-3 text-muted-foreground">
                Every invoice and payment from last month, ready to download.
              </p>
              <IButton variant="outline" size="xs" block>
                <IIcon :icon="Download01Icon" data-icon="inline-start" />
                Download PDF
              </IButton>
            </div>
          </template>
        </ISidebar>
      </template>

      <IContainer class="py-6">
        <component
          :is="pages[page]"
          :key="page === 'invoices' ? `invoices-${invoiceFilter}` : page"
          v-bind="page === 'invoices' ? { status: invoiceFilter } : {}"
        />
      </IContainer>
    </IAppShell>

    <IToaster />
    <IConfirmDialog />
  </IApp>
</template>
