---
eyebrow: Overlays
---

<script setup lang="ts">
import { useConfirm, useToast } from 'iryx-ui'
import { ref } from 'vue'

const { confirm } = useConfirm()
const toast = useToast()

const lastAnswer = ref('')

async function remove() {
  const confirmed = await confirm({
    title: 'Delete this invoice?',
    description: 'INV-1042 will be moved to the archive. This cannot be undone.',
    confirmLabel: 'Delete invoice',
    danger: true,
  })

  lastAnswer.value = confirmed ? 'confirmed' : 'cancelled'
  if (confirmed)
    toast.success('Invoice deleted')
}

async function publish() {
  if (await confirm('Publish this price list?'))
    toast.success('Price list published')
}

async function german() {
  await confirm({
    title: 'Rechnung löschen?',
    description: 'Diese Aktion kann nicht rückgängig gemacht werden.',
    confirmLabel: 'Löschen',
    cancelLabel: 'Abbrechen',
    danger: true,
  })
}
</script>

# IConfirmDialog

A promise-based confirmation for destructive actions. `confirm()` resolves `true` if the reader confirms and `false` if they cancel or dismiss.

Mount one `<IConfirmDialog />` in the app, typically just inside `<IApp>`, then call `useConfirm()` wherever you need it. This site mounts one, so the buttons below open the real thing.

<Demo stack>
<template #demo>
<IButton variant="outline" @click="remove">Delete invoice</IButton>
<p v-if="lastAnswer" class="text-sm text-muted-foreground">You {{ lastAnswer }}.</p>
</template>

```vue
<script setup lang="ts">
import { useConfirm } from 'iryx-ui'

const { confirm } = useConfirm()

async function remove(invoice) {
  const confirmed = await confirm({
    title: 'Delete this invoice?',
    description: 'INV-1042 will be moved to the archive. This cannot be undone.',
    confirmLabel: 'Delete invoice',
    danger: true,
  })

  if (confirmed)
    await api.delete(invoice.id)
}
</script>

<template>
  <IButton @click="remove(invoice)">
    Delete
  </IButton>
</template>
```
</Demo>

`danger` styles the confirming button as destructive. Use it when the action destroys something.

## The short form

A string is shorthand for `{ title }`, which is enough when the title is the whole question.

<Demo stack>
<template #demo>
<IButton variant="outline" @click="publish">Publish price list</IButton>
</template>

```vue
if (await confirm('Publish this price list?'))
  await publish()
```
</Demo>

## Labels

`confirmLabel` and `cancelLabel` are set per request, falling back to the `IConfirmDialog`'s own props. Name the action on the confirming button — "Delete invoice" rather than "OK".

<Demo stack>
<template #demo>
<IButton variant="outline" @click="german">Rechnung löschen</IButton>
</template>

```vue
<!-- fallbacks for every request -->
<IConfirmDialog confirm-label="Bestätigen" cancel-label="Abbrechen" />
```

```ts
await confirm({
  title: 'Rechnung löschen?',
  confirmLabel: 'Löschen',
  cancelLabel: 'Abbrechen',
  danger: true,
})
```
</Demo>

## One at a time

A second call supersedes the first: the earlier promise resolves `false` and its dialog is replaced.

## The API

```ts
const { confirm } = useConfirm()

const confirmed: boolean = await confirm(options)
```

`options` is a string — shorthand for the title — or:

```ts
interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Style the confirming button as destructive. */
  danger?: boolean
}
```

The store behind it is a module-level singleton, so `confirm()` can be called from a plain function with no component in scope.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `confirmLabel` | `string` | `'Confirm'` | Fallback for requests that supply none |
| `cancelLabel` | `string` | `'Cancel'` | Fallback for requests that supply none |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Dialog width; a question needs little room |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |

Mount exactly one. For anything with fields in it, or a decision that is not a yes or a no, use [`IDialog`](/components/dialog).
