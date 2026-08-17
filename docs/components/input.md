<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const debounced = ref('')
</script>

# Input

A text field with three sizes, an `invalid` state, affix slots, and optional clearing, loading and debouncing.

<Demo stack>
<template #demo>
<IInput v-model="value" placeholder="Reference or name" aria-label="Search" />
</template>

```vue
<IInput v-model="value" placeholder="Reference or name" />
```
</Demo>

## Sizes

<Demo stack>
<template #demo>
<IInput size="sm" placeholder="Small" aria-label="Small" />
<IInput size="md" placeholder="Medium" aria-label="Medium" />
<IInput size="lg" placeholder="Large" aria-label="Large" />
</template>

```vue
<IInput size="sm" placeholder="Small" />
<IInput size="md" placeholder="Medium" />
<IInput size="lg" placeholder="Large" />
```
</Demo>

## Affixes

The `leading` and `trailing` slots take real space in the field rather than sitting on top of it, so a long value is never hidden underneath an icon.

<Demo stack>
<template #demo>
<IInput placeholder="0.00" aria-label="Amount">
<template #leading><span class="text-muted-foreground">€</span></template>
<template #trailing><span class="text-muted-foreground text-sm">EUR</span></template>
</IInput>
</template>

```vue
<IInput placeholder="0.00">
  <template #leading>
    €
  </template>
  <template #trailing>
    EUR
  </template>
</IInput>
```
</Demo>

## Clearable and loading

`clearable` adds a clear button whenever the field is non-empty. `loading` shows a spinner in the trailing area — it does **not** disable the field, since a search that is still resolving should stay typeable.

<Demo stack>
<template #demo>
<IInput v-model="value" clearable placeholder="Type something, then clear it" aria-label="Clearable" />
<IInput loading placeholder="Searching…" aria-label="Loading" />
</template>

```vue
<IInput v-model="value" clearable />
<IInput loading />
```
</Demo>

## Debounce

`debounce` delays the *model* update, never the displayed text — typing always feels immediate. Blur and Enter flush a pending update, so a submit can't read a stale value, and an external write cancels whatever is queued.

<Demo stack>
<template #demo>
<IInput v-model="debounced" :debounce="500" placeholder="Model updates 500ms after you stop" aria-label="Debounced" />
<p class="text-sm text-muted-foreground">Model: <code>{{ debounced || '—' }}</code></p>
</template>

```vue
<IInput v-model="query" :debounce="500" />
```
</Demo>

## Invalid

<Demo stack>
<template #demo>
<IInput invalid model-value="not-an-email" aria-label="Invalid example" />
</template>

```vue
<IInput v-model="email" invalid />
```
</Demo>

Inside an `IFormField`, `invalid` is inferred from the field's own state — you rarely set it by hand.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | `v-model` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control scale |
| `invalid` | `boolean` | inherited | Error styling; inferred inside `IFormField` |
| `clearable` | `boolean` | `false` | Clear button while non-empty |
| `loading` | `boolean` | `false` | Trailing spinner. Does not disable the field |
| `debounce` | `number` | `0` | Milliseconds to wait before the model updates |
| `clearLabel` | `string` | `'Clear'` | Accessible name for the clear button |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Lands on the **wrapper**, which carries the field chrome |
| `ui` | `object` | — | `root`, `input`, `leading`, `trailing`, `clear` |

The chrome lives on a wrapper element rather than the `<input>`, which is what lets affixes take real space. `class` therefore targets the wrapper; reach the input itself with `ui.input`.

Stray attributes — `name`, `autocomplete`, `maxlength`, `aria-label` — are forwarded to the `<input>`. `ref` exposes the element as `.input` for focus management.
