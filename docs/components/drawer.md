---
eyebrow: Overlays
---

<script setup lang="ts">
import type { DrawerSide, DrawerSnapPoint } from 'iryx-ui'
import { ref } from 'vue'

const side = ref<DrawerSide>('right')
const open = ref(false)
const sheet = ref(false)
const snap = ref<DrawerSnapPoint | null>(0.45)

function openAt(value: DrawerSide) {
  side.value = value
  open.value = true
}
</script>

# IDrawer

A panel attached to an edge of the viewport. It shares [`IDialog`](/components/dialog)'s slots and dismissal behaviour, and can be dragged away.

<Demo>
<template #demo>
<IButton variant="outline" @click="openAt('right')">Right</IButton>
<IButton variant="outline" @click="openAt('left')">Left</IButton>
<IButton variant="outline" @click="openAt('top')">Top</IButton>
<IButton variant="outline" @click="openAt('bottom')">Bottom</IButton>
<IDrawer v-model:open="open" :side="side" title="Filters" description="Narrow the list down to what you are looking for.">
<p class="text-sm text-muted-foreground">Drag the panel towards its own edge to dismiss it.</p>
<template #footer="{ close }">
<IButton variant="outline" @click="close()">Reset</IButton>
<IButton @click="close()">Apply</IButton>
</template>
</IDrawer>
</template>

```vue
<IDrawer
  v-model:open="open"
  side="right"
  title="Filters"
  description="Narrow the list down to what you are looking for."
>
  <p>Drag the panel towards its own edge to dismiss it.</p>

  <template #footer="{ close }">
    <IButton variant="outline" @click="close()">
      Reset
    </IButton>
    <IButton @click="close()">
      Apply
    </IButton>
  </template>
</IDrawer>
```
</Demo>

`side` picks the edge — `right` (default), `left`, `top` or `bottom` — and doubles as the direction you drag to dismiss.

## Size means different things per edge

On a `left` or `right` drawer, `size` is a width. On a `top` or `bottom` sheet it is a *maximum* height, so a short sheet hugs its content. Below the `sm` breakpoint a side drawer takes the full screen.

## Snap points

`snapPoints` gives a sheet resting positions. Values are fractions of the viewport (`0.45`), pixel numbers, or CSS lengths like `'20rem'`. `v-model:snapPoint` reads or sets the current one.

<Demo>
<template #demo>
<IButton variant="outline" @click="sheet = true">Open sheet</IButton>
<IDrawer v-model:open="sheet" v-model:snap-point="snap" side="bottom" :snap-points="[0.45, 1]" title="Payment method" description="Drag the sheet up to see the whole list.">
<div class="space-y-3">
<p class="text-sm text-muted-foreground">Resting at snap point {{ snap }}.</p>
<ICard v-for="m in ['Bank transfer', 'Card ending 4417', 'Direct debit', 'Cash']" :key="m">{{ m }}</ICard>
</div>
</IDrawer>
</template>

```vue
<IDrawer
  v-model:open="open"
  v-model:snap-point="snap"
  side="bottom"
  :snap-points="[0.45, 1]"
  title="Payment method"
  description="Drag the sheet up to see the whole list."
>
  <p>Resting at snap point {{ snap }}.</p>

  <ICard v-for="method in methods" :key="method">
    {{ method }}
  </ICard>
</IDrawer>
```
</Demo>

With snap points set, `size` no longer caps the height: the panel is translated between resting positions rather than resized.

## Modality

`modal` decides how much of the page the drawer takes over:

- `true` (default) traps focus and blocks everything behind it.
- `'trap-focus'` keeps the page interactive while still holding the Tab ring — what a persistent side panel wants.
- `false` does neither.

## The handle

Sheets get a drag handle by default and side drawers do not; `handle` overrides that in both directions. The whole panel is the drag target, not just the handle.

## Dismissal

`:dismissible="false"` refuses the swipe along with Escape and the overlay. The corner button still closes; hide it with `:show-close="false"`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | `v-model:open` |
| `side` | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` | Edge, and the dismiss direction |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Width on a side drawer, max height on a sheet |
| `snapPoints` | `(number \| string)[]` | — | Resting positions |
| `snapPoint` | `number \| string \| null` | `null` | `v-model:snapPoint` |
| `snapToSequentialPoints` | `boolean` | `false` | Snap to the next point in order, not the nearest |
| `modal` | `boolean \| 'trap-focus'` | `true` | How much of the page it takes over |
| `dismissible` | `boolean` | `true` | Swipe, Escape and overlay close it |
| `handle` | `boolean` | sheets only | Show the drag handle |
| `showClose` | `boolean` | `true` | Render the corner dismiss button |
| `closeLabel` | `string` | `'Close'` | Accessible name for that button |
| `title` / `description` | `string` | — | As `IDialog` |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged onto the panel |
| `ui` | `object` | — | `overlay`, `content`, `handle`, `header`, `title`, `description`, `body`, `footer`, `close` |

Slots match `IDialog`: `trigger`, `header`, `title`, `description`, default (body), and `footer` (receives `close`).

<IAlert variant="info" title="This site uses one" class="not-prose my-6">
The mobile navigation here is an <code>IDrawer</code>. Narrow your window and open it — if the component regresses, these docs stop navigating on a phone.
</IAlert>
