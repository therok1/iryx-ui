---
eyebrow: Marketing
---

<script setup lang="ts">
import { AlarmClockIcon, CoinsDollarIcon, ShieldIcon } from '@hugeicons/core-free-icons'
</script>

# IFeatureCard

One thing the product does: an icon, a title, and a line about it. The grid of these is what a features section is made of.

```vue
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <IFeatureCard
    v-for="feature in features"
    :key="feature.title"
    :icon="feature.icon"
    :title="feature.title"
    :description="feature.description"
  />
</div>
```

<Demo stack>
<template #demo>
<div class="grid w-full gap-4 sm:grid-cols-2">
<IFeatureCard title="Money that adds up" description="Totals are summed in integer cents, so a column of invoices agrees with the ledger to the penny." />
<IFeatureCard title="Reminders that go out" description="Set the terms once, and the nudge goes out on day three without you." />
</div>
</template>

```vue
<IFeatureCard title="Money that adds up" description="Totals are summed in integer cents." />
```
</Demo>

There is no grid inside — the section owns the grid and its column count, and the card owns one feature.

## Icon

`icon` takes a [Hugeicons](https://hugeicons.com) export, or any Vue component — Hugeicons ships icons as data arrays rather than components, so `IconLike` accepts both and nothing narrower is required of a component you pass. It sits in a tinted square above the title.

<Demo stack>
<template #demo>
<div class="grid w-full gap-4 sm:grid-cols-2">
<IFeatureCard :icon="CoinsDollarIcon" title="Every currency, every locale" description="Rates are fetched once a day and stored with the invoice, so a total never moves after it is sent." />
<IFeatureCard :icon="AlarmClockIcon" title="Reminders that go out" description="Set the terms once, and the nudge goes out on day three without you." />
</div>
</template>

```vue
<script setup lang="ts">
import { AlarmClockIcon, CoinsDollarIcon } from '@hugeicons/core-free-icons'
</script>

<template>
  <IFeatureCard
    :icon="CoinsDollarIcon"
    title="Every currency, every locale"
    description="Rates are fetched once a day and stored with the invoice, so a total never moves after it is sent."
  />
  <IFeatureCard
    :icon="AlarmClockIcon"
    title="Reminders that go out"
    description="Set the terms once, and the nudge goes out on day three without you."
  />
</template>
```
</Demo>

Recolour the square through `ui` when a card needs to read differently:

<Demo stack>
<template #demo>
<div class="w-full sm:max-w-sm">
<IFeatureCard :icon="ShieldIcon" title="Locked down by default" description="Every session is scoped to one workspace, and a key only ever sees what it was issued for." :ui="{ icon: 'bg-success/10 text-success' }" />
</div>
</template>

```vue
<IFeatureCard
  :icon="ShieldIcon"
  title="Locked down by default"
  description="Every session is scoped to one workspace, and a key only ever sees what it was issued for."
  :ui="{ icon: 'bg-success/10 text-success' }"
/>
```
</Demo>

## Alignment

`start` is the default. `center` centres the text and the icon square with it — useful for a row of three or fewer, less so in a dense grid, where a consistent left edge is easier to scan.

<Demo stack>
<template #demo>
<div class="grid w-full gap-4 sm:grid-cols-2">
<IFeatureCard align="center" :icon="CoinsDollarIcon" title="Every currency, every locale" description="Rates are stored with the invoice, so a total never moves after it is sent." />
<IFeatureCard align="center" :icon="AlarmClockIcon" title="Reminders that go out" description="Set the terms once, and the nudge goes out on day three without you." />
</div>
</template>

```vue
<IFeatureCard
  align="center"
  :icon="CoinsDollarIcon"
  title="Every currency, every locale"
  description="Rates are stored with the invoice, so a total never moves after it is sent."
/>
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `IconLike` | — | Hugeicons export or SVG component |
| `title` | `string` | — | Rendered as an `h3` |
| `description` | `string` | — | Short text under the title |
| `align` | `'start' \| 'center'` | `'start'` | Text and icon alignment |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, icon?, title?, description? }` | — | Per-element class overrides |

## Slots

When both a prop and its matching slot are given, the slot wins.

| Slot | Description |
| --- | --- |
| `default` | After the description — a link, a badge, anything extra |
| `icon` | Replaces the icon square's contents |
| `title` | Replaces the `title` prop |
| `description` | Replaces the `description` prop |
