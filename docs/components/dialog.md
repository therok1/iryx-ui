<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const blocking = ref(false)
</script>

# Dialog

A modal, with header, body and footer slots. It portals to the body, traps focus, and closes on Escape or an overlay click unless you say otherwise.

<Demo>
<template #demo>
<IButton variant="outline" @click="open = true">Open dialog</IButton>
<IDialog v-model:open="open" title="Edit invoice" description="Escape, the overlay and the corner button all close this.">
<p class="text-sm text-muted-foreground">Body content goes in the default slot.</p>
<template #footer="{ close }">
<IButton variant="outline" @click="close()">Cancel</IButton>
<IButton @click="close()">Save</IButton>
</template>
</IDialog>
</template>

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <IButton @click="open = true">
    Open dialog
  </IButton>

  <IDialog v-model:open="open" title="Edit invoice" description="Change the details.">
    <p>Body content goes in the default slot.</p>

    <template #footer="{ close }">
      <IButton variant="outline" @click="close()">
        Cancel
      </IButton>
      <IButton @click="close()">
        Save
      </IButton>
    </template>
  </IDialog>
</template>
```
</Demo>

The `footer` slot receives `close`, so the common case needs no state handling of its own.

## Forcing a choice

`dismissible: false` refuses Escape and the overlay. Pair it with `showClose: false` when the point is that one of the buttons must be chosen.

The guard sits on the state change rather than on the individual events, so a dismissal route added upstream is refused by default rather than silently working.

<Demo>
<template #demo>
<IButton variant="outline" @click="blocking = true">Open blocking dialog</IButton>
<IDialog v-model:open="blocking" title="Make a choice" description="Escape and the overlay won't close this one." :dismissible="false" :show-close="false" size="sm">
<template #footer="{ close }">
<IButton variant="outline" @click="close()">Got it</IButton>
</template>
</IDialog>
</template>

```vue
<IDialog
  v-model:open="open"
  title="Make a choice"
  :dismissible="false"
  :show-close="false"
  size="sm"
>
  <template #footer="{ close }">
    <IButton @click="close()">
      Got it
    </IButton>
  </template>
</IDialog>
```
</Demo>

## Sizes

`sm`, `md` (default), `lg` and `xl` cap the width from the `sm` breakpoint up. Below it the dialog is always full-width minus a margin, so a phone is never given a squeezed column.

## Scrolling

The body scrolls on its own, so the header and footer stay put on a short screen. It also carries a little padding and a matching negative margin, so a focus ring on a control inside isn't clipped by the scroll container.

## Confirmations

For a yes/no question, `useConfirm()` is less ceremony than a dialog you have to wire up. Mount `<IConfirmDialog />` once, then call it from anywhere — including plain functions outside a component:

```ts
const { confirm } = useConfirm()

if (await confirm({ title: 'Delete this draft?', danger: true }))
  await remove()
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | `v-model:open` |
| `title` | `string` | — | Heading, and the accessible name |
| `description` | `string` | — | Sits under the title, wired via `aria-describedby` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Maximum width from `sm` up |
| `dismissible` | `boolean` | `true` | Escape and overlay click close it |
| `showClose` | `boolean` | `true` | Render the corner dismiss button |
| `closeLabel` | `string` | `'Close'` | Accessible name for that button |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged onto the content panel |
| `ui` | `object` | — | `overlay`, `content`, `header`, `title`, `description`, `body`, `footer`, `close` |

Slots: `trigger`, `header`, `title`, `description`, default (body), and `footer` (receives `close`).

The corner button closes even when `dismissible` is `false` — it is an explicit action, not a dismissal.
