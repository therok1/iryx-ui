---
eyebrow: Guide
description: Install Iryx UI in a Vue 3 or Nuxt app, wire up Tailwind CSS v4, and register the components globally or one at a time.
---

# Installation

<InstallCommand />

Tailwind CSS v4 is required. Importing `theme.css` alongside it brings in the tokens and points Tailwind's scanner at the package.

## Vue 3 with Vite

```ts
// main.ts
import { IryxUi } from 'iryx-ui'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(IryxUi).mount('#app')
```

```css
/* main.css */
@import "tailwindcss";
@import "iryx-ui/theme.css";
```

The plugin registers every component globally under the `I` prefix. Pass options to change it:

```ts
import { createIryxUi } from 'iryx-ui'

app.use(createIryxUi({ prefix: 'Ui', appearance: 'system', theme: 'violet' }))
```

If you prefer local imports, import components directly instead. The build is per-module, so only what you import is bundled:

```vue
<script setup lang="ts">
import { Button, Switch } from 'iryx-ui'
</script>
```

## Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['iryx-ui/nuxt'],
})
```

```css
/* assets/css/main.css */
@import "tailwindcss";
@import "iryx-ui/theme.css";
```

Components are auto-imported with the `I` prefix. Configure the module under the `iryxUi` key:

```ts
export default defineNuxtConfig({
  modules: ['iryx-ui/nuxt'],
  iryxUi: {
    prefix: 'I',
    unstyled: false,
    appearance: 'system',
    theme: 'violet',
  },
})
```

## First component

<Demo>
<template #demo>
<IButton variant="outline" size="lg">Click me</IButton>
<ISwitch label="Send reminders" />
</template>

```vue
<IButton variant="outline" size="lg">
  Click me
</IButton>
<ISwitch v-model="enabled" label="Send reminders" />
```
</Demo>

## TypeScript

Components are registered globally under the `I` prefix and declared on Vue's `GlobalComponents`, so their props are type-checked in templates with no import and no extra setup.

If you pass a different `prefix` to `createIryxUi()`, declare your own augmentation instead:

```ts
import type { IryxUiGlobalComponents } from 'iryx-ui'

declare module 'vue' {
  interface GlobalComponents extends IryxUiGlobalComponents {}
}
```

Every `class` prop takes the exported `ClassValue` — a string, or an array of strings and falsy values, so `:class="[base, active && 'ring-2']"` type-checks. Object syntax is deliberately excluded: `tailwind-merge` cannot merge it, so it would lose to a built-in class rather than replace it.

## Typeface

Typography follows the `--iryx-font-sans` token, which defaults to the system stack. Load any family you like and point the token at it:

```css
:root {
  --iryx-font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Next: [theming](/guide/theming).
