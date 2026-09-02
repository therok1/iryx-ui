---
eyebrow: Guide
---

<script setup lang="ts">
import { useAppearance } from 'iryx-ui'
import { ref } from 'vue'

const { toggleAppearance } = useAppearance()

const radius = ref('0.5rem')
</script>

# Theming

Every colour, radius and font in the library resolves to a CSS variable under the `--iryx-` prefix. Change one at runtime and the app restyles immediately.

## Presets

Two colour presets ship with the library: `violet` (the default) and `rose`.

```ts
import { applyTheme, createIryxUi } from 'iryx-ui'

app.use(createIryxUi({ theme: 'rose' }))

applyTheme('rose') // or at runtime, from a theme picker
```

## Your own theme

Every token can differ between light and dark:

```ts
applyTheme({
  light: { primary: 'oklch(0.55 0.2 250)', primaryForeground: 'white' },
  dark: { primary: 'oklch(0.68 0.17 250)', primaryForeground: 'oklch(0.15 0.04 250)' },
})
```

For a static re-brand, plain CSS is enough — the tokens are only variables:

```css
:root {
  --iryx-primary: oklch(0.65 0.2 145); /* make it green */
}

.dark {
  --iryx-primary: oklch(0.75 0.18 145);
}
```

## Radius

`--iryx-radius` is `rounded-lg`, and the rest of Tailwind's radius scale is derived from it. Set it once and every corner in the app follows; `rounded-full` stays a pill.

```css
:root {
  --iryx-radius: 0; /* square */
  --iryx-radius: 1rem; /* soft */
}
```

`applyTheme` takes it too, alongside the colours or on its own:

```ts
applyTheme({ radius: '0' })
applyTheme({ radius: '1rem', light: { primary: 'oklch(0.65 0.2 145)' } })
```

<Demo title="Set on a wrapper here, so only this box changes">
<template #demo>
<div class="w-full" :style="{ '--iryx-radius': radius }">
<div class="flex flex-wrap justify-center gap-2">
<IButton v-for="value in ['0', '0.5rem', '1rem']" :key="value" :variant="radius === value ? 'solid' : 'outline'" size="sm" @click="radius = value">
{{ value === '0' ? 'Square' : value }}
</IButton>
</div>
<ICard class="mt-4" padding="lg">
<div class="flex flex-wrap items-center gap-3">
<IBadge>Badge</IBadge>
<IInput placeholder="Input" class="w-40" />
<IButton size="sm">Button</IButton>
<IAvatar name="Rae Ellis" />
</div>
</ICard>
</div>
</template>

```vue
<div :style="{ '--iryx-radius': radius }">
  <!-- … -->
</div>
```
</Demo>

## Light and dark

`useAppearance()` owns the `dark` class on `<html>` and persists the choice to `localStorage`. `system` follows the operating system and reacts to changes live.

<Demo title="The toggle in this site's header uses exactly this">
<template #demo>
<IButton variant="outline" @click="toggleAppearance()">Toggle appearance</IButton>
</template>

```vue
<script setup lang="ts">
import { useAppearance } from 'iryx-ui'

const { isDark, appearance, setAppearance, toggleAppearance } = useAppearance()
</script>

<template>
  <IButton variant="outline" @click="toggleAppearance()">
    Toggle appearance
  </IButton>
</template>
```
</Demo>

The class is applied with transitions suppressed for one frame. Without that, the light and dark border tokens — opaque grey against white at 10% alpha — interpolate through a near-white translucent border, which reads as a flash around every bordered element on the page.

If you server-render, set the class before first paint — otherwise anyone on the dark theme gets a white flash on every navigation. These docs do it with a small inline script that reads the same storage key:

```ts
head: [
  ['script', {}, `(() => {
    try {
      const stored = localStorage.getItem('iryx-ui:appearance') ?? 'system'
      const dark = stored === 'dark' || (stored === 'system'
        && window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.toggle('dark', dark)
    } catch {}
  })()`],
]
```

## Status colour goes in the mark, never the surface

Alerts, toasts and badges use neutral chrome. The colour lives in the badge's dot, the alert's icon, the stat's delta — not in the background.

This is deliberate. A saturated surface shouts before it is read, and several of them in one view stack into a traffic light nobody can parse. `IProgress` is the one exception, because its coloured bar *is* the data rather than decoration.

<Demo stack>
<template #demo>
<IAlert variant="warning" title="Payment overdue" description="This invoice was due 14 days ago." />
<div class="flex flex-wrap gap-2">
<IBadge variant="success" dot>Paid</IBadge>
<IBadge variant="warning" dot>Pending</IBadge>
<IBadge variant="danger" dot>Overdue</IBadge>
</div>
</template>

```vue
<IAlert variant="warning" title="Payment overdue" description="…" />

<IBadge variant="success" dot>Paid</IBadge>
<IBadge variant="warning" dot>Pending</IBadge>
<IBadge variant="danger" dot>Overdue</IBadge>
```
</Demo>

## Unstyled

`unstyled` drops every built-in class and keeps the behaviour, per component or globally:

```vue
<IButton unstyled class="my-own-button">
  Headless
</IButton>
```

```ts
app.use(createIryxUi({ unstyled: true }))
```

## Motion

Every animation and transition in the library shortens to almost nothing when the reader's system asks for reduced motion. The guard ships in `theme.css`, so importing it is the whole setup: the preference is set once, for everything.

```css
@import "tailwindcss";
@import "iryx-ui/theme.css"; /* the guard comes with it */
```

Shortened rather than removed, and the difference matters. Reka unmounts a dialog, drawer, popover or toast when its exit animation raises `animationend`; with `animation: none` that event never fires, so the overlay stays mounted forever with nothing on screen to close. A `0.01ms` duration finishes imperceptibly and still fires the event.

The two looping indicators are handled separately, because "run once, instantly" leaves an animation wherever its last keyframe lands. The indeterminate [`IProgress`](/components/progress) bar travels past the end of its own track, so it is parked at the start instead; [`ITable`](/components/table)'s loading bar becomes a steady rule. Both still read as busy without moving.

If you animate your own components, the same rule is worth following — shorten, don't remove, anything an unmount is waiting on.
