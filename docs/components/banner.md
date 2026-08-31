---
eyebrow: Feedback
---

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(true)
</script>

# IBanner

A message about the whole page or the whole account, spanning the full width. It is the page-level counterpart to [`IAlert`](/components/alert), which talks about the thing beside it.

<Demo stack>
<template #demo>
<IBanner
  variant="primary"
  title="Your trial ends in 3 days."
  description="Upgrade to keep sending invoices."
  class="w-full"
>
<template #actions>
<IButton size="sm" variant="outline">Upgrade</IButton>
</template>
</IBanner>
</template>

```vue
<IBanner
  variant="primary"
  title="Your trial ends in 3 days."
  description="Upgrade to keep sending invoices."
>
  <template #actions>
    <IButton size="sm" variant="outline">Upgrade</IButton>
  </template>
</IBanner>
```
</Demo>

A banner renders as a labelled region, named by `label`. For something that just happened, use [`useToast()`](/composables/use-toast).

## Variants

<Demo stack>
<template #demo>
<IBanner variant="neutral" description="A neutral announcement." class="w-full" />
<IBanner variant="primary" description="Something to do with your plan." class="w-full" />
<IBanner variant="info" description="Scheduled maintenance on Sunday." class="w-full" />
<IBanner variant="success" description="Your account is verified." class="w-full" />
<IBanner variant="warning" description="Two invoices are past due." class="w-full" />
<IBanner variant="danger" description="Payment failed — update your card." class="w-full" />
</template>

```vue
<IBanner variant="neutral" description="A neutral announcement." />
<IBanner variant="primary" description="Something to do with your plan." />
<IBanner variant="info" description="Scheduled maintenance on Sunday." />
<IBanner variant="success" description="Your account is verified." />
<IBanner variant="warning" description="Two invoices are past due." />
<IBanner variant="danger" description="Payment failed — update your card." />
```
</Demo>

## Position

`static` sits in the flow. `top` and `bottom` pin the banner to the viewport, where it covers part of every screen until it is dismissed.

```vue
<IBanner position="top" variant="danger" description="You are offline." />
<IBanner position="bottom" variant="neutral" description="We use cookies." />
```

## Contained and aligned

The fill always spans the full width. `contained` keeps the *text* within the page's reading measure instead of running to the window edges, and `align` centres it.

<Demo stack>
<template #demo>
<IBanner variant="neutral" contained align="center" description="Contained and centred — the fill still spans, the text does not." class="w-full" />
</template>

```vue
<IBanner
  variant="neutral"
  contained
  align="center"
  description="Contained and centred — the fill still spans, the text does not."
/>
```
</Demo>

## Dismissing

<Demo stack>
<template #demo>
<IBanner
  v-model:open="open"
  variant="info"
  description="You can dismiss this one."
  closable
  class="w-full"
/>
<IButton v-if="!open" size="sm" variant="outline" @click="open = true">Bring it back</IButton>
</template>

```vue
<IBanner
  v-model:open="open"
  variant="info"
  description="You can dismiss this one."
  closable
/>

<IButton v-if="!open" size="sm" variant="outline" @click="open = true">
  Bring it back
</IButton>
```
</Demo>

Persist the dismissal, or the banner returns on the next navigation.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'primary'` | `'neutral'` | Tone |
| `position` | `'static' \| 'top' \| 'bottom'` | `'static'` | In the flow, or pinned to the viewport |
| `title` | `string` | — | Bold first line |
| `description` | `string` | — | Body text |
| `icon` | icon | — | Leading icon |
| `contained` | `boolean` | — | Keeps the text within the reading measure |
| `align` | `'start' \| 'center'` | `'start'` | Text alignment |
| `closable` | `boolean` | `false` | Shows the dismiss button |
| `closeLabel` | `string` | `'Dismiss'` | Accessible name for that button |
| `label` | `string` | `'Announcement'` | Accessible name for the region |
| `as` | `string` | `'div'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, container?, icon?, content?, title?, actions?, close? }` | — | Per-element class overrides |

`v-model:open` controls visibility.

Show one banner at a time. For a message about a single control or panel, use [`IAlert`](/components/alert).
