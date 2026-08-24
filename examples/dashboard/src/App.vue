<script setup lang="ts">
import type { DropdownMenuEntry, IconLike, SidebarItems } from 'iryx-ui'
import {
  Album02Icon,
  Invoice01Icon,
  Logout01Icon,
  Moon02Icon,
  Search01Icon,
  Settings01Icon,
  Sun03Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { useAppearance } from 'iryx-ui'
import { computed, ref } from 'vue'
import Customers from './pages/Customers.vue'
import Invoices from './pages/Invoices.vue'
import Overview from './pages/Overview.vue'
import Settings from './pages/Settings.vue'

/*
 * Navigation is a ref and a lookup rather than a router. The example is about
 * the components, and a router would put its own concepts — routes, guards,
 * lazy chunks — between you and them. `ISidebar` takes `onSelect` and `active`
 * precisely so it can be driven either way: swap these for router links and
 * nothing else here changes.
 */
const pages = { overview: Overview, invoices: Invoices, customers: Customers, settings: Settings }
type PageName = keyof typeof pages

const page = ref<PageName>('overview')

const nav: { name: PageName, label: string, icon: IconLike, badge?: string }[] = [
  { name: 'overview', label: 'Overview', icon: Album02Icon },
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

/*
 * Overview is a loose link rather than a member of the section below it: it
 * is the whole dashboard, not one of the billing screens, and a section of
 * one would have said the opposite. `SidebarItems` takes bare links and
 * labelled sections in the same array for this.
 */
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
  { label: 'Signed in as rae@northwind.example' },
  '-',
  { label: 'Account settings', icon: Settings01Icon, onSelect: () => (page.value = 'settings') },
  { label: 'Sign out', icon: Logout01Icon, danger: true, onSelect: () => {} },
]
</script>

<template>
  <!--
    No height class here. `IAppShell scroll="main"` already sets `h-svh` and
    `overflow-hidden` on this same element, and a `min-h-dvh` on top of it made
    the box taller than the viewport — `dvh` exceeds `svh` wherever a browser
    has retracting chrome — which gave the document its own scrollbar behind
    the main column's.
  -->
  <IApp>
    <!--
      `scroll="main"` pins the shell to the viewport and scrolls the content
      column alone, so the sidebar and header stay put — what a dashboard
      usually wants. `scroll="page"` scrolls the whole document instead.
    -->
    <!--
      The content column gets its own recessed surface and a max width. Cards
      are bg-background, so a muted canvas behind them is what makes them read
      as raised rather than as outlined rectangles.
    -->
    <IAppShell scroll="main" :ui="{ main: 'bg-muted/60' }">
      <template #header>
        <div class="flex h-14 items-center gap-3 border-b border-border px-4">
          <span class="font-semibold tracking-tight">Northwind Ops</span>

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

            <IDropdownMenu :items="account" align="end">
              <template #trigger>
                <button
                  type="button"
                  aria-label="Account menu"
                  class="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <IAvatar name="Rae Lindqvist" size="sm" status="online" />
                </button>
              </template>
            </IDropdownMenu>
          </div>
        </div>
      </template>

      <template #sidebar>
        <ISidebar :items="items" class="w-60" />
      </template>

      <!--
        Keyed so each page mounts fresh. Without it Vue reuses the instance
        across a nav, and a table's sort or a form's draft would survive a move
        to another page and back.
      -->
      <IContainer class="py-6">
        <component :is="pages[page]" :key="page" />
      </IContainer>
    </IAppShell>

    <IToaster />
    <IConfirmDialog />
  </IApp>
</template>
