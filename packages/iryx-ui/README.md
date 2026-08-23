# iryx-ui

A Vue 3 component library built on [Reka UI](https://reka-ui.com) and [Tailwind CSS v4](https://tailwindcss.com). Accessible by default, yours to restyle.

[![npm version](https://img.shields.io/npm/v/iryx-ui.svg)](https://www.npmjs.com/package/iryx-ui)
[![license](https://img.shields.io/npm/l/iryx-ui.svg)](https://github.com/therok1/iryx-ui/blob/main/LICENSE)

**[Documentation →](https://iryx-ui.com)**

Every component arrives with keyboard navigation, focus management and ARIA already working, then hands you a `class`, a per-slot `ui`, or `unstyled` when the defaults are not what you want.

## Installation

```bash
pnpm add iryx-ui
```

`npm install`, `yarn add` and `bun add` work the same — it is one package on npm.

### Vue 3

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

### Nuxt

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

Components are auto-imported with the `I` prefix.

## Usage

```vue
<template>
  <IApp appearance="system">
    <ICard>
      <IFormField label="Email" description="We'll never share it.">
        <IInput v-model="email" type="email" placeholder="you@example.com" />
      </IFormField>

      <template #footer>
        <IButton @click="save">Save</IButton>
      </template>
    </ICard>
  </IApp>
</template>
```

## Three ways to take the styling back

```vue
<!-- merge with the built-in classes -->
<IButton class="rounded-full" />

<!-- reach a single slot -->
<ISelect :ui="{ content: 'w-72' }" />

<!-- keep the primitive, drop the paint -->
<IDialog unstyled />
```

## Requirements

- Vue 3.5 or newer
- Tailwind CSS v4

Ships as ESM with full type definitions. Every component renders on the server.

## Documentation

Every component and composable has its own page, with the props in full and demos you can operate:

- [Components](https://iryx-ui.com/components/)
- [Composables](https://iryx-ui.com/composables/)
- [Theming](https://iryx-ui.com/guide/theming)

## License

[MIT](https://github.com/therok1/iryx-ui/blob/main/LICENSE)
