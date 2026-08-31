---
layout: home
description: A Vue 3 component library built on Reka UI and Tailwind CSS v4. Accessible by default, yours to restyle.
---

<script setup lang="ts">
import { Copy01Icon, Delete02Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { applyTheme, clearTheme } from 'iryx-ui'
import { useData, withBase } from 'vitepress'
import { onUnmounted, ref } from 'vue'

const { theme } = useData()

// Nothing is persisted: the switcher is a demonstration, not a preference.
const palettes = [
  { name: 'violet', label: 'Violet', swatch: 'oklch(0.59 0.2 277)', theme: null },
  { name: 'rose', label: 'Rose', swatch: 'oklch(0.586 0.222 17)', theme: 'rose' },
]

const palette = ref('violet')

function pickPalette(entry) {
  palette.value = entry.name
  if (entry.theme === null)
    clearTheme()
  else
    applyTheme(entry.theme)
}

// Leaving the landing page should leave the rest of the docs alone.
onUnmounted(clearTheme)

const dialogOpen = ref(false)

const view = ref('board')

const viewItems = [
  { label: 'List', value: 'list' },
  { label: 'Board', value: 'board' },
  { label: 'Calendar', value: 'calendar' },
]

const rowActions = [
  { label: 'Rename', icon: PencilEdit02Icon, onSelect: () => {} },
  { label: 'Duplicate', icon: Copy01Icon, onSelect: () => {} },
  '-',
  { label: 'Delete', icon: Delete02Icon, danger: true, onSelect: () => {} },
]

// Data, not markup: written literally, the compiler parses these as elements.
const escapeHatches = [
  { note: '// merge with the built-in classes', code: '<IButton class="rounded-full" />' },
  { note: '// reach a single slot', code: '<ISelect :ui="{ content: \'w-72\' }" />' },
  { note: '// keep the primitive, drop the paint', code: '<IDialog unstyled />' },
]

const GLOW_REACH = 160

/*
 * How bright the border light gets at its peak. Applied here rather than in
 * the stylesheet: `opacity: calc(var(--glow-opacity) * 0.7)` resolves to zero
 * on a pseudo-element in Chromium.
 */
const GLOW_PEAK = 0.7

/*
 * Listened for on the whole section: `pointermove` only fires on what the
 * cursor is over, so per-card listeners went quiet in the gutters between
 * them. Written straight to style rather than through reactive state, since
 * this runs on every frame of movement across eight cards.
 */
function trackGlow(event: PointerEvent) {
  const section = event.currentTarget as HTMLElement

  for (const card of section.querySelectorAll<HTMLElement>('.home-card')) {
    const bounds = card.getBoundingClientRect()

    // Zero on the axis the cursor already overlaps, so a card lights fully
    // whenever the pointer is anywhere over it.
    const dx = Math.max(bounds.left - event.clientX, 0, event.clientX - bounds.right)
    const dy = Math.max(bounds.top - event.clientY, 0, event.clientY - bounds.bottom)
    const distance = Math.hypot(dx, dy)

    card.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`)
    card.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`)
    card.style.setProperty('--glow-opacity', `${Math.max(0, 1 - distance / GLOW_REACH) * GLOW_PEAK}`)
  }
}

function clearGlow(event: PointerEvent) {
  const section = event.currentTarget as HTMLElement
  for (const card of section.querySelectorAll<HTMLElement>('.home-card'))
    card.style.setProperty('--glow-opacity', '0')
}

const install = 'pnpm add iryx-ui'
const copied = ref(false)

async function copy() {
  /*
   * The async clipboard API is refused outright in a few real situations —
   * an unfocused document, an insecure origin, a locked-down policy — so the
   * old `execCommand` path stays as a fallback rather than the button
   * silently doing nothing.
   */
  let ok = false

  try {
    await navigator.clipboard.writeText(install)
    ok = true
  }
  catch {
    const field = document.createElement('textarea')
    field.value = install
    field.setAttribute('readonly', '')
    field.style.cssText = 'position:fixed;top:-1000px;opacity:0'
    document.body.append(field)
    field.select()
    try {
      ok = document.execCommand('copy')
    }
    catch {
      ok = false
    }
    field.remove()
  }

  if (!ok)
    return

  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}

</script>

