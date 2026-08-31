---
eyebrow: Data display
---

<script setup lang="ts">
import { Alert02Icon, CheckmarkCircle02Icon, Invoice01Icon, Mail01Icon } from '@hugeicons/core-free-icons'

const events = [
  { title: 'Invoice created', time: '09:12', datetime: '2026-08-22T09:12:00Z' },
  { title: 'Sent to client', time: '09:20', description: 'Delivered to the billing contact.' },
  { title: 'Viewed', time: '11:47' },
  { title: 'Paid', time: '14:03', variant: 'success', description: 'Card ending 4021.' },
]

const withIcons = [
  { title: 'Invoice created', time: '09:12', icon: Invoice01Icon },
  { title: 'Sent to client', time: '09:20', icon: Mail01Icon, variant: 'info' },
  { title: 'Payment failed', time: '13:02', icon: Alert02Icon, variant: 'danger', description: 'Insufficient funds. Retried automatically.' },
  { title: 'Paid', time: '14:03', icon: CheckmarkCircle02Icon, variant: 'success' },
]
</script>

# ITimeline

A vertical run of events in order — an audit trail, a delivery's progress, a document's history.

<Demo>
<template #demo>
<div class="w-full max-w-md">
<ITimeline :items="events" />
</div>
</template>

```vue
<script setup lang="ts">
const events = [
  { title: 'Invoice created', time: '09:12', datetime: '2026-08-22T09:12:00Z' },
  { title: 'Sent to client', time: '09:20', description: 'Delivered to the billing contact.' },
  { title: 'Viewed', time: '11:47' },
  { title: 'Paid', time: '14:03', variant: 'success', description: 'Card ending 4021.' },
]
</script>

<template>
  <ITimeline :items="events" />
</template>
```
</Demo>

## Not a stepper

A timeline is a record of what already happened. For a process the reader is moving through, with a current position and steps still to come, use [`IStepper`](/components/stepper).

## Icons

An icon turns the dot into a larger ringed circle, tinted to match the variant.

<Demo>
<template #demo>
<div class="w-full max-w-md">
<ITimeline :items="withIcons" />
</div>
</template>

```vue
<ITimeline
  :items="[
    { title: 'Invoice created', time: '09:12', icon: InvoiceIcon },
    { title: 'Payment failed', time: '13:02', icon: AlertIcon, variant: 'danger' },
    { title: 'Paid', time: '14:03', icon: CheckIcon, variant: 'success' },
  ]"
/>
```
</Demo>

## Variants

`neutral`, `primary`, `success`, `warning`, `danger` and `info`. Set one on the timeline for the default and override it per item. Keep the meaning in the title as well, so it survives without the colour.

## Time

`time` is rendered exactly as given, so format it where you know the reader's locale. Add `datetime` — an ISO string — and it becomes a machine-readable `<time>` element.

```ts
const paid = {
  title: 'Paid',
  time: '14:03', //                      what the reader sees
  datetime: '2026-08-22T14:03:00Z', //   what a machine reads
}
```

## Sizes

<Demo>
<template #demo>
<div class="grid w-full max-w-md gap-8">
<ITimeline :items="events.slice(0, 3)" size="sm" />
<ITimeline :items="events.slice(0, 3)" size="md" />
</div>
</template>

```vue
<ITimeline :items="events" size="sm" />
<ITimeline :items="events" size="md" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TimelineItem[]` | `[]` | |
| `size` | `'sm' \| 'md'` | `'md'` | |
| `variant` | `TimelineVariant` | `'neutral'` | Applied to any item without its own |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `{ root?, item?, rail?, marker?, line?, content?, header?, title?, time?, description? }` | — | Per-element class overrides |

### `TimelineItem`

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string` | What happened |
| `description` | `string` | |
| `time` | `string` | Shown as given |
| `datetime` | `string` | Machine-readable, for the `<time>` element |
| `icon` | `IconLike` | |
| `variant` | `TimelineVariant` | |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item, index }` | Replaces an item's content |
| `marker` | `{ item, index }` | Replaces the dot or icon |

## Accessibility

The events render as an ordered list, so a screen reader announces how many there are and where it is in them. The connecting spine is drawn per item, and the last item omits it.
