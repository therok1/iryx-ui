---
eyebrow: Feedback
---

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

# IAlert

An inline message about the thing next to it. Neutral chrome with a coloured icon — the icon carries the severity, so a page of alerts does not turn into a wall of colour.

<Demo stack>
<template #demo>
<IAlert
  variant="info"
  title="Draft saved"
  description="Your changes are stored locally until you send the invoice."
  class="w-full max-w-xl"
/>
</template>

```vue
<IAlert
  variant="info"
  title="Draft saved"
  description="Your changes are stored locally until you send the invoice."
/>
```
</Demo>

## Variants

Four severities, each with its own default icon. `warning` and `danger` announce assertively to a screen reader; `info` and `success` announce politely, so they do not cut across what the reader is doing.

<Demo stack>
<template #demo>
<IAlert variant="info" title="Scheduled" description="This invoice sends on 1 April." class="w-full max-w-xl" />
<IAlert variant="success" title="Payment received" description="€1,240.00 cleared this morning." class="w-full max-w-xl" />
<IAlert variant="warning" title="Past due" description="Payment was expected on 14 March." class="w-full max-w-xl" />
<IAlert variant="danger" title="Send failed" description="The client's address bounced. Check it and try again." class="w-full max-w-xl" />
</template>

```vue
<IAlert variant="info" title="Scheduled" description="This invoice sends on 1 April." />
<IAlert variant="success" title="Payment received" description="€1,240.00 cleared this morning." />
<IAlert variant="warning" title="Past due" description="Payment was expected on 14 March." />
<IAlert variant="danger" title="Send failed" description="The client's address bounced. Check it and try again." />
```
</Demo>

## Description only

Skip `title` for a single line. The icon still sets the severity.

<Demo stack>
<template #demo>
<IAlert variant="warning" description="Three invoices are past due." class="w-full max-w-xl" />
</template>

```vue
<IAlert variant="warning" description="Three invoices are past due." />
```
</Demo>

## Dismissing

`closable` adds a close button. Bind `v-model:open` to control visibility; the `close` event fires alongside it when you need to persist the decision.

<Demo stack>
<template #demo>
<IAlert
  v-model:open="open"
  variant="info"
  title="You can dismiss this one"
  description="Toggle it back with the button below."
  closable
  class="w-full max-w-xl"
/>
<IButton v-if="!open" size="sm" variant="outline" @click="open = true">Bring it back</IButton>
</template>

```vue
<IAlert
  v-model:open="open"
  variant="info"
  title="You can dismiss this one"
  description="Toggle it back with the button below."
  closable
  @close="rememberDismissal()"
/>

<IButton v-if="!open" size="sm" variant="outline" @click="open = true">
  Bring it back
</IButton>
```
</Demo>

## Actions

The `actions` slot sits under the description, for the thing the alert is asking you to do.

<Demo stack>
<template #demo>
<IAlert variant="warning" title="Past due" description="Payment was expected on 14 March." class="w-full max-w-xl">
<template #actions>
<IButton size="sm" variant="outline">Send a reminder</IButton>
</template>
</IAlert>
</template>

```vue
<IAlert variant="warning" title="Past due" description="Payment was expected on 14 March.">
  <template #actions>
    <IButton size="sm" variant="outline">Send a reminder</IButton>
  </template>
</IAlert>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Severity, and the default icon |
| `title` | `string` | — | Bold first line |
| `description` | `string` | — | Body text |
| `icon` | icon \| `false` | variant's icon | Your own icon, or `false` for none |
| `closable` | `boolean` | `false` | Shows the close button |
| `closeLabel` | `string` | `'Close'` | Accessible name for that button |
| `as` | `string` | `'div'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, icon?, content?, title?, description?, actions?, close? }` | — | Per-element class overrides |

`v-model:open` controls visibility, and `close` is emitted when the button is pressed.

For a message about the page as a whole rather than the thing beside it, reach for `IBanner`; for something transient, `useToast()`.