<IContainer>

<section class="relative isolate grid gap-12 pt-16 pb-20 sm:pt-28 sm:pb-28 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-16">
 <div class="home-grid" aria-hidden="true"></div>
 <div class="flex flex-col gap-8">
 <div class="flex flex-wrap items-center gap-2">
  <span class="rounded-full border border-border px-3 py-1 font-mono text-xs tracking-[0.08em] text-muted-foreground">Vue 3</span>
  <span class="rounded-full border border-border px-3 py-1 font-mono text-xs tracking-[0.08em] text-muted-foreground">Reka UI</span>
  <span class="rounded-full border border-border px-3 py-1 font-mono text-xs tracking-[0.08em] text-muted-foreground">Tailwind v4</span>
  <span class="rounded-full border border-border px-3 py-1 font-mono text-xs tracking-[0.08em] text-muted-foreground">Nuxt module</span>
  <span class="rounded-full border border-border px-3 py-1 font-mono text-xs tracking-[0.08em] text-muted-foreground">MIT</span>
 </div>
 <h1 class="text-[clamp(2.5rem,1rem+4.2vw,4.25rem)]/[1.02] font-semibold tracking-[-0.045em] text-balance">
  Accessible by default.<br>
  <span class="font-light text-muted-foreground">Yours to restyle.</span>
 </h1>
 <p class="max-w-2xl text-lg text-muted-foreground">
  {{ theme.componentCount }} components that arrive with keyboard navigation, focus management and ARIA already working —
  then hand you a
  <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">class</code>, a per-element
  <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">ui</code>, or
  <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">unstyled</code>
  when the defaults are not what you want. No fighting the library over a border radius.
 </p>
 <div class="flex flex-wrap items-center gap-3">
  <IButton as="a" :href="withBase('/guide/installation')" size="lg">Get started</IButton>
  <IButton as="a" :href="withBase('/components/')" variant="outline" size="lg">Browse {{ theme.componentCount }} components</IButton>
 </div>
 </div>

 <div class="hero-terminal w-full max-w-xl overflow-hidden rounded-xl border border-border bg-muted/25">
  <div class="flex items-center gap-3 border-b border-border px-3.5 py-2.5">
   <span class="flex gap-1.5" aria-hidden="true">
    <span class="size-2.5 rounded-full bg-danger/70"></span>
    <span class="size-2.5 rounded-full bg-warning/70"></span>
    <span class="size-2.5 rounded-full bg-success/70"></span>
   </span>
   <span class="font-mono text-xs text-muted-foreground">setup</span>
   <button
    type="button"
    class="ms-auto flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
    :aria-label="copied ? 'Command copied' : `Copy ${install} to the clipboard`"
    @click="copy"
   >
    <svg v-if="copied" class="size-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7" /></svg>
    <svg v-else class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6.5A3.5 3.5 0 0 0 3 6.5v6A2.5 2.5 0 0 0 5.5 15" /></svg>
   </button>
  </div>
  <div class="flex flex-col gap-4 overflow-x-auto p-4 font-mono text-sm/7">
   <p class="whitespace-pre"><span class="text-muted-foreground/60 select-none">$ </span>{{ install }}</p>
   <p class="flex flex-col whitespace-pre">
    <span class="text-muted-foreground">// main.ts</span>
    <span>app.use(IryxUi)</span>
   </p>
   <p class="flex flex-col whitespace-pre">
    <span class="text-muted-foreground">/* main.css */</span>
    <span>@import "iryx-ui/theme.css";</span>
   </p>
  </div>
 </div>
</section>

