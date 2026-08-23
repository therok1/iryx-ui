---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const code = ref('')
const grouped = ref('')
const masked = ref('1234')
const short = ref('')
const sm = ref('12')
const md = ref('12')
const lg = ref('12')
const invalid = ref('9999')
const submitted = ref('')
</script>

# IPinInput

One cell per character, for a short code — two-factor, an email confirmation, a door PIN. For anything longer or free-form, use a plain [`IInput`](/components/input).

<Demo stack>
<template #demo>
<IPinInput v-model="code" otp />
<p class="text-sm text-muted-foreground">Value: {{ code || '—' }}</p>
</template>

```vue
<script setup lang="ts">
const code = ref('')
</script>

<template>
  <IPinInput v-model="code" otp />
</template>
```
</Demo>

## The model is a string

The cells are joined for you, so the model holds the code as it appears everywhere else in the app.

```ts
const code = ref('') // → '123456', not ['1','2','3','4','5','6']
```

## Completion

`complete` fires the moment the last cell is filled — the natural point to submit.

<Demo stack>
<template #demo>
<IPinInput v-model="short" :length="4" @complete="v => (submitted = v)" />
<p class="text-sm text-muted-foreground">Submitted: {{ submitted || '—' }}</p>
</template>

```vue
<IPinInput v-model="code" :length="4" @complete="verify" />
```
</Demo>

## Grouping

`group-size` breaks a long code into chunks, which makes it easier to check against the one the reader is copying.

<Demo stack>
<template #demo>
<IPinInput v-model="grouped" :length="6" :group-size="3" />
</template>

```vue
<IPinInput v-model="code" :length="6" :group-size="3" />
```
</Demo>

The separator defaults to an en dash. Pass `separator` for something else, or use the `separator` slot for a custom element.

## Masked

`mask` renders each entry as a dot, for a PIN the reader is expected to keep.

<Demo stack>
<template #demo>
<IPinInput v-model="masked" :length="4" mask type="number" />
</template>

```vue
<IPinInput v-model="pin" :length="4" mask type="number" />
```
</Demo>

## Autofill

Set `otp` and the cells advertise themselves as a one-time code, so a phone can offer the code straight from the SMS that carried it.

```vue
<IPinInput v-model="code" otp />
```

## Sizes

<Demo stack>
<template #demo>
<IPinInput v-model="sm" :length="4" size="sm" />
<IPinInput v-model="md" :length="4" size="md" />
<IPinInput v-model="lg" :length="4" size="lg" />
</template>

```vue
<IPinInput v-model="code" :length="4" size="sm" />
<IPinInput v-model="code" :length="4" size="md" />
<IPinInput v-model="code" :length="4" size="lg" />
```
</Demo>

## Invalid

<Demo stack>
<template #demo>
<IPinInput v-model="invalid" :length="4" invalid />
<p class="text-sm text-red-500">That code has expired.</p>
</template>

```vue
<IPinInput v-model="code" :length="4" invalid />
<p class="text-red-500">That code has expired.</p>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | The code, as a plain string |
| `length` | `number` | `6` | How many cells |
| `type` | `'text' \| 'number'` | `'text'` | `number` gets the numeric keypad and rejects non-digits |
| `mask` | `boolean` | `false` | Render entries as dots |
| `otp` | `boolean` | `false` | Advertise the field for one-time-code autofill |
| `placeholder` | `string` | — | Character shown in an empty cell |
| `groupSize` | `number` | — | Separator after every N cells |
| `separator` | `string` | `'–'` | What that separator shows |
| `disabled` | `boolean` | `false` | |
| `invalid` | `boolean` | `false` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, input?, separator? }` | — | Per-slot class overrides |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | On every change |
| `complete` | `string` | Once every cell is filled |

## Slots

| Slot | Description |
| --- | --- |
| `separator` | Replaces the separator between groups |

## Accessibility

Each cell names its own position — "pin input 3 of 6". Typing advances to the next cell, Backspace steps back, arrow keys move between cells, and pasting a whole code fills the row in one go. The separators are hidden from assistive technology.
