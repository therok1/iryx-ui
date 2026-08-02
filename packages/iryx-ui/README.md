# iryx-ui

> An artful Vue 3 component library built on [Reka UI](https://reka-ui.com) and [Tailwind CSS v4](https://tailwindcss.com).

[![npm version](https://img.shields.io/npm/v/iryx-ui.svg)](https://www.npmjs.com/package/iryx-ui)
[![license](https://img.shields.io/npm/l/iryx-ui.svg)](https://github.com/therok1/iryx-ui/blob/main/LICENSE)

- 🎨 **Styled by default** — sensible Tailwind v4 themes via [tailwind-variants](https://www.tailwind-variants.org)
- 🌗 **Light & dark out of the box** — `useAppearance()` with `light` / `dark` / `system`, persisted
- 🌈 **Swappable themes** — built-in color presets or your own, switchable at runtime with `applyTheme()`
- 🪶 **Headless when you want** — `unstyled` per component or globally, leaving bare Reka UI primitives
- 🧩 **Composable theming** — override any slot with the `ui` prop or re-brand with CSS theme tokens
- ⚡ **Vue 3 + Nuxt** — a Vue plugin and a Nuxt module with auto-imports, from one package
- 🌳 **Tree-shakeable, ESM-only, fully typed**

## Installation

```bash
pnpm add iryx-ui
```

### Vue 3 (Vite)

```ts
import { IryxUi } from 'iryx-ui'
// main.ts
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

Components are auto-imported with the `I` prefix (configurable via the `iryxUi.prefix` option).

## Usage

```vue
<template>
  <IButton variant="outline" size="lg">
    Click me
  </IButton>
  <ISwitch v-model="enabled" />
</template>
```

### Icons

Just drop an icon component into the button alongside your text — leading, trailing, or both. Icons are sized automatically to match the button, and spaced for you. Works with any SVG icon set; [lucide-vue-next](https://lucide.dev/guide/packages/lucide-vue-next) pairs nicely:

```vue
<script setup lang="ts">
import { ArrowRight, Search } from 'lucide-vue-next'
</script>

<template>
  <IButton>
    <Search /> Search
  </IButton>
  <IButton variant="outline">
    Next <ArrowRight />
  </IButton>
</template>
```

When `loading` is set, a spinner appears in the leading position.

## The `IApp` wrapper

Wrap your app once to configure everything below it. Unlike the plugin options
(which are read at install time), `IApp`'s props are **reactive** — change them
and every component updates.

```vue
<template>
  <IApp theme="emerald" appearance="system" dir="ltr">
    <RouterView />
  </IApp>
</template>
```

It renders **no wrapper element** by default. Pass `as` (plus `class`) if you'd
rather it own your page shell:

```vue
<IApp as="div" class="min-h-screen bg-background text-foreground">
  <RouterView />
</IApp>
```

| Prop | What it does |
| --- | --- |
| `theme` | Applies a preset or custom theme, reactively. Removing it restores the defaults. |
| `appearance` | Startup `light` / `dark` / `system`. A stored user preference wins. Omit it and `IApp` won't touch dark mode at all. |
| `unstyled` | Strips built-in classes from every descendant. |
| `dir` / `locale` / `scrollBody` / `nonce` | Forwarded to Reka UI's `ConfigProvider`, so RTL and locale-aware primitives work. |

Per-component props still win over the app config, so `<IButton :unstyled="false">`
stays styled inside an `<IApp unstyled>`.

`IApp` is optional — the plugin options and `applyTheme()` / `useAppearance()`
still work on their own.

## Appearance (light / dark)

Dark mode is class-based: the `.dark` class on `<html>` flips every token.
The `useAppearance()` composable manages it for you — it persists the choice
and follows the OS preference in `system` mode:

```vue
<script setup>
import { useAppearance } from 'iryx-ui'

const { appearance, isDark, setAppearance, toggleAppearance } = useAppearance()
</script>

<template>
  <IButton variant="ghost" @click="toggleAppearance()">
    {{ isDark ? '🌙' : '☀️' }}
  </IButton>
</template>
```

You can set the startup default via the plugin or Nuxt module (a stored user
preference always wins):

```ts
app.use(createIryxUi({ appearance: 'system' }))
// nuxt.config.ts → iryxUi: { appearance: 'system' }
```

`theme.css` also registers the class-based `dark:` variant for your own
utilities (shadcn-style `@custom-variant dark`).

## Theming

Pick a built-in color preset — `violet` (default), `emerald`, `rose`,
`amber`, `sky` — at startup or at runtime:

```ts
import { applyTheme } from 'iryx-ui'

app.use(createIryxUi({ theme: 'emerald' }))
// nuxt.config.ts → iryxUi: { theme: 'emerald' }

applyTheme('rose') // runtime, e.g. from a theme picker
```

Or bring your own theme — every token can differ between light and dark:

```ts
applyTheme({
  light: { primary: 'oklch(0.55 0.2 250)', primaryForeground: 'white' },
  dark: { primary: 'oklch(0.68 0.17 250)', primaryForeground: 'oklch(0.15 0.04 250)' },
})
```

For a static re-brand, plain CSS works too — tokens are just variables:

```css
:root {
  --iryx-primary: oklch(0.65 0.2 145); /* make it green */
}
.dark {
  --iryx-primary: oklch(0.75 0.18 145);
}
```

Available tokens: `background`, `foreground`, `primary`, `primary-foreground`,
`accent`, `accent-foreground`, `muted`, `muted-foreground`, `border` — each
usable as a Tailwind color (`bg-primary`, `text-muted-foreground`, …).

Tweak a single instance with `class` (conflicts are merged smartly) or per-slot with `ui`:

```vue
<IButton class="rounded-full">
Pill button
</IButton>

<ISwitch :ui="{ thumb: 'bg-zinc-900' }" />
```

Or drop all built-in styles and take over completely:

```vue
<IButton unstyled class="my-own-button">
Headless
</IButton>
```

```ts
// …or globally:
app.use(createIryxUi({ unstyled: true }))
```

## Components

| Component | Description |
| --- | --- |
| `IApp` | Root wrapper — reactive global config, theme, appearance, RTL/locale |
| `IForm` | Validating form wrapper — any Standard Schema validator, or your own function |
| `IFormField` | Label, description, hint, help and error text around a control |
| `IButton` | Variants (`solid`, `outline`, `ghost`, `link`), five sizes, `loading` and `block` states, polymorphic via `as` / `asChild` |
| `IInput` | Text field with `sm`/`md`/`lg` sizes, `invalid` state, `v-model` |
| `ITextarea` | Multi-line field with matching sizes and `invalid` state |
| `ILabel` | Field label with optional `required` asterisk |
| `ICheckbox` | Tri-state checkbox (`true` / `false` / `'indeterminate'`), optional `label` + `description` |
| `ISelect` | Listbox with keyboard nav and typeahead, driven by an `items` array |
| `IRadioGroup` | Radio list with labels wired up automatically; items take a `description` |
| `ISwitch` | Accessible toggle, optional `label` + `description` |

Every component supports `unstyled`, a `class` override, and multi-part ones take a `ui` prop for per-slot classes. More on the way.

### Forms

```vue
<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const plan = ref('pro')
const framework = ref('vue')
</script>

<template>
  <ILabel for="email" required>
    Email
  </ILabel>
  <IInput id="email" v-model="email" type="email" placeholder="you@example.com" />

  <ILabel class="gap-2">
    <ICheckbox v-model="accepted" /> Accept terms
  </ILabel>

  <ISelect
    v-model="framework"
    placeholder="Pick one"
    :items="['Vue', 'React', { label: 'Angular', value: 'ng', disabled: true }]"
  />

  <IRadioGroup v-model="plan" :items="['free', 'pro']" />
</template>
```

`ISelect` and `IRadioGroup` accept plain strings or `{ label, value, disabled }` objects. Both also take a default slot if you'd rather compose the Reka primitives yourself.

### Validated forms

`IForm` handles client-side validation. It accepts any [Standard Schema](https://standardschema.dev) validator — Zod 3.24+, Valibot, ArkType — so Iryx doesn't depend on a validation library. Wrap each control in an `IFormField` with a `name` matching the schema path and errors wire themselves up.

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email('That doesn\'t look like an email'),
  password: z.string().min(8, 'Use at least 8 characters'),
})

const state = reactive({ email: '', password: '' })

function onSubmit(event) {
  console.log(event.data) // only fires when valid
}
</script>

<template>
  <IForm :state="state" :schema="schema" @submit="onSubmit">
    <IFormField name="email" label="Email" required description="We'll never share it.">
      <IInput v-model="state.email" type="email" />
    </IFormField>
    <IFormField name="password" label="Password" help="At least 8 characters.">
      <IInput v-model="state.password" type="password" />
    </IFormField>
    <IButton type="submit">
      Create account
    </IButton>
  </IForm>
</template>
```

The control inside a field automatically inherits its `id`, invalid styling and `aria-describedby` — no wiring needed. On a failed submit, focus moves to the first invalid control.

**Validation timing** — `validate-on` defaults to `['blur', 'change']`; submit always validates everything.

**Custom rules** — pass `validate` for anything a schema can't express (it runs alongside the schema, and works without one):

```vue
<IForm
  :state="state"
  :validate="s => s.email.endsWith('@corp.com') ? [] : [{ name: 'email', message: 'Must be a work email' }]"
/>
```

**Server errors and manual control** — grab a template ref to the form and call `validate()`, `clear(name?)` or `setErrors()`. `IFormField` also takes a plain `error` prop that bypasses validation entirely.

### Labels and descriptions

`ICheckbox` and `ISwitch` render bare by default. Give them a `label` and/or `description` and they render a wired-up layout instead — the text is clickable, and the description is linked with `aria-describedby`. `IRadioGroup` items take a `description` too.

```vue
<template>
  <ICheckbox
    v-model="accepted"
    label="Accept terms"
    description="You agree to the terms of service and privacy policy."
  />

  <ISwitch
    v-model="notify"
    label="Push notifications"
    description="Send alerts to this device."
  />

  <IRadioGroup
    v-model="plan"
    :items="[
      { label: 'Free', value: 'free', description: 'Up to 3 projects.' },
      { label: 'Pro', value: 'pro', description: 'Unlimited projects.' },
    ]"
  />
</template>
```

Use the `#label` / `#description` slots instead of the props when you need markup (a link, a badge) inside the text.

## License

[MIT](https://github.com/therok1/iryx-ui/blob/main/LICENSE)
