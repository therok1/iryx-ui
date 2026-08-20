<script setup lang="ts">
import type { Appearance, DropdownMenuEntry, TableColumn, ThemePresetName } from 'iryx-ui'
import { ArrowDown01Icon, ArrowRight01Icon, BellIcon, Copy01Icon, Delete02Icon, Download01Icon, HelpCircleIcon, Home01Icon, InboxIcon, InformationCircleIcon, Search01Icon, SentIcon, TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { themes, useAppearance, useConfirm, useToast } from 'iryx-ui'
import { reactive, ref } from 'vue'

const { appearance, isDark, setAppearance } = useAppearance()
const appearances: Appearance[] = ['light', 'system', 'dark']

// IApp applies the theme reactively — no applyTheme() call needed.
const activeTheme = ref<ThemePresetName>('violet')
const presetNames = Object.keys(themes) as ThemePresetName[]

function pickTheme(name: ThemePresetName) {
  activeTheme.value = name
}

const globalUnstyled = ref(false)

const invoiceColumns: TableColumn[] = [
  { key: 'number', label: 'Invoice', sortable: true, width: '9rem' },
  { key: 'customer.name', label: 'Customer', sortable: true },
  { key: 'total', label: 'Total', sortable: true, numeric: true },
  { key: 'paid', label: 'Status', sortable: true, align: 'center' },
]

const invoices = [
  { id: 1, number: 'INV-001', customer: { name: 'Acme Corp' }, total: 1240.5, paid: true, notes: 'Paid by transfer on 12 March.' },
  { id: 2, number: 'INV-002', customer: { name: 'Globex Ltd' }, total: 320, paid: false, notes: 'Due in 14 days.' },
  { id: 3, number: 'INV-003', customer: { name: 'Initech' }, total: 89.9, paid: true, notes: 'Paid in cash.' },
  { id: 4, number: 'INV-004', customer: { name: 'Umbrella Co' }, total: 4500, paid: false, notes: 'Awaiting purchase order.' },
  { id: 5, number: 'INV-005', customer: { name: 'Hooli' }, total: 76.2, paid: true, notes: 'Recurring monthly charge.' },
  { id: 6, number: 'INV-006', customer: { name: 'Vandelay' }, total: 2100, paid: false, notes: 'Partially settled.' },
]

const tableSelection = ref<(string | number)[]>([])
const tablePage = ref(1)

const checked = ref(false)
const loading = ref(false)

const statuses = ['neutral', 'success', 'warning', 'danger', 'info'] as const
const alertVariants = ['info', 'success', 'warning', 'danger'] as const
const bannerVariants = ['info', 'success', 'warning', 'danger'] as const
const alertOpen = ref(true)

const dialogOpen = ref(false)
const blockingOpen = ref(false)
const drawerSide = ref<'right' | 'left' | 'top' | 'bottom'>('right')
const drawerOpen = ref(false)
const sheetOpen = ref(false)
const sheetSnap = ref<number | string | null>(0.45)

function openDrawer(side: 'right' | 'left' | 'top' | 'bottom') {
  drawerSide.value = side
  drawerOpen.value = true
}

const marks = ref<string[]>(['Bold'])

const toast = useToast()

const navItems = [
  { label: 'Overview', href: '#', icon: Home01Icon, active: true },
  {
    label: 'Product',
    items: [
      { label: 'Invoicing', href: '#', icon: SentIcon, description: 'Send and track invoices.' },
      { label: 'Inbox', href: '#', icon: InboxIcon, description: 'Everything waiting on you.' },
      { label: 'Search', href: '#', icon: Search01Icon, description: 'Find anything, fast.' },
      { label: 'Exports', href: '#', icon: Download01Icon, description: 'CSV and PDF downloads.' },
    ],
  },
  { label: 'Support', items: [{ label: 'Help centre', href: '#', icon: HelpCircleIcon, description: 'Guides and answers.' }], columns: 1 },
  { label: 'Contact', onSelect: () => toast.info('Contact clicked') },
]

// Secondary actions for the split button — each does something, rather than
// changing what the main button says.
const saveActions: DropdownMenuEntry[] = [
  { label: 'Save and send', icon: SentIcon, onSelect: () => toast.success('Saved and sent') },
  { label: 'Save as template', icon: Copy01Icon, onSelect: () => toast.success('Template saved') },
  '-',
  { label: 'Discard changes', icon: Delete02Icon, danger: true, onSelect: () => toast.danger('Changes discarded') },
]

// Nested entries — an item with `items` becomes a submenu trigger.
const rowActions: DropdownMenuEntry[] = [
  { label: 'Invoice' },
  { label: 'Open', icon: Search01Icon, onSelect: () => toast.info('Opened') },
  {
    label: 'Export as',
    icon: Download01Icon,
    items: [
      { label: 'PDF', onSelect: () => toast.success('Exported as PDF') },
      { label: 'CSV', onSelect: () => toast.success('Exported as CSV') },
      '-',
      {
        label: 'More formats',
        items: [
          { label: 'XML', onSelect: () => toast.success('Exported as XML') },
          { label: 'e-SLOG', onSelect: () => toast.success('Exported as e-SLOG') },
        ],
      },
    ],
  },
  {
    label: 'Send to',
    icon: SentIcon,
    items: [
      { label: 'Client', onSelect: () => toast.success('Sent to client') },
      { label: 'Accountant', onSelect: () => toast.success('Sent to accountant') },
      { label: 'Nobody (disabled)', disabled: true, onSelect: () => {} },
    ],
  },
  '-',
  { label: 'Delete', icon: Delete02Icon, danger: true, onSelect: () => toast.danger('Deleted') },
]

function toggleMark(mark: string) {
  marks.value = marks.value.includes(mark)
    ? marks.value.filter(m => m !== mark)
    : [...marks.value, mark]
}

const page = ref(2)
const wizardStep = ref(2)
const activeTab = ref('Overview')
const loadingBlock = ref(true)

const crumbs = [
  { label: 'Home', href: '#', icon: Home01Icon },
  { label: 'Invoices', href: '#' },
  { label: 'INV-2026-014' },
]

const { confirm } = useConfirm()
const confirmResult = ref<string | null>(null)

async function askToDelete() {
  const ok = await confirm({
    title: 'Delete this draft?',
    description: 'This cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    danger: true,
  })
  confirmResult.value = ok ? 'confirmed' : 'cancelled'
  if (ok)
    toast.success({ title: 'Draft deleted', action: { label: 'Undo', onClick: () => toast.info('Restored') } })
}

const progress = ref(35)
const taxUsed = ref(42350)
const taxLimit = 60000
const eur = new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR' })

// A hand-rolled Standard Schema validator, so the playground stays dependency-free.
const signupSchema = {
  '~standard': {
    version: 1,
    vendor: 'playground',
    validate: (value: unknown) => {
      const s = value as { email: string, password: string }
      const issues: { message: string, path: string[] }[] = []
      if (!s.email)
        issues.push({ message: 'Email is required', path: ['email'] })
      else if (!s.email.includes('@'))
        issues.push({ message: 'That doesn\'t look like an email', path: ['email'] })
      if (s.password.length < 8)
        issues.push({ message: 'Use at least 8 characters', path: ['password'] })
      return issues.length ? { issues } : { value: s }
    },
  },
}

const signup = reactive({ email: '', password: '' })
const submitted = ref<string | null>(null)

function onSignup(event: { data: typeof signup }) {
  submitted.value = JSON.stringify(event.data)
}

const email = ref('')
const bio = ref('')

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenueByMonth = months.map((label, index) => ({
  label,
  value: [4200, 4600, 4100, 5200, 5800, 5400, 6300, 6900, 6600, 7400, 8100, 8600][index]!,
}))

// Net position — some months run negative, so the axis has to span zero.
const netByMonth = months.slice(0, 6).map((label, index) => ({
  label,
  value: [1200, -450, 800, -1100, 300, 1650][index]!,
}))

// Names far too long for a vertical axis — the case horizontal exists for.
const expenseCategories = [
  { label: 'Subcontractors', value: 18400 },
  { label: 'Software licences', value: 9200 },
  { label: 'Office and utilities', value: 6100 },
  { label: 'Travel and accommodation', value: 4300 },
  { label: 'Professional services', value: 3800 },
  { label: 'Equipment', value: 2400 },
]

// Slots are pinned, so hiding one series never repaints the others.
const cashflowSeries = [
  { key: 'revenue', name: 'Revenue', slot: 0 },
  { key: 'expenses', name: 'Expenses', slot: 1 },
  { key: 'tax', name: 'Tax set aside', slot: 2 },
]
const cashflow = months.slice(0, 8).map((label, index) => ({
  label,
  revenue: [4200, 4600, 4100, 5200, 5800, 5400, 6300, 6900][index]!,
  expenses: [3100, 3300, 2900, 3600, 3900, 3700, 4100, 4400][index]!,
  tax: [880, 960, 860, 1090, 1220, 1130, 1320, 1450][index]!,
}))

// A dropped reading mid-series: the line should break, not bridge it.
const gappyByWeek = [820, 910, 880, null, null, 1040, 1120, 1080, 1190, 1240, 1210, 1284]
  .map((value, index) => ({ label: `W${index + 1}`, value }))

const weeklyVolume = Array.from({ length: 26 }, (_, index) => ({
  label: `W${index + 1}`,
  value: Math.round(400 + Math.sin(index / 2) * 180 + index * 12),
}))

// Written out in full: Tailwind scans source text, so a class name assembled
// at runtime (`text-chart-${n}`) is never generated.
const chartSlots = [
  'text-chart-1',
  'text-chart-2',
  'text-chart-3',
  'text-chart-4',
  'text-chart-5',
  'text-chart-6',
  'text-chart-7',
  'text-chart-8',
]

const revenueTrend = [4200, 4600, 4100, 5200, 5800, 5400, 6300, 6900, 6600, 7400, 8100, 8600]
const overdueTrend = [1800, 1720, 1650, 1740, 1500, 1420, 1380, 1290, 1310, 1220, 1180, 1150]
// A dropped reading mid-series: the line should break, not bridge it.
const gappyTrend = [820, 910, 880, null, null, 1040, 1120, 1080, 1190, 1240, 1210, 1284]

const logo = ref<File[]>([])
const attachments = ref<File[]>([])

const issuedOn = ref<string | null>('2026-08-15')
const period = ref({ start: '2026-08-01', end: '2026-08-31' } as { start: string | null, end: string | null })

const password = ref('')
const note = ref('')

const search = ref('')
const domain = ref('')
const debounced = ref('')
const searching = ref(false)
const terms = ref(false)
const partial = ref<boolean | 'indeterminate'>('indeterminate')
const framework = ref('vue')
const amount = ref('1234.56')
const qty = ref('1')
const plan = ref('pro')

// Combobox: a list long enough that scrolling it would be the wrong UX.
const clientId = ref('acme')
const clients = ref([
  { label: 'Acme Corp', value: 'acme' },
  { label: 'Bolt Logistics', value: 'bolt' },
  { label: 'Cirrus Systems', value: 'cirrus' },
  { label: 'Delta Retail', value: 'delta' },
  { label: 'Everest Consulting', value: 'everest' },
  { label: 'Fjord Studio (disabled)', value: 'fjord', disabled: true },
])

const groupedClient = ref('acme')
const clientGroups = [
  { label: 'Recent', items: [{ label: 'Acme Corp', value: 'acme' }, { label: 'Bolt Logistics', value: 'bolt' }] },
  { label: 'Archived', items: [{ label: 'Cirrus Systems', value: 'cirrus' }, { label: 'Delta Retail', value: 'delta' }] },
]

// 5000 rows: without `virtual` this alone would put 5000 nodes in the DOM.
const bigItem = ref('sku-0')
const bigList = Array.from({ length: 5000 }, (_, i) => ({ label: `Item ${i}`, value: `sku-${i}` }))

function addClient(name: string) {
  const value = name.toLowerCase().replace(/\s+/g, '-')
  clients.value.push({ label: name, value })
  clientId.value = value
  toast.success(`Added ${name}`)
}

function simulateLoad() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
</script>

<template>
  <IApp
    as="div"
    :theme="activeTheme"
    :unstyled="globalUnstyled"
    class="min-h-screen bg-background text-foreground transition-colors"
  >
    <main class="mx-auto max-w-2xl space-y-10 p-10">
      <header class="space-y-1">
        <h1 class="text-2xl font-bold">
          Iryx UI Playground
        </h1>
        <p class="text-muted-foreground">
          Components render below, straight from <code>packages/iryx-ui/src</code>.
        </p>
        <p class="text-muted-foreground">
          The app shell owns the viewport, so it has its own page:
          <a class="underline" href="/shell.html">/shell.html</a>.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Appearance — {{ appearance }} ({{ isDark ? 'dark' : 'light' }})
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <IButton
            v-for="mode in appearances"
            :key="mode"
            size="sm"
            :variant="appearance === mode ? 'solid' : 'outline'"
            @click="setAppearance(mode)"
          >
            {{ mode }}
          </IButton>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Navigation menu
        </h2>
        <div class="flex flex-wrap items-start gap-6">
          <INavigationMenu :items="navItems" :columns="2" label="Main" />
          <INavigationMenu :items="navItems" orientation="vertical" label="Side" class="w-48" />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Theme — {{ activeTheme }}
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <IButton
            v-for="name in presetNames"
            :key="name"
            size="sm"
            :variant="activeTheme === name ? 'solid' : 'ghost'"
            @click="pickTheme(name)"
          >
            {{ name }}
          </IButton>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          App config — global unstyled: {{ globalUnstyled }}
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="rounded-lg border border-border px-3 py-1.5 text-sm"
            @click="globalUnstyled = !globalUnstyled"
          >
            Toggle IApp :unstyled
          </button>
          <span class="text-sm text-muted-foreground">
            strips every component's classes live, via provide/inject
          </span>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Button — variants
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <IButton>Solid</IButton>
          <IButton variant="outline">
            Outline
          </IButton>
          <IButton variant="ghost">
            Ghost
          </IButton>
          <IButton variant="link">
            Link
          </IButton>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Button — icons
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <IButton>
            <HugeiconsIcon :icon="Search01Icon" data-icon="inline-start" /> Leading
          </IButton>
          <IButton variant="outline">
            Trailing <HugeiconsIcon :icon="ArrowRight01Icon" data-icon="inline-end" />
          </IButton>
          <IButton variant="outline" size="sm">
            <HugeiconsIcon :icon="Download01Icon" data-icon="inline-start" /> Download
          </IButton>
          <IButton variant="ghost">
            <HugeiconsIcon :icon="Search01Icon" data-icon="inline-start" /> Search <HugeiconsIcon :icon="ArrowRight01Icon" data-icon="inline-end" />
          </IButton>
        </div>
        <p class="text-sm text-muted-foreground">
          Mark an icon with <code>data-icon="inline-start"</code> or
          <code>"inline-end"</code> and the padding tightens on that side;
          <code>square</code> makes an icon-only button.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <IButton id="probe-text">
            Text only
          </IButton>
          <IButton id="probe-leading">
            <HugeiconsIcon :icon="Search01Icon" data-icon="inline-start" /> Leading
          </IButton>
          <IButton id="probe-trailing">
            Trailing <HugeiconsIcon :icon="ArrowRight01Icon" data-icon="inline-end" />
          </IButton>
          <IButton id="probe-both">
            <HugeiconsIcon :icon="Search01Icon" data-icon="inline-start" /> Both <HugeiconsIcon :icon="ArrowRight01Icon" data-icon="inline-end" />
          </IButton>
          <IButton id="probe-unmarked">
            <HugeiconsIcon :icon="Search01Icon" /> Unmarked
          </IButton>
          <IButton id="probe-icon" square aria-label="Search">
            <HugeiconsIcon :icon="Search01Icon" />
          </IButton>
          <IButton id="probe-icon-sm" size="sm" square variant="outline" aria-label="Search">
            <HugeiconsIcon :icon="Search01Icon" />
          </IButton>
          <IButton id="probe-icon-xl" size="xl" square variant="outline" aria-label="Search">
            <HugeiconsIcon :icon="Search01Icon" />
          </IButton>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Button — sizes &amp; states
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <IButton size="xs">
            xs
          </IButton>
          <IButton size="sm">
            sm
          </IButton>
          <IButton size="md">
            md
          </IButton>
          <IButton size="lg">
            lg
          </IButton>
          <IButton size="xl">
            xl
          </IButton>
          <IButton disabled>
            Disabled
          </IButton>
          <IButton :loading="loading" @click="simulateLoad">
            {{ loading ? 'Loading…' : 'Click to load' }}
          </IButton>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Card — variants &amp; padding
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <ICard title="Outline" description="The default — border plus background.">
            <p class="text-sm text-muted-foreground">
              Body content sits in its own slot.
            </p>
          </ICard>
          <ICard variant="soft" title="Soft" description="Muted surface, no border.">
            <p class="text-sm text-muted-foreground">
              Useful for nested or secondary panels.
            </p>
          </ICard>
        </div>
        <ICard title="With a footer" description="Header, body and footer slots.">
          <p class="text-sm text-muted-foreground">
            The header and footer are skipped entirely when unused, so a bare card
            is just a padded box.
          </p>
          <template #footer>
            <IButton size="sm">
              Save
            </IButton>
            <IButton size="sm" variant="ghost">
              Cancel
            </IButton>
          </template>
        </ICard>
        <div class="grid gap-4 sm:grid-cols-3">
          <ICard padding="sm" title="sm" />
          <ICard padding="md" title="md" />
          <ICard padding="lg" title="lg" />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Badge — variants, dot &amp; sizes
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <IBadge v-for="status in statuses" :key="status" :variant="status">
            {{ status }}
          </IBadge>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <IBadge v-for="status in statuses" :key="status" :variant="status" dot>
            {{ status }}
          </IBadge>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <IBadge variant="success" size="sm">
            sm
          </IBadge>
          <IBadge variant="success" size="md">
            md
          </IBadge>
          <IBadge variant="success" size="lg">
            lg
          </IBadge>
          <IBadge id="badge-plain" variant="info" size="lg">
            no icon
          </IBadge>
          <IBadge id="badge-icon" variant="info" size="lg">
            <HugeiconsIcon :icon="Download01Icon" data-icon="inline-start" /> with icon
          </IBadge>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Alert — variants
        </h2>
        <div class="space-y-3">
          <IAlert
            v-for="variant in alertVariants"
            :key="variant"
            :variant="variant"
            :title="`${variant} alert`"
            description="Each variant picks its own icon, and sets role=alert only when urgent."
          />
          <IAlert variant="success" description="No title — just a one-line message." />
          <IAlert
            variant="warning"
            :icon="BellIcon"
            title="Custom icon"
            description="Pass any component, or :icon=&quot;false&quot; to drop it."
          />
          <IAlert
            v-model:open="alertOpen"
            variant="info"
            title="Dismissible"
            description="v-model:open hides it — no v-if needed."
            closable
            close-label="Dismiss"
          />
          <IButton v-if="!alertOpen" size="sm" variant="outline" @click="alertOpen = true">
            Bring back the dismissed alert
          </IButton>
          <IAlert variant="danger" title="Upload failed" description="The file was larger than 10 MB.">
            <template #actions>
              <IButton size="sm" @click="toast.info('Retrying…')">
                Retry
              </IButton>
              <IButton size="sm" variant="ghost" @click="toast.info('Opened help')">
                Learn more
              </IButton>
            </template>
          </IAlert>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Banner — page-level announcements
        </h2>
        <p class="text-sm text-muted-foreground">
          Full-bleed and ambient: a labelled region, never role=alert.
        </p>
        <div class="space-y-3 overflow-hidden rounded-xl border border-border">
          <IBanner
            variant="primary"
            title="Trial ends in 3 days."
            description="Upgrade to keep your data."
            closable
          >
            <template #actions>
              <IButton size="sm" variant="outline" @click="toast.success('Upgraded')">
                Upgrade
              </IButton>
            </template>
          </IBanner>
          <IBanner
            v-for="variant in bannerVariants"
            :key="variant"
            :variant="variant"
            :icon="InformationCircleIcon"
            :description="`A ${variant} banner, spanning the full width.`"
          />
          <IBanner
            variant="neutral"
            contained
            align="center"
            description="Contained and centred — the fill still spans, the text does not."
          />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Button group
        </h2>

        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">
            Split button — the primary action stays put; the arrow opens secondary
            actions. The trailing slot takes any component, so this is a dropdown by
            choice, not by design.
          </p>
          <IButtonGroup>
            <IButton @click="toast.success('Saved')">
              Save
            </IButton>
            <IDropdownMenu :items="saveActions" align="end">
              <template #trigger>
                <IButton square aria-label="More save options">
                  <HugeiconsIcon :icon="ArrowDown01Icon" />
                </IButton>
              </template>
            </IDropdownMenu>
          </IButtonGroup>
        </div>

        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">
            Nested menus — give an entry its own <code>items</code> and it becomes a
            submenu trigger, to any depth.
          </p>
          <IDropdownMenu :items="rowActions">
            <template #trigger>
              <IButton variant="outline">
                Row actions <HugeiconsIcon :icon="ArrowDown01Icon" data-icon="inline-end" />
              </IButton>
            </template>
          </IDropdownMenu>
        </div>

        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">
            A segmented toolbar — {{ marks.length ? marks.join(', ') : 'none' }}
          </p>
          <IButtonGroup>
            <IButton
              v-for="mark in ['Bold', 'Italic', 'Underline']"
              :key="mark"
              square
              :variant="marks.includes(mark) ? 'solid' : 'outline'"
              :aria-pressed="marks.includes(mark)"
              :aria-label="mark"
              @click="toggleMark(mark)"
            >
              <HugeiconsIcon v-if="mark === 'Bold'" :icon="TextBoldIcon" />
              <HugeiconsIcon v-else-if="mark === 'Italic'" :icon="TextItalicIcon" />
              <HugeiconsIcon v-else :icon="TextUnderlineIcon" />
            </IButton>
          </IButtonGroup>
        </div>

        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">
            Size set once on the group, and mixed content — the last child is a plain link.
          </p>
          <IButtonGroup size="sm">
            <IButton variant="outline">
              Previous
            </IButton>
            <IButton variant="outline">
              Next
            </IButton>
            <a
              href="#"
              class="inline-flex h-8 items-center rounded-lg border border-border bg-background px-3 text-sm hover:bg-accent"
              @click.prevent
            >
              Plain link
            </a>
          </IButtonGroup>
        </div>

        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">
            Vertical, and block (fills the container).
          </p>
          <div class="flex flex-wrap items-start gap-6">
            <IButtonGroup orientation="vertical">
              <IButton variant="outline">
                Top
              </IButton>
              <IButton variant="outline">
                Middle
              </IButton>
              <IButton variant="outline">
                Bottom
              </IButton>
            </IButtonGroup>
            <IButtonGroup block class="max-w-xs flex-1">
              <IButton variant="outline">
                Decline
              </IButton>
              <IButton>
                Accept
              </IButton>
            </IButtonGroup>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Progress
        </h2>
        <div class="space-y-4">
          <IProgress v-model="progress" label="Upload" show-value />
          <div class="flex flex-wrap items-center gap-2">
            <IButton size="sm" variant="outline" @click="progress = Math.max(0, progress - 10)">
              −10
            </IButton>
            <IButton size="sm" variant="outline" @click="progress = Math.min(100, progress + 10)">
              +10
            </IButton>
          </div>
          <IProgress
            v-model="taxUsed"
            :max="taxLimit"
            variant="warning"
            label="Tax threshold"
            show-value
            :format-value="(value, max) => `${eur.format(value)} / ${eur.format(max)}`"
          />
          <IProgress :model-value="92" variant="danger" size="lg" label="Storage" show-value />
          <IProgress indeterminate label="Syncing…" />
          <div class="flex items-center gap-3">
            <IProgress :model-value="60" variant="success" size="sm" class="max-w-40" />
            <span class="text-sm text-muted-foreground">sm, no header</span>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Empty state
        </h2>
        <ICard>
          <IEmptyState
            :icon="InboxIcon"
            title="No invoices yet"
            description="Create your first invoice and it will show up here."
          >
            <template #actions>
              <IButton size="sm">
                New invoice
              </IButton>
              <IButton size="sm" variant="ghost">
                Import
              </IButton>
            </template>
          </IEmptyState>
        </ICard>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Dialog
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <IButton variant="outline" @click="dialogOpen = true">
            Open dialog
          </IButton>
          <IButton variant="outline" @click="blockingOpen = true">
            Open blocking dialog
          </IButton>
        </div>

        <IDialog
          v-model:open="dialogOpen"
          title="Edit invoice"
          description="Escape, the overlay and the corner button all close this."
        >
          <div class="space-y-2">
            <ILabel for="dialog-note">
              Note
            </ILabel>
            <ITextarea id="dialog-note" placeholder="Anything to add?" />
          </div>
          <template #footer="{ close }">
            <IButton variant="outline" @click="close()">
              Cancel
            </IButton>
            <IButton @click="close(); toast.success('Invoice saved')">
              Save
            </IButton>
          </template>
        </IDialog>

        <IDialog
          v-model:open="blockingOpen"
          title="Make a choice"
          description="dismissible=false — Escape and the overlay won't close this one."
          :dismissible="false"
          :show-close="false"
          size="sm"
        >
          <template #footer="{ close }">
            <IButton variant="outline" @click="close()">
              Got it
            </IButton>
          </template>
        </IDialog>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Drawer
        </h2>
        <p class="text-sm text-muted-foreground">
          Drag the panel towards its own edge to dismiss it — the handle is a hint, but the
          whole panel is the target.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <IButton variant="outline" @click="openDrawer('right')">
            Right
          </IButton>
          <IButton variant="outline" @click="openDrawer('left')">
            Left
          </IButton>
          <IButton variant="outline" @click="openDrawer('top')">
            Top
          </IButton>
          <IButton variant="outline" @click="openDrawer('bottom')">
            Bottom
          </IButton>
          <IButton variant="outline" @click="sheetOpen = true">
            Bottom sheet with snap points
          </IButton>
        </div>

        <IDrawer
          v-model:open="drawerOpen"
          :side="drawerSide"
          title="Filters"
          description="Narrow the list down to what you are looking for."
        >
          <div class="space-y-4">
            <div class="space-y-2">
              <ILabel for="drawer-search">
                Search
              </ILabel>
              <IInput id="drawer-search" placeholder="Reference or name" clearable />
            </div>
            <ICheckbox label="Unpaid only" description="Hide anything already settled." />
            <ICheckbox label="Include drafts" />
          </div>
          <template #footer="{ close }">
            <IButton variant="outline" @click="close()">
              Reset
            </IButton>
            <IButton @click="close(); toast.success('Filters applied')">
              Apply
            </IButton>
          </template>
        </IDrawer>

        <IDrawer
          v-model:open="sheetOpen"
          v-model:snap-point="sheetSnap"
          side="bottom"
          :snap-points="[0.45, 1]"
          title="Payment method"
          description="Drag the sheet up to see the whole list."
        >
          <div class="space-y-3">
            <p class="text-sm text-muted-foreground">
              Resting at snap point {{ sheetSnap }}.
            </p>
            <ICard v-for="method in ['Bank transfer', 'Card ending 4417', 'Direct debit', 'Cash']" :key="method">
              {{ method }}
            </ICard>
          </div>
        </IDrawer>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          useConfirm — {{ confirmResult ?? 'no answer yet' }}
        </h2>
        <IButton variant="outline" @click="askToDelete">
          Delete draft…
        </IButton>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          useToast
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <IButton size="sm" variant="outline" @click="toast.success('Saved')">
            success
          </IButton>
          <IButton size="sm" variant="outline" @click="toast.warning({ title: 'Almost full', description: 'You are near your plan limit.' })">
            warning
          </IButton>
          <IButton size="sm" variant="outline" @click="toast.danger({ title: 'Failed to send', description: 'Check the email address.' })">
            danger
          </IButton>
          <IButton size="sm" variant="outline" @click="toast.info('Heads up')">
            info
          </IButton>
          <IButton size="sm" variant="outline" @click="toast.toast({ title: 'Note deleted', action: { label: 'Undo', onClick: () => toast.info('Restored') } })">
            with action
          </IButton>
          <IButton size="sm" variant="outline" @click="toast.toast({ title: 'Sticky', description: 'duration 0 — stays until dismissed.', duration: 0 })">
            sticky
          </IButton>
          <IButton size="sm" variant="ghost" @click="toast.clear()">
            clear all
          </IButton>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Breadcrumb &amp; separator
        </h2>
        <IBreadcrumb :items="crumbs" />
        <ISeparator />
        <ISeparator label="or" />
        <div class="flex h-10 items-center gap-3">
          <span class="text-sm text-muted-foreground">left</span>
          <ISeparator orientation="vertical" />
          <span class="text-sm text-muted-foreground">right</span>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Stat
        </h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <ICard>
            <IStat label="Revenue" value="€12,400" :delta="12" hint="vs last month" />
          </ICard>
          <ICard>
            <IStat label="Overdue" value="€1,150" :delta="-8" trend="up" hint="down is good here" />
          </ICard>
          <ICard>
            <IStat label="Invoices" value="24" :delta="0" hint="unchanged" />
          </ICard>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Line chart
        </h2>
        <ICard>
          <ILineChart
            :data="revenueByMonth"
            variant="area"
            label="Revenue by month"
            locale="de-DE"
            :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
          />
        </ICard>

        <p class="text-sm text-muted-foreground">
          Annotations via the <code>overlay</code> slot — no plugin API, just markup
          with the layout handed to it.
        </p>
        <ICard>
          <ILineChart :data="revenueByMonth" label="Revenue against target" :height="220">
            <template #overlay="{ plot, value }">
              <line
                :x1="plot.left"
                :y1="value(7000)"
                :x2="plot.left + plot.width"
                :y2="value(7000)"
                stroke="var(--iryx-warning)"
                stroke-width="2"
                stroke-dasharray="4 4"
              />
              <text
                :x="plot.left + plot.width"
                :y="value(7000) - 6"
                text-anchor="end"
                class="fill-warning text-xs"
              >
                Target
              </text>
            </template>
          </ILineChart>
        </ICard>

        <p class="text-sm text-muted-foreground">
          Three series — legend, one crosshair, every reading in one tooltip.
        </p>
        <ICard>
          <ILineChart :data="cashflow" :series="cashflowSeries" label="Cashflow by month" :height="220" />
        </ICard>

        <p class="text-sm text-muted-foreground">
          A gap in the series, and the same data with zero forced onto the axis.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
          <ICard>
            <ILineChart :data="gappyByWeek" label="Sessions by week" :height="200" />
          </ICard>
          <ICard>
            <ILineChart :data="revenueByMonth" zero label="Revenue, axis from zero" :height="200" />
          </ICard>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Bar chart
        </h2>
        <ICard>
          <IBarChart
            :data="revenueByMonth"
            label="Revenue by month"
            locale="de-DE"
            :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
          />
        </ICard>

        <p class="text-sm text-muted-foreground">
          Horizontal — long category names get room instead of being thinned out.
        </p>
        <ICard>
          <IBarChart
            :data="expenseCategories"
            orientation="horizontal"
            label="Spend by category"
            :height="260"
            locale="de-DE"
            :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
          />
        </ICard>

        <p class="text-sm text-muted-foreground">
          Grouped series — bars split their band, and one hover reports them all.
        </p>
        <ICard>
          <IBarChart :data="cashflow" :series="cashflowSeries" label="Cashflow by month" :height="220" />
        </ICard>

        <p class="text-sm text-muted-foreground">
          Stacked — one bar per category, and the tooltip carries the total.
        </p>
        <ICard>
          <IBarChart :data="cashflow" :series="cashflowSeries" stacked label="Cashflow, stacked" :height="220" />
        </ICard>

        <p class="text-sm text-muted-foreground">
          Spanning zero, and enough categories that the labels have to thin out.
        </p>
        <div class="grid gap-4 lg:grid-cols-2">
          <ICard>
            <IBarChart :data="netByMonth" label="Net position by month" :height="200" />
          </ICard>
          <ICard>
            <IBarChart :data="weeklyVolume" label="Volume by week" :height="200" />
          </ICard>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Sparkline
        </h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <ICard>
            <IStat label="Revenue" value="€12,400" :delta="12" hint="vs last month" />
            <ISparkline
              class="mt-3"
              :data="revenueTrend"
              variant="area"
              end-dot
              label="Revenue over the last 12 months, trending up"
            />
          </ICard>
          <ICard>
            <IStat label="Overdue" value="€1,150" :delta="-8" trend="up" hint="down is good here" />
            <ISparkline class="mt-3" :data="overdueTrend" end-dot muted />
          </ICard>
          <ICard>
            <IStat label="Sessions" value="1,284" :delta="3" hint="with a gap in the data" />
            <ISparkline class="mt-3" :data="gappyTrend" variant="area" end-dot />
          </ICard>
        </div>

        <p class="text-sm text-muted-foreground">
          The eight categorical slots — identity, assigned in order, never cycled.
        </p>
        <ICard>
          <div class="grid gap-3 sm:grid-cols-4">
            <div v-for="(slot, index) in chartSlots" :key="slot" class="space-y-1">
              <ISparkline :data="revenueTrend" variant="area" end-dot :class="slot" />
              <p class="text-xs text-muted-foreground">
                chart-{{ index + 1 }}
              </p>
            </div>
          </div>
        </ICard>

        <p class="text-sm text-muted-foreground">
          Edge cases — flat, a single reading, and two pinned to a shared scale.
        </p>
        <div class="grid gap-4 sm:grid-cols-4">
          <ICard>
            <ISparkline :data="[4, 4, 4, 4, 4]" end-dot />
          </ICard>
          <ICard>
            <ISparkline :data="[7]" end-dot />
          </ICard>
          <ICard>
            <ISparkline :data="[0, 2, 1, 3]" :min="0" :max="10" end-dot />
          </ICard>
          <ICard>
            <ISparkline :data="[7, 9, 8, 10]" :min="0" :max="10" end-dot />
          </ICard>
        </div>

        <p class="text-sm text-muted-foreground">
          Stretched wide, and squeezed into a table cell — the stroke stays 2px either way.
        </p>
        <ICard>
          <ISparkline :data="revenueTrend" variant="area" :height="80" end-dot />
        </ICard>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Tabs
        </h2>
        <ITabs v-model="activeTab" :items="['Overview', 'Items', 'History']">
          <template #Overview>
            <p class="text-sm text-muted-foreground">
              The overview panel.
            </p>
          </template>
          <template #Items>
            <p class="text-sm text-muted-foreground">
              The items panel.
            </p>
          </template>
          <template #History>
            <p class="text-sm text-muted-foreground">
              The history panel.
            </p>
          </template>
        </ITabs>
        <ITabs variant="line" :items="['Line', 'Variant']">
          <template #Line>
            <p class="text-sm text-muted-foreground">
              Underlined tabs, for page-level navigation.
            </p>
          </template>
          <template #Variant>
            <p class="text-sm text-muted-foreground">
              Second panel.
            </p>
          </template>
        </ITabs>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Tooltip
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <ITooltip text="Explains a piece of jargon" arrow>
            <template #trigger>
              <IButton variant="outline" square aria-label="Help">
                <HugeiconsIcon :icon="HelpCircleIcon" />
              </IButton>
            </template>
          </ITooltip>
          <ITooltip text="Shown on the right" side="right">
            <template #trigger>
              <IButton variant="ghost">
                Hover me
              </IButton>
            </template>
          </ITooltip>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Stepper — step {{ wizardStep }}
        </h2>
        <IStepper
          v-model="wizardStep"
          :items="[
            { title: 'Details', description: 'Who it is for' },
            { title: 'Items', description: 'What you are billing' },
            { title: 'Review', description: 'Check and send' },
          ]"
        />
        <div class="flex flex-wrap items-center gap-2">
          <IButton size="sm" variant="outline" @click="wizardStep = Math.max(1, wizardStep - 1)">
            Back
          </IButton>
          <IButton size="sm" @click="wizardStep = Math.min(3, wizardStep + 1)">
            Next
          </IButton>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Pagination — page {{ page }}
        </h2>
        <IPagination v-model:page="page" :total="240" :items-per-page="10" />
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Skeleton
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <IButton size="sm" variant="outline" @click="loadingBlock = !loadingBlock">
            {{ loadingBlock ? 'Show content' : 'Show skeleton' }}
          </IButton>
        </div>
        <ICard>
          <div v-if="loadingBlock" class="flex items-center gap-4">
            <ISkeleton variant="circle" class="size-12" />
            <div class="flex-1 space-y-2">
              <ISkeleton variant="text" class="max-w-40" />
              <ISkeleton :lines="2" variant="text" />
            </div>
          </div>
          <div v-else class="flex items-center gap-4">
            <div class="flex size-12 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon :icon="InboxIcon" />
            </div>
            <div>
              <p class="font-medium">
                Acme Corp
              </p>
              <p class="text-sm text-muted-foreground">
                Two invoices outstanding.
              </p>
            </div>
          </div>
        </ICard>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Form — schema validation
        </h2>
        <IForm :state="signup" :schema="signupSchema" class="space-y-4" @submit="onSignup">
          <IFormField name="email" label="Email" required description="We'll never share it.">
            <IInput v-model="signup.email" type="email" autocomplete="email" placeholder="you@example.com" />
          </IFormField>
          <IFormField name="password" label="Password" hint="Optional hint" help="At least 8 characters.">
            <!-- `new-password`, not Chrome's suggested `current-password`: this form creates an account. -->
            <IInput v-model="signup.password" type="password" autocomplete="new-password" placeholder="••••••••" />
          </IFormField>
          <IButton type="submit">
            Create account
          </IButton>
          <p v-if="submitted" class="text-sm text-muted-foreground">
            Submitted: <code>{{ submitted }}</code>
          </p>
        </IForm>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Number input
        </h2>
        <p class="text-sm text-muted-foreground">
          The model is a decimal <em>string</em>, so precision survives. Display is
          locale-aware while the stored value stays canonical.
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <ILabel for="amount">
              Amount — sl-SI, 2dp
            </ILabel>
            <INumberInput id="amount" v-model="amount" locale="sl" :precision="2" step="0.01" min="0" />
          </div>
          <div class="space-y-2">
            <ILabel for="qty">
              Quantity — 1 to 10
            </ILabel>
            <INumberInput id="qty" v-model="qty" min="1" max="10" step="1" />
          </div>
        </div>
        <p class="text-sm text-muted-foreground">
          Stored: amount <code>{{ JSON.stringify(amount) }}</code>, quantity
          <code>{{ JSON.stringify(qty) }}</code>
        </p>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Form fields
        </h2>
        <div class="space-y-2">
          <ILabel for="email" required>
            Email
          </ILabel>
          <IInput id="email" v-model="email" type="email" placeholder="you@example.com" />
        </div>
        <div class="space-y-2">
          <ILabel for="bio">
            Bio
          </ILabel>
          <ITextarea id="bio" v-model="bio" placeholder="A few words about you…" />
        </div>
        <div class="space-y-2">
          <ILabel for="invalid">
            Invalid state
          </ILabel>
          <IInput id="invalid" invalid placeholder="Something's wrong" />
        </div>
        <div class="space-y-3">
          <ICheckbox
            v-model="terms"
            label="Accept terms"
            description="You agree to the terms of service and privacy policy."
          />
          <ICheckbox v-model="partial" label="Indeterminate" />
          <ICheckbox disabled label="Disabled" description="This option isn't available on your plan." />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Input — affixes, clearable, loading, debounce
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <ILabel for="search">
              Leading icon + clearable
            </ILabel>
            <IInput id="search" v-model="search" clearable placeholder="Search invoices…">
              <template #leading>
                <HugeiconsIcon :icon="Search01Icon" />
              </template>
            </IInput>
          </div>
          <div class="space-y-2">
            <ILabel for="domain">
              Trailing text
            </ILabel>
            <IInput id="domain" v-model="domain" placeholder="your-team">
              <template #trailing>
                <span class="text-sm">.example.com</span>
              </template>
            </IInput>
          </div>
          <div class="space-y-2">
            <ILabel for="loading-input">
              Loading
            </ILabel>
            <IInput id="loading-input" :loading="searching" placeholder="Checking availability…" />
            <ISwitch v-model="searching" label="Toggle loading" />
          </div>
          <div class="space-y-2">
            <ILabel for="debounced">
              Debounced 500ms
            </ILabel>
            <IInput id="debounced" v-model="debounced" :debounce="500" clearable placeholder="Type quickly…" />
            <p class="text-sm text-muted-foreground">
              Model: <code>{{ JSON.stringify(debounced) }}</code>
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          File upload
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <ILabel for="logo">
              Logo — images only, max 2 MB
            </ILabel>
            <IFileUpload
              id="logo"
              v-model="logo"
              accept="image/*"
              :max-size="2 * 1024 * 1024"
              label="Drag your logo here"
              browse-label="Browse images"
              hint="PNG, JPG or SVG up to 2 MB"
            />
          </div>
          <div class="space-y-2">
            <ILabel for="attachments">
              Attachments — up to 3
            </ILabel>
            <IFileUpload
              id="attachments"
              v-model="attachments"
              multiple
              :max-files="3"
              label="Drag files here"
              hint="Any file type, 3 at most"
            />
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Date picker — the model is an ISO string
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <ILabel for="issued">
              Issued on
            </ILabel>
            <IDatePicker id="issued" v-model="issuedOn" clearable />
            <p class="text-sm text-muted-foreground">
              Model: <code>{{ JSON.stringify(issuedOn) }}</code>
            </p>
          </div>
          <div class="space-y-2">
            <ILabel for="period">
              Reporting period
            </ILabel>
            <IDateRangePicker id="period" v-model="period" clearable />
            <p class="text-sm text-muted-foreground">
              Model: <code>{{ JSON.stringify(period) }}</code>
            </p>
          </div>
        </div>
        <div class="space-y-2">
          <ILabel for="deadline">
            British format, bounded to this year
          </ILabel>
          <IDatePicker
            id="deadline"
            v-model="issuedOn"
            locale="en-GB"
            min="2026-01-01"
            max="2026-12-31"
            :format="{ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }"
          />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Password + autosize
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <ILabel for="pw">
              Password with strength meter
            </ILabel>
            <IPasswordInput id="pw" v-model="password" strength placeholder="••••••••" />
          </div>
          <div class="space-y-2">
            <ILabel for="pw-plain">
              Toggle only
            </ILabel>
            <IPasswordInput id="pw-plain" placeholder="••••••••" />
          </div>
        </div>
        <div class="space-y-2">
          <ILabel for="note">
            Autosize textarea — 2 to 8 rows
          </ILabel>
          <ITextarea id="note" v-model="note" :autosize="{ min: 2, max: 8 }" placeholder="Grows as you type…" />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Select — {{ framework }}
        </h2>
        <div class="flex flex-wrap gap-4">
          <ISelect
            v-model="framework"
            class="max-w-56"
            placeholder="Pick a framework"
            :items="[
              { label: 'Vue', value: 'vue' },
              { label: 'React', value: 'react' },
              { label: 'Svelte', value: 'svelte' },
              { label: 'Angular (disabled)', value: 'angular', disabled: true },
            ]"
          />
          <ISelect
            v-model="framework"
            class="max-w-56"
            placeholder="Grouped"
            :items="[
              { label: 'Virtual DOM',
                items: [
                  { label: 'Vue', value: 'vue' },
                  { label: 'React', value: 'react' },
                ] },
              { label: 'Compiled',
                items: [
                  { label: 'Svelte', value: 'svelte' },
                  { label: 'Angular (disabled)', value: 'angular', disabled: true },
                ] },
            ]"
          />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Combobox — {{ clientId }}
        </h2>
        <div class="flex flex-wrap gap-4">
          <ICombobox
            v-model="clientId"
            class="max-w-64"
            placeholder="Search clients"
            :items="clients"
          />
          <ICombobox
            v-model="clientId"
            class="max-w-64"
            placeholder="Search or add a client"
            :items="clients"
            create
            :create-label="query => `Add “${query}”`"
            @create="addClient"
          />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Combobox groups — {{ groupedClient }}
        </h2>
        <ICombobox
          v-model="groupedClient"
          class="max-w-64"
          placeholder="Search clients"
          :items="clientGroups"
        />
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Combobox virtualized — {{ bigItem }}
        </h2>
        <p class="text-sm text-muted-foreground">
          5000 options, only the visible rows in the DOM.
        </p>
        <ICombobox
          v-model="bigItem"
          virtual
          class="max-w-64"
          placeholder="Search 5000 items"
          :items="bigList"
        />
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Radio group — {{ plan }}
        </h2>
        <IRadioGroup
          v-model="plan"
          :items="[
            { label: 'Free', value: 'free', description: 'Up to 3 projects and 1 collaborator.' },
            { label: 'Pro', value: 'pro', description: 'Unlimited projects and priority support.' },
            { label: 'Enterprise', value: 'enterprise', description: 'Talk to sales.', disabled: true },
          ]"
        />
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Switch
        </h2>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <ISwitch v-model="checked" />
            <span class="text-sm text-muted-foreground">bare — {{ checked ? 'On' : 'Off' }}</span>
          </div>
          <ISwitch
            v-model="checked"
            label="Push notifications"
            description="Send alerts to this device when something needs your attention."
          />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Table
        </h2>
        <p class="text-sm text-muted-foreground">
          Client mode — no <code>total</code>, so it sorts and pages the rows itself.
          Selected: {{ tableSelection.length }}
        </p>
        <ICard padding="none" class="overflow-hidden">
          <ITable
            v-model:selection="tableSelection"
            v-model:page="tablePage"
            :rows="invoices"
            :columns="invoiceColumns"
            :per-page="4"
            label="Invoices"
            selectable
            expandable
            striped
          >
            <template #cell-total="{ value }">
              €{{ (value as number).toFixed(2) }}
            </template>
            <template #cell-paid="{ row }">
              <IBadge :variant="row.paid ? 'success' : 'warning'">
                {{ row.paid ? 'Paid' : 'Due' }}
              </IBadge>
            </template>
            <template #expanded="{ row }">
              <div class="px-4 py-3 text-sm text-muted-foreground">
                {{ row.notes }}
              </div>
            </template>
          </ITable>
        </ICard>
        <IPagination
          v-model:page="tablePage"
          :total="invoices.length"
          :items-per-page="4"
        />
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Table — loading and empty
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <ICard padding="none" class="overflow-hidden">
            <ITable :columns="invoiceColumns.slice(0, 3)" :rows="[]" loading :loading-rows="3" label="Loading" />
          </ICard>
          <ICard padding="none" class="overflow-hidden">
            <ITable :columns="invoiceColumns.slice(0, 3)" :rows="[]" empty-text="No invoices yet." label="Empty" />
          </ICard>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-semibold">
          Headless escape hatch
        </h2>
        <IButton unstyled class="rounded-xl border-2 border-dashed border-muted-foreground px-4 py-2 hover:bg-muted">
          Fully custom button
        </IButton>
      </section>
    </main>

    <!-- Hosts for the imperative APIs; mount once, anywhere inside IApp. -->
    <IConfirmDialog />
    <IToaster />
  </IApp>
</template>
