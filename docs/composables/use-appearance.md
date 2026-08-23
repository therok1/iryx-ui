---
eyebrow: Composables
---

<script setup lang="ts">
import { useAppearance } from 'iryx-ui'

const { appearance, isDark, setAppearance, toggleAppearance } = useAppearance()
</script>

# useAppearance

Light, dark, or follow the system — persisted, and applied as the `dark` class on `<html>`. This site's own theme toggle is this composable; the buttons below drive the page you are reading.

<Demo stack>
<template #demo>
<div class="flex flex-wrap items-center gap-2">
<IButton size="sm" :variant="appearance === 'light' ? 'solid' : 'outline'" @click="setAppearance('light')">Light</IButton>
<IButton size="sm" :variant="appearance === 'dark' ? 'solid' : 'outline'" @click="setAppearance('dark')">Dark</IButton>
<IButton size="sm" :variant="appearance === 'system' ? 'solid' : 'outline'" @click="setAppearance('system')">System</IButton>
<IButton size="sm" variant="ghost" @click="toggleAppearance()">Toggle</IButton>
</div>
<p class="font-mono text-xs text-muted-foreground">appearance: {{ appearance }} · isDark: {{ isDark }}</p>
</template>

```vue
<script setup lang="ts">
import { useAppearance } from 'iryx-ui'

const { appearance, isDark, setAppearance, toggleAppearance } = useAppearance()
</script>

<template>
  <IButton variant="ghost" @click="toggleAppearance()">
    {{ isDark ? 'Dark' : 'Light' }}
  </IButton>
</template>
```
</Demo>

| Returned | Type | |
| --- | --- | --- |
| `appearance` | `Ref<'light' \| 'dark' \| 'system'>` | The chosen mode, writable |
| `isDark` | `ComputedRef<boolean>` | What that resolves to right now |
| `setAppearance(value)` | fn | Set the mode |
| `toggleAppearance()` | fn | Flips between light and dark from the *effective* mode |

`system` follows `prefers-color-scheme` live — change it in the OS while the page is open and the class flips without a reload.

## Persistence

The choice is stored under `iryx-ui:appearance` and a stored preference always beats the startup default from the plugin or `IApp`. To avoid a flash of the wrong theme, set the class before first paint — a watcher runs after hydration, which is long enough for a dark-mode reader to get a full white screen on every navigation:

```ts
// index.html, or a Nuxt/VitePress head script
;(() => {
  try {
    const stored = localStorage.getItem('iryx-ui:appearance') ?? 'system'
    const dark = stored === 'dark'
      || (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }
  catch {}
})()
```

Read the same key the composable writes, so the two can never disagree.

## Switching without a flash

Transitions are suppressed for the duration of a switch and restored immediately afterwards, so the border tokens do not visibly interpolate on the way between themes. Nothing is needed on your side.

## Server rendering

Nothing here touches `localStorage`, `matchMedia` or `document` on the server, so `isDark` is always `false` in server-rendered markup. Two things follow from that.

**A flash of the wrong theme**, because the class lands after hydration. The pre-paint script above is the fix.

**A hydration mismatch, if you branch on `isDark`** — the server sent the light branch, and the first client render can already say dark. Render both and let CSS choose:

```vue
<template>
  <SunIcon class="dark:hidden" />
  <MoonIcon class="hidden dark:block" />
</template>
```

Or hold the branch back until mounted, which is what this site's own toggle does:

```vue
<script setup lang="ts">
const mounted = ref(false)
onMounted(() => (mounted.value = true))
</script>

<template>
  <span v-if="!mounted" class="size-4" />
  <MoonIcon v-else-if="isDark" />
  <SunIcon v-else />
</template>
```

Give the placeholder the same size as the icon it stands in for, or the layout shifts on hydration.
