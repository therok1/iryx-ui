<script setup lang="ts">
import type { Appearance, ThemePresetName } from 'iryx-ui'
import { themes, useAppearance } from 'iryx-ui'
import { ArrowRight, Bell, Download, Search } from 'lucide-vue-next'
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
            <Search /> Leading
          </IButton>
          <IButton variant="outline">
            Trailing <ArrowRight />
          </IButton>
          <IButton variant="outline" size="sm">
            <Download /> Download
          </IButton>
          <IButton variant="ghost">
            <Search /> Search <ArrowRight />
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
            close-label="Zapri"
            @close="alertOpen = false"
          />
          <IButton v-else size="sm" variant="outline" @click="alertOpen = true">
            Bring back the dismissed alert
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
  </IApp>
</template>
