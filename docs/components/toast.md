---
eyebrow: Feedback
---

<script setup lang="ts">
import { useToast } from 'iryx-ui'

const { toast, success, warning, danger, info, dismiss, clear } = useToast()

let restored = 0

function undo() {
  restored += 1
  success(`Invoice restored (${restored})`)
}
</script>

# IToaster

Transient notifications, raised from anywhere — including plain functions outside a component's setup.

Mount one `<IToaster />` in the app, typically just inside `<IApp>`, then call `useToast()` wherever you need it. This site mounts one, so every button below raises a real toast.

<Demo stack>
<template #demo>
<IButton variant="outline" @click="toast('Draft saved')">Raise a toast</IButton>
</template>

```vue
<script setup lang="ts">
import { useToast } from 'iryx-ui'

const { toast } = useToast()
</script>

<template>
  <IButton variant="outline" @click="toast('Draft saved')">
    Save
  </IButton>
</template>
```
</Demo>

A string is shorthand for `{ title }`. Pass an object for anything more.

## Variants

Five of them, with the colour in the icon rather than the surface, as in [`IAlert`](/components/alert) and [`IBadge`](/components/badge).

<Demo stack>
<template #demo>
<div class="flex flex-wrap justify-center gap-2">
<IButton size="sm" variant="outline" @click="toast({ title: 'Draft saved', variant: 'neutral' })">Neutral</IButton>
<IButton size="sm" variant="outline" @click="success({ title: 'Invoice sent', description: 'INV-1042 went to billing@example.com' })">Success</IButton>
<IButton size="sm" variant="outline" @click="warning({ title: 'Payment overdue', description: 'Three invoices passed their due date.' })">Warning</IButton>
<IButton size="sm" variant="outline" @click="danger({ title: 'Upload failed', description: 'The connection dropped before the file finished.' })">Danger</IButton>
<IButton size="sm" variant="outline" @click="info({ title: 'New version available', description: 'Reload to pick up 1.4.0.' })">Info</IButton>
</div>
</template>

```vue
toast({ title: 'Draft saved', variant: 'neutral' })
success({ title: 'Invoice sent', description: 'INV-1042 went to billing@example.com' })
warning({ title: 'Payment overdue', description: 'Three invoices passed their due date.' })
danger({ title: 'Upload failed', description: 'The connection dropped before the file finished.' })
info({ title: 'New version available', description: 'Reload to pick up 1.4.0.' })
```
</Demo>

`success(…)` and friends are shorthand for `toast({ …, variant })`, so anything the base call takes works on them too.

## Duration

`duration` is milliseconds before the toast dismisses itself, falling back to the `IToaster`'s own `duration` (5000 by default). `0` keeps it open until dismissed.

<Demo stack>
<template #demo>
<div class="flex flex-wrap justify-center gap-2">
<IButton size="sm" variant="outline" @click="toast({ title: 'Gone in a second', duration: 1000 })">1 second</IButton>
<IButton size="sm" variant="outline" @click="toast({ title: 'The default', description: 'Five seconds.' })">Default</IButton>
<IButton size="sm" variant="outline" @click="danger({ title: 'Stays until dismissed', description: 'Nothing clears this one but you.', duration: 0 })">Until dismissed</IButton>
</div>
</template>

```vue
toast({ title: 'Gone in a second', duration: 1000 })
danger({ title: 'Upload failed', duration: 0 })
```
</Demo>

## Actions

An `action` puts one button in the toast. A toast leaves on its own, so keep it to undo-shaped offers and put anything the reader must do in a dialog.

<Demo stack>
<template #demo>
<IButton variant="outline" @click="toast({ title: 'Invoice deleted', description: 'INV-1042 moved to the archive.', action: { label: 'Undo', onClick: undo } })">Delete an invoice</IButton>
</template>

```vue
toast({
  title: 'Invoice deleted',
  description: 'INV-1042 moved to the archive.',
  action: { label: 'Undo', onClick: () => restore(invoice) },
})
```
</Demo>

## Dismissing from code

`toast()` returns an id, so a toast raised while work is in flight can be taken down when the work finishes.

<Demo stack>
<template #demo>
<div class="flex flex-wrap justify-center gap-2">
<IButton size="sm" variant="outline" @click="() => { const id = toast({ title: 'Uploading…', duration: 0 }); setTimeout(() => { dismiss(id); success('Upload complete') }, 2000) }">Upload something</IButton>
<IButton size="sm" variant="outline" @click="() => { toast('One'); toast('Two'); toast('Three'); }">Raise three</IButton>
<IButton size="sm" variant="outline" @click="clear()">Clear all</IButton>
</div>
</template>

```vue
const id = toast({ title: 'Uploading…', duration: 0 })
await upload(file)
dismiss(id)
success('Upload complete')
```
</Demo>

## Position

Six viewport positions, set once on the `IToaster`. Individual toasts do not choose their own.

```vue
<IApp>
  <RouterView />
  <IToaster position="bottom-right" />
</IApp>
```

## The API

```ts
const { toast, success, warning, danger, info, dismiss, clear } = useToast()

toast(options) // returns a number: the toast's id
success(options)
warning(options)
danger(options)
info(options)
dismiss(id)
clear()
```

`options` is a string — shorthand for the title — or:

```ts
interface ToastOptions {
  title?: string
  description?: string
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  /** Milliseconds before auto-dismiss. `0` keeps it until dismissed. */
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}
```

The store behind it is a module-level singleton, so `toast()` can be called from a plain function with no component in scope.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | — | Viewport corner the stack grows from |
| `duration` | `number` | `5000` | Fallback auto-dismiss; a toast's own `duration` wins |
| `closeLabel` | `string` | `'Close'` | Accessible name for each dismiss button |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ viewport?, root?, icon?, content?, title?, description?, action?, close? }` | — | Per-element class overrides |

Mount exactly one. Two toasters render the same store twice, so every toast appears twice.
