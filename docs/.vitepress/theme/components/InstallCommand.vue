<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ pkg?: string }>(), {
  pkg: 'iryx-ui',
})

const managers = {
  pnpm: (pkg: string) => `pnpm add ${pkg}`,
  npm: (pkg: string) => `npm install ${pkg}`,
  yarn: (pkg: string) => `yarn add ${pkg}`,
  bun: (pkg: string) => `bun add ${pkg}`,
} as const

type Manager = keyof typeof managers

const STORAGE_KEY = 'iryx-docs:package-manager'

const active = ref<Manager>('pnpm')
const copied = ref(false)

/*
 * Read the stored choice after mount, not during setup: there is no
 * `localStorage` on the server, and picking a tab during render would make
 * the server's markup disagree with the client's on hydration.
 */
onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in managers)
    active.value = stored as Manager
})

function select(manager: Manager) {
  active.value = manager
  localStorage.setItem(STORAGE_KEY, manager)
}

async function copy() {
  const command = managers[active.value](props.pkg)

  /*
   * The async clipboard API is refused outright in a few real situations —
   * an unfocused document, an insecure origin, a locked-down policy — so the
   * old `execCommand` path stays as a fallback rather than the button
   * silently doing nothing.
   */
  let ok = false
  try {
    await navigator.clipboard.writeText(command)
    ok = true
  }
  catch {
    const field = document.createElement('textarea')
    field.value = command
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

<template>
  <div class="my-6 overflow-hidden rounded-xl border border-border bg-muted/25">
    <div class="flex items-center gap-1 border-b border-border px-2 py-1.5">
      <button
        v-for="(_, manager) in managers"
        :key="manager"
        type="button"
        class="rounded-lg px-2.5 py-1 font-mono text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        :class="active === manager
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground'"
        :aria-pressed="active === manager"
        @click="select(manager)"
      >
        {{ manager }}
      </button>

      <button
        type="button"
        class="ms-auto flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
        :aria-label="copied ? 'Command copied' : 'Copy the install command'"
        @click="copy"
      >
        <svg v-if="copied" class="size-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7" /></svg>
        <svg v-else class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6.5A3.5 3.5 0 0 0 3 6.5v6A2.5 2.5 0 0 0 5.5 15" /></svg>
      </button>
    </div>

    <!-- `my-0`: the prose stylesheet gives every paragraph a block margin,
         which inside this box reads as a gap above the command. -->
    <p class="my-0 overflow-x-auto px-4 py-3 font-mono text-sm/7 whitespace-pre">
      <span class="text-muted-foreground/60 select-none">$ </span>{{ managers[active](props.pkg) }}
    </p>
  </div>
</template>
