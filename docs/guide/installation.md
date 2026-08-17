# Installation

```bash
pnpm add iryx-ui
```

Tailwind CSS v4 is required. The library ships no CSS bundle — `theme.css` declares the tokens and points Tailwind at the package so your build generates only the utilities you actually use.

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

Prefer importing components directly if you'd rather not register 42 of them globally — the build is per-module, so only what you import is bundled:

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

```vue
<template>
  <IButton variant="outline" size="lg">
    Click me
  </IButton>
  <ISwitch v-model="enabled" />
</template>
```

<Demo title="The above, rendered">
<template #demo>
<IButton variant="outline" size="lg">Click me</IButton>
<ISwitch />
</template>

```vue
<IButton variant="outline" size="lg">
  Click me
</IButton>
<ISwitch v-model="enabled" />
```
</Demo>

## Typeface

The library ships no webfont — that would put font files, a licence and a network request into every consumer's bundle. It reads `--iryx-font-sans` instead, which defaults to the system stack:

```css
:root {
  --iryx-font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Next: [theming](/guide/theming).
