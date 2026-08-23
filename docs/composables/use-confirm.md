---
eyebrow: Composables
---

<script setup lang="ts">
import { useConfirm } from 'iryx-ui'
import { ref } from 'vue'

const { confirm } = useConfirm()
const answer = ref('')

async function ask() {
  answer.value = await confirm({
    title: 'Discard this draft?',
    description: 'Nothing has been sent yet, so the draft is all there is to lose.',
    confirmLabel: 'Discard',
    danger: true,
  })
    ? 'confirmed'
    : 'cancelled'
}
</script>

# useConfirm

A confirmation you can `await`. It resolves `true` when the reader confirms and `false` when they cancel or dismiss, so a destructive action guards itself in one line.

<Demo stack>
<template #demo>
<IButton variant="outline" @click="ask">Discard draft</IButton>
<p v-if="answer" class="text-sm text-muted-foreground">You {{ answer }}.</p>
</template>

```vue
<script setup lang="ts">
import { useConfirm } from 'iryx-ui'

const { confirm } = useConfirm()

async function discard(draft) {
  if (await confirm({ title: 'Discard this draft?', danger: true }))
    await remove(draft)
}
</script>
```
</Demo>

Mount one [`IConfirmDialog`](/components/confirm-dialog) in the app, typically just inside `IApp`, and it renders whatever the store holds. The store is module-level, so `confirm()` can be called from a plain function with no component in scope — a router guard, a service, a `beforeunload` handler.

```ts
// Nothing Vue about this file, and it still works.
export async function deleteInvoice(id: string) {
  const { confirm } = useConfirm()
  if (!await confirm('Delete this invoice?'))
    return
  await api.delete(id)
}
```

## Options

A string is shorthand for `{ title }`.

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

Both labels are set per request, falling back to the `IConfirmDialog`'s own props. Name the action on the confirming button — "Delete invoice" rather than "OK".

## One at a time

A second call supersedes the first: the earlier promise resolves `false` and its dialog is replaced, so no caller is left awaiting a dialog that is no longer on screen.
