---
eyebrow: Data display
---

<script setup lang="ts">
import { PauseIcon, PlayIcon } from '@hugeicons/core-free-icons'
import { ref, watchEffect } from 'vue'

const shots = ['Invoices', 'Reminders', 'Reconciliation', 'Reports', 'Exports']

const stories = [
  { quote: 'We stopped chasing invoices entirely.', name: 'Rae Ellis' },
  { quote: 'Month end used to be a weekend.', name: 'Tomas Vidal' },
  { quote: 'The reminders pay for the plan twice over.', name: 'Nadia Kerr' },
  { quote: 'It reconciles before I have opened the bank tab.', name: 'Owen Pike' },
]

const shot = ref(0)
const playing = ref(true)
const held = ref(false)

const reduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

watchEffect((onCleanup) => {
  if (!playing.value || held.value || reduced)
    return

  const timer = setInterval(() => (shot.value = (shot.value + 1) % shots.length), 4000)
  onCleanup(() => clearInterval(timer))
})
</script>

# ICarousel

A row of slides you page through — screenshots, customer stories, a shelf of cards. Arrows, dots and the arrow keys.

<Demo stack>
<template #demo>
<ICarousel :items="shots" label="Screens" class="w-full" v-slot="{ item, index }">
<div class="grid h-40 place-items-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
{{ index + 1 }}. {{ item }}
</div>
</ICarousel>
</template>

```vue
<ICarousel :items="shots" label="Screens" v-slot="{ item }">
  <div class="grid h-40 place-items-center rounded-xl border border-border bg-muted">
    {{ item }}
  </div>
</ICarousel>
```
</Demo>

Each item is rendered through the default slot, which receives `item`, `index` and `active`.

## Scrolling

The slides sit in an `overflow-x-auto` row with CSS scroll snapping, so touch, trackpad, shift-scroll and a dragged scrollbar move the track as well as the arrows do.

The active slide is read back from the scroll position, so swiping by hand keeps the dots in step.

## More than one across

`perView` sets how many fit at the widest. Below `sm` it is always one.

<Demo stack>
<template #demo>
<ICarousel :items="stories" :per-view="2" label="Customer stories" class="w-full" v-slot="{ item }">
<ICard class="h-full">
<p class="text-sm">“{{ item.quote }}”</p>
<p class="mt-3 text-xs text-muted-foreground">{{ item.name }}</p>
</ICard>
</ICarousel>
</template>

```vue
<ICarousel :items="stories" :per-view="2" label="Customer stories" v-slot="{ item }">
  <ICard class="h-full">
    <p class="text-sm">“{{ item.quote }}”</p>
    <p class="mt-3 text-xs text-muted-foreground">{{ item.name }}</p>
  </ICard>
</ICarousel>
```
</Demo>

`'auto'` leaves each slide at its content's own width.

## Arrows and dots

Both are on by default. The arrows disable at each end, and disappear when everything already fits.

There is one dot per place the track can stop at, not per slide: with several across, the last slides never reach the start of the track. The row is hidden when there is only one stop.

```vue
<ICarousel :items="shots" :dots="false" label="Screens" />
```

## No autoplay

There is none. Build one from `v-model:active` and a timer you own; setting the model scrolls the track.

Three things come with you: a pause control, for WCAG 2.2.2; a stop under `prefers-reduced-motion`; and a hold while a pointer or the keyboard focus is inside.

<Demo stack>
<template #demo>
<div class="w-full" @pointerenter="held = true" @pointerleave="held = false" @focusin="held = true" @focusout="held = false">
<ICarousel v-model:active="shot" :items="shots" label="Screens" v-slot="{ item, index }">
<div class="grid h-40 place-items-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
{{ index + 1 }}. {{ item }}
</div>
</ICarousel>
<div class="mt-2 flex justify-center">
<IButton variant="ghost" size="sm" @click="playing = !playing">
<IIcon :icon="playing ? PauseIcon : PlayIcon" data-icon="inline-start" />
{{ playing ? 'Pause' : 'Play' }}
</IButton>
</div>
</div>
</template>

```vue
<script setup lang="ts">
const shot = ref(0)
const playing = ref(true)
const held = ref(false)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

watchEffect((onCleanup) => {
  if (!playing.value || held.value || reduced)
    return

  const timer = setInterval(() => (shot.value = (shot.value + 1) % shots.length), 4000)
  onCleanup(() => clearInterval(timer))
})
</script>

<template>
  <div
    @pointerenter="held = true"
    @pointerleave="held = false"
    @focusin="held = true"
    @focusout="held = false"
  >
    <ICarousel v-slot="{ item }" v-model:active="shot" :items="shots" label="Screens">
      <div class="grid h-40 place-items-center rounded-xl border border-border bg-muted">
        {{ item }}
      </div>
    </ICarousel>

    <IButton variant="ghost" size="sm" @click="playing = !playing">
      <IIcon :icon="playing ? PauseIcon : PlayIcon" data-icon />
      {{ playing ? 'Pause' : 'Play' }}
    </IButton>
  </div>
</template>
```
</Demo>

Wrapping with `% shots.length` only works while one slide is in view. With `perView` above one, wrap at the last position the dots offer instead.

## Styling the active slide

The slide in view and its dot both carry `data-state="active"`, the rest `"inactive"`:

```vue
<ICarousel :items="shots" :ui="{ item: 'opacity-40 data-[state=active]:opacity-100' }" />
```

## Accessibility

The carousel is a group with `aria-roledescription="carousel"`, and each slide is a group labelled "2 of 5". Give `label` something that names this carousel — "Customer stories", not "Carousel".

The track is focusable, and left and right move a slide at a time.

There is no live region.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `Item[]` | — | One slide each, rendered through the default slot |
| `perView` | `1 \| 2 \| 3 \| 4 \| 'auto'` | `1` | How many fit across at the widest |
| `gap` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Space between slides |
| `arrows` | `boolean` | `true` | Show the previous and next buttons |
| `dots` | `boolean` | `true` | Show the row of dots |
| `label` | `string` | `'Carousel'` | Accessible name |
| `previousLabel` | `string` | `'Previous'` | Accessible name for the back button |
| `nextLabel` | `string` | `'Next'` | Accessible name for the forward button |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, viewport?, track?, item?, control?, dots?, dot? }` | — | Per-element class overrides |

## Slots

| Slot | Description |
| --- | --- |
| `default` | One slide. Receives `item`, `index` and `active` |

## Models

| Model | Type | Description |
| --- | --- | --- |
| `active` | `number` | Index of the slide at the start of the track. Reads back from the scroll position, and scrolls the track when set from outside |
