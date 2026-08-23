---
eyebrow: Composables
---

<script setup lang="ts">
import { useToast } from 'iryx-ui'

const toast = useToast()
</script>

# useToast

Raise a toast from anywhere — a store action, an interceptor, a plain function with no component in scope.

<Demo stack>
<template #demo>
<div class="flex flex-wrap gap-2">
<IButton size="sm" @click="toast.success('Invoice sent')">Success</IButton>
<IButton size="sm" variant="outline" @click="toast.danger({ title: 'Upload failed', description: 'The file was larger than 10 MB.' })">Danger</IButton>
<IButton size="sm" variant="outline" @click="toast.clear()">Clear all</IButton>
</div>
</template>

```ts
const toast = useToast()

toast.success('Invoice sent')
toast.danger({ title: 'Upload failed', description: 'The file was larger than 10 MB.' })
```
</Demo>

## It needs a host

The composable writes to a module-level store, and [`IToaster`](/components/toast) renders it. Mount exactly one, usually just inside `IApp`:

```vue
<template>
  <IApp>
    <RouterView />
    <IToaster />
  </IApp>
</template>
```

Because the store is module-level, `useToast()` works outside `setup()` — in a Pinia action, an Axios interceptor, a route guard.

```ts
// api.ts — no component in sight
import { useToast } from 'iryx-ui'

export async function save(invoice: Invoice) {
  try {
    await http.put(`/invoices/${invoice.id}`, invoice)
    useToast().success('Saved')
  }
  catch {
    useToast().danger('Could not save. Try again.')
  }
}
```

## API

| Method | Returns | Description |
| --- | --- | --- |
| `toast(options)` | `number` | Raise a toast; the id lets you dismiss it early |
| `success(options)` | `number` | Shorthand for `variant: 'success'` |
| `warning(options)` | `number` | |
| `danger(options)` | `number` | |
| `info(options)` | `number` | |
| `dismiss(id)` | `void` | Dismiss one toast |
| `clear()` | `void` | Dismiss every open toast |

Every method takes either a string — used as the title — or a `ToastOptions` object.

### `ToastOptions`

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string` | |
| `description` | `string` | |
| `variant` | `'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | |
| `duration` | `number` | Milliseconds before it dismisses itself |
| `action` | `{ label, onClick }` | A single button inside the toast |

## Dismissing early

`toast()` returns an id, for a toast that outlives the call — one raised while work is in flight, then replaced by its outcome:

```ts
const id = toast.toast({ title: 'Uploading…', duration: 0 })

await upload(file)

toast.dismiss(id)
toast.success('Uploaded')
```

`duration: 0` keeps it open until you dismiss it.

See [`IToaster`](/components/toast) for viewport positions, stacking and the rest of the rendering side.
