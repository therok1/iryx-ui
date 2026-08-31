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
        <IButton @click="save">
          Save
        </IButton>
      </template>
    </ICard>
  </IApp>
</template>
```

## Blocks

Whole page sections — a hero, a banded section, a framed screenshot — on their own
import path, so an app that never uses them never carries them:

```ts
import { createIryxUi } from 'iryx-ui'
import { marketingComponents } from 'iryx-ui/marketing'

app.use(createIryxUi({ components: marketingComponents }))
```

In Nuxt, the module auto-imports them once `blocks` is on:

```ts
export default defineNuxtConfig({
  modules: ['iryx-ui/nuxt'],
  iryxUi: { blocks: true },
})
```

```vue
<IHero grid heading="Invoicing that chases the money for you">
  <template #actions>
    <IButton size="lg">Start free</IButton>
  </template>
</IHero>

<ISection tone="muted" bordered heading="Everything the money side needs">
  <!-- … -->
</ISection>
```

Seven so far: `IHero`, `ISection`, `IPricingTable`, `IPricingCard`, `IFeatureCard`,
`ITestimonialCard` and `IBrowserFrame`. Importing the subpath also declares
them on Vue's `GlobalComponents`; a project that never imports it is untouched.

## Three ways to take the styling back

```vue
<!-- merge with the built-in classes -->
<IButton class="rounded-full" />

<!-- reach a single slot -->
<ISelect :ui="{ content: 'w-72' }" />

<!-- keep the primitive, drop the paint -->
<IDialog unstyled />
```

## TypeScript

The plugin registers every component under the `I` prefix, and the package declares
them on Vue's `GlobalComponents`, so their props are checked in templates without an
import. A project that passes a different `prefix` declares its own augmentation:

```ts
import type { IryxUiGlobalComponents } from 'iryx-ui'

declare module 'vue' {
  interface GlobalComponents extends IryxUiGlobalComponents {}
}
```

Every `class` prop takes the exported `ClassValue` — a string, or an array of strings
and falsy values. Object syntax is not accepted: `tailwind-merge` cannot merge it, so
it would lose to a built-in class rather than replace it.

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
