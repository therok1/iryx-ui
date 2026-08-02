<script setup lang="ts">
import type { Appearance, DropdownMenuEntry, ThemePresetName } from 'iryx-ui'
import { themes, useAppearance, useConfirm, useToast } from 'iryx-ui'
import { ArrowRight, Bell, Bold, ChevronDown, Copy, Download, Inbox, Italic, Search, Send, Trash2, Underline } from 'lucide-vue-next'
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

const checked = ref(false)
const loading = ref(false)

const statuses = ['neutral', 'success', 'warning', 'danger', 'info'] as const
const alertVariants = ['info', 'success', 'warning', 'danger'] as const
const alertOpen = ref(true)

const dialogOpen = ref(false)
const blockingOpen = ref(false)

const marks = ref<string[]>(['Bold'])

const toast = useToast()

// Secondary actions for the split button — each does something, rather than
// changing what the main button says.
const saveActions: DropdownMenuEntry[] = [
  { label: 'Save and send', icon: Send, onSelect: () => toast.success('Saved and sent') },
  { label: 'Save as template', icon: Copy, onSelect: () => toast.success('Template saved') },
  '-',
  { label: 'Discard changes', icon: Trash2, danger: true, onSelect: () => toast.danger('Changes discarded') },
]

// Nested entries — an item with `items` becomes a submenu trigger.
const rowActions: DropdownMenuEntry[] = [
  { label: 'Invoice' },
  { label: 'Open', icon: Search, onSelect: () => toast.info('Opened') },
  {
    label: 'Export as',
    icon: Download,
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
    icon: Send,
    items: [
      { label: 'Client', onSelect: () => toast.success('Sent to client') },
      { label: 'Accountant', onSelect: () => toast.success('Sent to accountant') },
      { label: 'Nobody (disabled)', disabled: true, onSelect: () => {} },
    ],
  },
  '-',
  { label: 'Delete', icon: Trash2, danger: true, onSelect: () => toast.danger('Deleted') },
]

function toggleMark(mark: string) {
  marks.value = marks.value.includes(mark)
    ? marks.value.filter(m => m !== mark)
    : [...marks.value, mark]
}

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
const terms = ref(false)
const partial = ref<boolean | 'indeterminate'>('indeterminate')
const framework = ref('vue')
const plan = ref('pro')

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
            <Search data-icon="inline-start" /> Leading
          </IButton>
          <IButton variant="outline">
            Trailing <ArrowRight data-icon="inline-end" />
          </IButton>
          <IButton variant="outline" size="sm">
            <Download data-icon="inline-start" /> Download
          </IButton>
          <IButton variant="ghost">
            <Search data-icon="inline-start" /> Search <ArrowRight data-icon="inline-end" />
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
            <Search data-icon="inline-start" /> Leading
          </IButton>
          <IButton id="probe-trailing">
            Trailing <ArrowRight data-icon="inline-end" />
          </IButton>
          <IButton id="probe-both">
            <Search data-icon="inline-start" /> Both <ArrowRight data-icon="inline-end" />
          </IButton>
          <IButton id="probe-unmarked">
            <Search /> Unmarked
          </IButton>
          <IButton id="probe-icon" square aria-label="Search">
            <Search />
          </IButton>
          <IButton id="probe-icon-sm" size="sm" square variant="outline" aria-label="Search">
            <Search />
          </IButton>
          <IButton id="probe-icon-xl" size="xl" square variant="outline" aria-label="Search">
            <Search />
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
          Badge — variants, tones &amp; sizes
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <IBadge v-for="status in statuses" :key="status" :variant="status">
            {{ status }}
          </IBadge>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <IBadge v-for="status in statuses" :key="status" :variant="status" tone="solid">
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
          <IBadge variant="info" size="lg">
            <Download /> with icon
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
            :icon="Bell"
            title="Custom icon"
            description="Pass any component, or :icon=&quot;false&quot; to drop it."
          />
          <IAlert
            v-if="alertOpen"
            variant="info"
            title="Dismissible"
            description="The close button emits an event — you decide what happens."
            closable
            close-label="Dismiss"
            @close="alertOpen = false"
          />
          <IButton v-else size="sm" variant="outline" @click="alertOpen = true">
            Bring back the dismissed alert
          </IButton>
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
                  <ChevronDown />
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
                Row actions <ChevronDown data-icon="inline-end" />
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
              <Bold v-if="mark === 'Bold'" />
              <Italic v-else-if="mark === 'Italic'" />
              <Underline v-else />
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
        <ICard padding="none">
          <IEmptyState
            :icon="Inbox"
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
          <div class="space-y-1.5">
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
          Form — schema validation
        </h2>
        <IForm :state="signup" :schema="signupSchema" class="space-y-4" @submit="onSignup">
          <IFormField name="email" label="Email" required description="We'll never share it.">
            <IInput v-model="signup.email" type="email" placeholder="you@example.com" />
          </IFormField>
          <IFormField name="password" label="Password" hint="Optional hint" help="At least 8 characters.">
            <IInput v-model="signup.password" type="password" placeholder="••••••••" />
          </IFormField>
          <IButton type="submit">
            Create account
          </IButton>
          <p v-if="submitted" class="text-sm text-muted-foreground">
            Submitted: <code>{{ submitted }}</code>
          </p>
        </IForm>
      </section>

      <section class="space-y-4">
        <h2 class="font-semibold">
          Form fields
        </h2>
        <div class="space-y-1.5">
          <ILabel for="email" required>
            Email
          </ILabel>
          <IInput id="email" v-model="email" type="email" placeholder="you@example.com" />
        </div>
        <div class="space-y-1.5">
          <ILabel for="bio">
            Bio
          </ILabel>
          <ITextarea id="bio" v-model="bio" placeholder="A few words about you…" />
        </div>
        <div class="space-y-1.5">
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

      <section class="space-y-3">
        <h2 class="font-semibold">
          Select — {{ framework }}
        </h2>
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