<section aria-label="What the library gives you" class="pb-16 sm:pb-20" @pointermove="trackGlow" @pointerleave="clearGlow">
 <div class="grid gap-4 lg:grid-cols-3">
  <ICard padding="lg" :ui="{ body: 'flex flex-col gap-5' }" class="home-card lg:col-span-2">
   <div class="flex flex-col gap-1">
    <h2 class="text-lg font-semibold tracking-[-0.02em]">The behaviour is already done.</h2>
    <p class="text-sm text-muted-foreground">Keyboard, focus and ARIA, from Reka UI</p>
   </div>
   <div class="card-canvas flex min-h-56 flex-col justify-center gap-5 p-6">
    <div class="flex flex-wrap items-center justify-center gap-2">
     <ISelect v-model="view" :items="viewItems" aria-label="View" class="w-40" />
     <IDropdownMenu :items="rowActions">
      <template #trigger>
       <IButton variant="outline">Row actions</IButton>
      </template>
     </IDropdownMenu>
     <IButton variant="outline" @click="dialogOpen = true">Open a dialog</IButton>
     <IDialog
      v-model:open="dialogOpen"
      size="sm"
      title="Focus is trapped in here"
      description="Tab around — it cannot leave the dialog. Escape closes it and puts focus back on the button that opened it."
     >
      <template #footer="{ close }">
       <IButton variant="outline" @click="close()">Close</IButton>
      </template>
     </IDialog>
    </div>
    <p class="text-center text-sm text-muted-foreground">
     Press <IKbd keys="tab" size="xs" /> into these, then use the arrow keys, type to jump, and
     <IKbd keys="escape" size="xs" /> to close — focus lands back where it started.
    </p>
   </div>
  </ICard>
  <ICard padding="lg" :ui="{ body: 'flex flex-col gap-5' }" class="home-card">
   <div class="flex flex-col gap-1">
    <h2 class="text-lg font-semibold tracking-[-0.02em]">Three ways out.</h2>
    <p class="text-sm text-muted-foreground">class · ui · unstyled</p>
   </div>
   <div class="card-canvas flex min-h-56 items-center p-5">
    <div class="flex w-full flex-col gap-4 overflow-x-auto font-mono text-xs/6">
     <div v-for="line in escapeHatches" :key="line.code" class="flex flex-col">
      <span class="text-muted-foreground">{{ line.note }}</span>
      <span class="whitespace-pre text-foreground">{{ line.code }}</span>
     </div>
    </div>
   </div>
  </ICard>
  <ICard padding="lg" :ui="{ body: 'flex flex-col gap-5' }" class="home-card">
   <div class="flex flex-col gap-1">
    <h2 class="text-lg font-semibold tracking-[-0.02em]">Money and dates that don't drift.</h2>
    <p class="text-sm text-muted-foreground">Decimals stay exact, a date stays the day you meant</p>
   </div>
   <div class="card-canvas flex min-h-56 flex-col justify-center gap-5 p-5 font-mono text-xs">
    <div class="flex flex-col gap-1.5">
     <span class="text-muted-foreground line-through decoration-danger/70">0.1 + 0.2 → 0.30000000000000004</span>
     <span class="text-foreground">"0.10" + "0.20" → "0.30"</span>
    </div>
    <div class="flex flex-col gap-1.5">
     <span class="text-muted-foreground line-through decoration-danger/70">new Date('2026-08-15') → Aug 14</span>
     <span class="text-foreground">'2026-08-15' → 15 August</span>
    </div>
   </div>
  </ICard>
  <ICard padding="lg" :ui="{ body: 'flex flex-col gap-5' }" class="home-card lg:col-span-2">
   <div class="flex flex-col gap-1">
    <h2 class="text-lg font-semibold tracking-[-0.02em]">One set of tokens, both appearances.</h2>
    <p class="text-sm text-muted-foreground">CSS variables, and a font token you aim at your own family</p>
   </div>
   <div class="card-canvas flex min-h-56 flex-col justify-center gap-5 p-6">
    <div class="flex flex-wrap items-center gap-2">
     <button
      v-for="entry in palettes"
      :key="entry.name"
      type="button"
      class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      :class="palette === entry.name ? 'border-foreground/30 bg-background' : 'border-border text-muted-foreground hover:text-foreground'"
      :aria-pressed="palette === entry.name"
      @click="pickPalette(entry)"
     >
      <span class="size-3.5 rounded-full" :style="{ background: entry.swatch }" aria-hidden="true"></span>
      {{ entry.label }}
     </button>
     <span class="font-mono text-xs text-muted-foreground">applyTheme() — try one</span>
    </div>
    <div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
     <div class="flex flex-col gap-2"><span class="h-10 rounded-lg bg-primary"></span><span class="font-mono text-xs text-muted-foreground">primary</span></div>
     <div class="flex flex-col gap-2"><span class="h-10 rounded-lg bg-success"></span><span class="font-mono text-xs text-muted-foreground">success</span></div>
     <div class="flex flex-col gap-2"><span class="h-10 rounded-lg bg-warning"></span><span class="font-mono text-xs text-muted-foreground">warning</span></div>
     <div class="flex flex-col gap-2"><span class="h-10 rounded-lg bg-danger"></span><span class="font-mono text-xs text-muted-foreground">danger</span></div>
     <div class="flex flex-col gap-2"><span class="h-10 rounded-lg bg-muted"></span><span class="font-mono text-xs text-muted-foreground">muted</span></div>
     <div class="flex flex-col gap-2"><span class="h-10 rounded-lg border border-border bg-background"></span><span class="font-mono text-xs text-muted-foreground">background</span></div>
    </div>
    <p class="font-mono text-xs text-muted-foreground">--iryx-primary: oklch(0.59 0.2 277);</p>
   </div>
  </ICard>
 </div>
 <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <ICard :ui="{ body: 'flex h-full flex-col gap-2' }" class="home-card h-full">
   <h3 class="font-semibold tracking-[-0.01em]">Menus and lists are data</h3>
   <p class="text-sm text-muted-foreground">An <code class="font-mono text-[0.9em] text-foreground">items</code> array in, a menu out. An entry carrying its own items becomes a group.</p>
   <a :href="withBase('/components/dropdown-menu')" class="mt-auto pt-2 font-mono text-xs underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">IDropdownMenu →</a>
  </ICard>
  <ICard :ui="{ body: 'flex h-full flex-col gap-2' }" class="home-card h-full">
   <h3 class="font-semibold tracking-[-0.01em]">Validation you already have</h3>
   <p class="text-sm text-muted-foreground">Any Standard Schema validator — Zod, Valibot, ArkType — or a plain function you wrote yourself.</p>
   <a :href="withBase('/components/form')" class="mt-auto pt-2 font-mono text-xs underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">IForm →</a>
  </ICard>
  <ICard :ui="{ body: 'flex h-full flex-col gap-2' }" class="home-card h-full">
   <h3 class="font-semibold tracking-[-0.01em]">Sorting and selection, handled</h3>
   <p class="text-sm text-muted-foreground">Sorting, selection and expansion, client- or server-driven. Fetching, caching and auth stay in your data layer.</p>
   <a :href="withBase('/components/table')" class="mt-auto pt-2 font-mono text-xs underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">ITable →</a>
  </ICard>
  <ICard :ui="{ body: 'flex h-full flex-col gap-2' }" class="home-card h-full">
   <h3 class="font-semibold tracking-[-0.01em]">Charts drawn in plain SVG</h3>
   <p class="text-sm text-muted-foreground">Sparklines, bars and lines on the same tokens as everything else, rendered by the library itself.</p>
   <a :href="withBase('/components/line-chart')" class="mt-auto pt-2 font-mono text-xs underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">ILineChart →</a>
  </ICard>
 </div>
