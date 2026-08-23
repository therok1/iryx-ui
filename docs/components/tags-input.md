---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const topics = ref(['design', 'accessibility'])
const recipients = ref(['ana@example.com'])
const limited = ref(['one', 'two'])
const clearable = ref(['draft', 'urgent'])
const sm = ref(['small'])
const md = ref(['medium'])
const lg = ref(['large'])
const invalid = ref(['not-an-email'])
const rejected = ref('')
const dupes = ref(['design'])
</script>

# ITagsInput

A field that collects a list — labels on an issue, recipients on a message, skills on a profile. Each entry becomes a tag that can be removed on its own.

<Demo stack>
<template #demo>
<ITagsInput v-model="topics" placeholder="Add a topic" aria-label="Topics" class="max-w-md" />
<p class="text-sm text-muted-foreground">{{ topics.length }} tag(s): {{ topics.join(', ') || '—' }}</p>
</template>

```vue
<script setup lang="ts">
const topics = ref(['design', 'accessibility'])
</script>

<template>
  <ITagsInput v-model="topics" placeholder="Add a topic" aria-label="Topics" />
</template>
```
</Demo>

Press Enter to commit a tag, Backspace on an empty field to remove the last one.

## Committing a tag

Enter always commits. Three props add the other moments a reader expects a tag to be taken:

- `add-on-blur` — commit what is typed when focus leaves, rather than discarding it.
- `add-on-tab` — commit when Tab moves focus along.
- `add-on-paste` — split a pasted string on the delimiter instead of taking it as one tag.

<Demo stack>
<template #demo>
<ITagsInput
  v-model="recipients"
  placeholder="Paste a list of addresses"
  aria-label="Recipients"
  add-on-paste
  add-on-blur
  class="max-w-md"
/>
</template>

```vue
<ITagsInput
  v-model="recipients"
  placeholder="Paste a list of addresses"
  aria-label="Recipients"
  add-on-paste
  add-on-blur
/>
```
</Demo>

The delimiter is a comma by default, so pasting a comma-separated list does the obvious thing. Pass `delimiter` for something else — a string or a regular expression.

## Duplicates

Refused by default. The attempt still emits `invalid-tag`, so you can say why; `duplicate` allows them.

<Demo stack>
<template #demo>
<ITagsInput
  v-model="dupes"
  placeholder="Try adding “design” again"
  aria-label="Tags"
  class="max-w-md"
  @invalid-tag="v => (rejected = v)"
/>
<p class="text-sm text-muted-foreground">Rejected: {{ rejected || '—' }}</p>
</template>

```vue
<ITagsInput
  v-model="tags"
  placeholder="Try adding “design” again"
  aria-label="Tags"
  @invalid-tag="tag => notify(`${tag} is already there`)"
/>

<!-- or allow them -->
<ITagsInput v-model="tags" duplicate />
```
</Demo>

## A maximum

Past `max` the input goes read-only rather than disappearing, so the field keeps its label and its focus target.

<Demo stack>
<template #demo>
<ITagsInput v-model="limited" :max="2" aria-label="Limited tags" class="max-w-md" />
<p class="text-sm text-muted-foreground">Remove one to type again.</p>
</template>

```vue
<ITagsInput v-model="tags" :max="2" aria-label="Limited tags" />
```
</Demo>

## Clearable

<Demo stack>
<template #demo>
<ITagsInput v-model="clearable" clearable aria-label="Clearable tags" class="max-w-md" />
</template>

```vue
<ITagsInput v-model="tags" clearable aria-label="Clearable tags" />
```
</Demo>

## Sizes

The field and its tags scale together.

<Demo stack>
<template #demo>
<ITagsInput v-model="sm" size="sm" aria-label="Small" class="max-w-md" />
<ITagsInput v-model="md" size="md" aria-label="Medium" class="max-w-md" />
<ITagsInput v-model="lg" size="lg" aria-label="Large" class="max-w-md" />
</template>

```vue
<ITagsInput v-model="tags" size="sm" aria-label="Small" />
<ITagsInput v-model="tags" size="md" aria-label="Medium" />
<ITagsInput v-model="tags" size="lg" aria-label="Large" />
```
</Demo>

## Invalid

<Demo stack>
<template #demo>
<ITagsInput v-model="invalid" invalid aria-label="Recipients" class="max-w-md" />
<p class="text-sm text-red-500">One of those is not an email address.</p>
</template>

```vue
<ITagsInput v-model="recipients" invalid aria-label="Recipients" />
<p class="text-red-500">One of those is not an email address.</p>
```
</Demo>

Inside an [`IFormField`](/components/form-field) the invalid state, the id and the error's `aria-describedby` are inherited.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string[]` | `[]` | |
| `placeholder` | `string` | — | |
| `max` | `number` | — | Stop accepting tags past this many |
| `delimiter` | `string \| RegExp` | `','` | What ends a tag, and what a paste is split on |
| `duplicate` | `boolean` | `false` | Allow the same tag twice |
| `addOnPaste` | `boolean` | `false` | Split a pasted string into tags |
| `addOnTab` | `boolean` | `false` | Commit the typed text on Tab |
| `addOnBlur` | `boolean` | `false` | Commit the typed text when focus leaves |
| `clearable` | `boolean` | `false` | Show a control that empties the field |
| `disabled` | `boolean` | `false` | |
| `invalid` | `boolean` | — | Inherited from `IFormField` when unset |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, tag?, tagText?, tagDelete?, input?, clear? }` | — | Per-slot class overrides |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string[]` | |
| `addTag` | `string` | A tag was added |
| `removeTag` | `string` | A tag was removed |
| `invalidTag` | `string` | A tag was refused — a duplicate, or one past `max` |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `tag` | `{ tag }` | Replaces a tag's contents, including its delete control |
| `clear` | — | Replaces the clear control's contents |

## Accessibility

The name you give the field lands on the `<input>`, and each tag's delete control is named after the tag it removes — "Remove design". Arrow keys move between committed tags, and Backspace from an empty input selects the last one before removing it.

The field grows as tags wrap onto new lines rather than scrolling them out of sight.
