<script setup lang="ts">
import { useAppearance } from 'iryx-ui'

const { toggleAppearance } = useAppearance()
</script>

# Theming

Every colour, radius and font in the library resolves to a CSS variable under the `--iryx-` prefix. There is no plugin, no config file and no build step involved — changing a token at runtime restyles the app immediately.

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

If you server-render, set the class before first paint or dark-mode readers get a white flash on every navigation. These docs do it with a small inline script that reads the same storage key:

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