</section>

<section class="border-t border-border py-20">
 <div class="flex flex-col gap-10">
  <div class="flex flex-col gap-6">
   <p class="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">Every component</p>
   <p class="max-w-3xl text-2xl tracking-[-0.03em] text-balance">
    Buttons, forms, tables, dialogs, drawers, date pickers, charts, an app shell — each with its own page,
    its props in full, and demos you can operate.
   </p>
  </div>

  <!--
   The categories and their sizes are read off the component overview at build
   time, so this cannot drift from the pages it is counting.
  -->
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
   <a
    v-for="category in theme.categories"
    :key="category.title"
    :href="withBase(`/components/${category.anchor}`)"
    class="group flex items-baseline justify-between gap-4 rounded-xl border border-border px-4 py-3.5 transition-colors hover:border-foreground/25"
   >
    <span class="text-sm">{{ category.title }}</span>
    <span class="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">{{ category.count }}</span>
   </a>
  </div>

  <div class="flex flex-wrap items-center gap-3">
   <IButton as="a" :href="withBase('/components/')" variant="outline">Browse {{ theme.componentCount }} components</IButton>
   <IButton as="a" :href="theme.repo" target="_blank" rel="noreferrer" variant="ghost">
    Source on GitHub
   </IButton>
  </div>
 </div>
</section>

</IContainer>
