<script setup lang="ts">
import type { DropdownMenuEntry, IconLike, SidebarItems } from 'iryx-ui'
import {
  Home01Icon,
  Invoice01Icon,
  Logout01Icon,
  Moon02Icon,
  Search01Icon,
  Settings01Icon,
  Sun03Icon,
  UnfoldMoreIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { useAppearance } from 'iryx-ui'
import { computed, ref } from 'vue'
import { user } from './data'

import Customers from './pages/Customers.vue'
import Invoices from './pages/Invoices.vue'
import Overview from './pages/Overview.vue'
import Settings from './pages/Settings.vue'

const pages = { overview: Overview, invoices: Invoices, customers: Customers, settings: Settings }
type PageName = keyof typeof pages

const page = ref<PageName>('overview')

const nav: { name: PageName, label: string, icon: IconLike, badge?: string }[] = [
  { name: 'overview', label: 'Overview', icon: Home01Icon },
  { name: 'invoices', label: 'Invoices', icon: Invoice01Icon, badge: '3' },
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

const items = computed<SidebarItems>(() => [
  toLink(nav[0]!),
  {
    section: 'Billing',
    items: nav.slice(1).map(toLink),
  },
])

const { isDark, setAppearance } = useAppearance()

function toggleAppearance(): void {
  setAppearance(isDark.value ? 'light' : 'dark')
}

const account: DropdownMenuEntry[] = [
  { label: 'Account settings', icon: Settings01Icon, onSelect: () => (page.value = 'settings') },
  { label: 'Sign out', icon: Logout01Icon, danger: true, onSelect: () => {} },
]
</script>

<template>
  <IApp>
    <IAppShell
      scroll="main"
      :ui="{
        main: 'bg-muted/20',
        header: 'border-b border-border',
        navDrawerBody: 'pt-0',
      }"
    >
      <template #header>
        <div class="flex h-14 items-center gap-3 px-4">
          <span class="flex items-center gap-2.5 font-semibold tracking-tight">
            <img src="/logo.svg" alt="" class="h-4 w-auto">
            Iryx UI
          </span>

          <IInput
            placeholder="Search invoices, customers…"
            size="sm"
            class="ml-4 hidden w-72 md:flex"
          >
            <template #leading>
              <IIcon :icon="Search01Icon" />
            </template>
          </IInput>

          <div class="ml-auto flex items-center gap-2">
            <IButton
              variant="ghost"
              size="sm"
              square
              :aria-label="isDark ? 'Switch to light appearance' : 'Switch to dark appearance'"
              @click="toggleAppearance"
            >
              <IIcon :icon="isDark ? Sun03Icon : Moon02Icon" data-icon />
            </IButton>
          </div>
        </div>
      </template>

      <template #sidebar="{ inDrawer }">
        <ISidebar
          :items="items"
          class="w-60"
          :ui="inDrawer ? { header: '-mt-1 h-6 px-3 py-0' } : undefined"
        >
          <template v-if="inDrawer" #header>
            <span class="flex items-center gap-2.5 font-semibold tracking-tight">
              <img src="/logo.svg" alt="" class="h-4 w-auto">
              Iryx UI
            </span>
          </template>

          <template #footer>
            <IDropdownMenu
              :items="account"
              :side="inDrawer ? 'top' : 'right'"
              :align="inDrawer ? 'start' : 'end'"
              class="min-w-56"
            >
              <template #trigger>
                <button
                  type="button"
                  aria-label="Account menu"
                  class="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <IAvatar :name="user.name" size="sm" status="online" />
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-medium">
                      {{ user.name }}
                    </div>
                    <div class="truncate text-xs text-muted-foreground">
                      {{ user.email }}
                    </div>
                  </div>
                  <IIcon :icon="UnfoldMoreIcon" class="size-4 shrink-0 text-muted-foreground" />
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
          </template>
        </ISidebar>
      </template>

      <IContainer class="py-6">
        <component :is="pages[page]" :key="page" />
      </IContainer>
    </IAppShell>

    <IToaster />
    <IConfirmDialog />
  </IApp>
</template>
