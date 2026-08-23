---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const signature = ref<string | null>(null)
</script>

# ISignaturePad

A signature drawn with a pointer — a delivery sign-off, a consent form, an invoice approved on a tablet.

<Demo stack>
<template #demo>
<div class="w-full max-w-md">
<ISignaturePad v-model="signature" aria-label="Signature" />
</div>
<p class="text-sm text-muted-foreground">{{ signature ? 'Signed' : 'Not signed yet' }}</p>
</template>

```vue
<script setup lang="ts">
const signature = ref<string | null>(null)
</script>

<template>
  <ISignaturePad v-model="signature" aria-label="Signature" />
</template>
```
</Demo>

## How it draws

The stroke thins as the hand speeds up, and follows stylus pressure where the hardware reports it, so a signature reads as handwriting rather than a traced outline.

The canvas is backed at the device's pixel ratio and redrawn from the stored strokes when the container resizes, so the ink stays sharp at any width.

## The model is a data URL

A PNG data URL, or `null` when nothing has been drawn — ready to post, and ready to render straight back:

```vue
<img v-if="signature" :src="signature" alt="Signature">
```

The model stays `null` until there is real ink on the pad, so `required` works in an [`IForm`](/components/form) and a stray tap does not count as a signature.

## Undo and clear

Both sit over the pad, and are disabled while there is nothing to act on.

The component also exposes them, for a form that drives its own controls:

```vue
<script setup lang="ts">
const pad = ref()
</script>

<template>
  <ISignaturePad ref="pad" v-model="signature" />
  <IButton @click="pad.clear()">
    Start again
  </IButton>
</template>
```

| Exposed | Description |
| --- | --- |
| `clear()` | Empty the pad |
| `undo()` | Remove the last stroke |
| `isEmpty` | Whether anything has been drawn |
| `toDataUrl()` | The current signature, or `null` |

## Appearance

`pen-color` defaults to `currentColor`, so the ink follows the theme and redraws when the appearance changes. `height` sets the surface; the width follows the container.

<Demo stack>
<template #demo>
<div class="w-full max-w-md">
<ISignaturePad aria-label="Short pad" :height="110" :pen-width="3" />
</div>
</template>

```vue
<ISignaturePad aria-label="Short pad" :height="110" :pen-width="3" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | `null` | PNG data URL |
| `height` | `number` | `160` | Surface height; width follows the container |
| `penColor` | `string` | `'currentColor'` | |
| `penWidth` | `number` | `2` | Nominal width; the drawn width varies |
| `undoLabel` | `string` | `'Undo last stroke'` | |
| `clearLabel` | `string` | `'Clear signature'` | |
| `ariaLabel` | `string` | `'Signature'` | Names the canvas |
| `disabled` | `boolean` | `false` | |
| `invalid` | `boolean` | — | Inherited from `IFormField` when unset |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `ui` | `Record<string, string>` | — | Per-slot class overrides |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| null` | |
| `start` | — | A stroke began; useful for marking a form dirty |
| `end` | `string \| null` | A stroke finished |
| `clear` | — | |

## Accessibility

The canvas carries `role="img"` and a name. Drawing needs a pointer — undo and clear are reachable from the keyboard, the signing itself is not — so where a signature is required, offer another route alongside it: a typed name, an uploaded image, or signing through another channel.

Undo and clear are icon-only, so both carry an `aria-label` and a `title`. Inside an [`IFormField`](/components/form-field) the id, the invalid state and the error's `aria-describedby` are inherited.
