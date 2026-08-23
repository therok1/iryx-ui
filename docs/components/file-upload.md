---
eyebrow: Forms
---

<script setup lang="ts">
import { ref } from 'vue'

const logo = ref<File[]>([])
const attachments = ref<File[]>([])
const images = ref<File[]>([])
const capped = ref<File[]>([])
const rejectedFiles = ref<File[]>([])
const invalidFiles = ref<File[]>([])
const disabledFiles = ref<File[]>([])
const lastRejection = ref('')

function onReject(rejections: { file: File, reason: 'type' | 'size' | 'count' }[]) {
  lastRejection.value = rejections.map(r => `${r.file.name} — ${r.reason}`).join(', ')
}
</script>

# IFileUpload

A drag-and-drop file field, with a browse button and a list of what has been picked.

<Demo stack>
<template #demo>
<IFileUpload v-model="logo" class="w-full max-w-md" />
</template>

```vue
<script setup lang="ts">
const logo = ref<File[]>([])
</script>

<template>
  <IFileUpload v-model="logo" />
</template>
```
</Demo>

The model is always a `File[]`, even without `multiple` — in that case an array holding at most one file, and picking again replaces it.

## Multiple files

<Demo stack>
<template #demo>
<IFileUpload v-model="attachments" multiple label="Drop your attachments here" hint="Any file type" class="w-full max-w-md" />
</template>

```vue
<IFileUpload v-model="attachments" multiple label="Drop your attachments here" hint="Any file type" />
```
</Demo>

Image files get a thumbnail and everything else a placeholder of the same size. The object URLs behind the thumbnails are revoked when a file leaves the list or the component unmounts.

## Accepted types and sizes

`accept` uses the native syntax — `image/*`, `.pdf`, `image/png` — and is enforced on dragged-in files as well as on the browse dialog.

<Demo stack>
<template #demo>
<IFileUpload v-model="images" accept="image/*" :max-size="2 * 1024 * 1024" label="Drag your logo here" browse-label="Browse images" hint="PNG, JPG or SVG up to 2 MB" class="w-full max-w-md" />
</template>

```vue
<IFileUpload
  v-model="logo"
  accept="image/*"
  :max-size="2 * 1024 * 1024"
  label="Drag your logo here"
  browse-label="Browse images"
  hint="PNG, JPG or SVG up to 2 MB"
/>
```
</Demo>

Put the accepted types in `hint`: `label` is the instruction, `hint` is the fine print.

## Capping the count

<Demo stack>
<template #demo>
<IFileUpload v-model="capped" multiple :max-files="3" hint="Up to three files" class="w-full max-w-md" />
</template>

```vue
<IFileUpload v-model="files" multiple :max-files="3" hint="Up to three files" />
```
</Demo>

## Rejections

Refused files raise `@reject` once per drop, with an array of `{ file, reason }`, where `reason` is `'type'`, `'size'` or `'count'`. The messages shown on the rows come from `tooLargeText`, `wrongTypeText` and `tooManyText`.

<Demo stack>
<template #demo>
<IFileUpload v-model="rejectedFiles" accept="application/pdf" :max-size="1024" hint="PDFs under 1 KB — most things will bounce" class="w-full max-w-md" @reject="onReject" />
<p v-if="lastRejection" class="text-sm text-muted-foreground">Last rejection: {{ lastRejection }}</p>
</template>

```vue
<IFileUpload
  v-model="files"
  accept="application/pdf"
  :max-size="1024"
  hint="PDFs under 1 KB — most things will bounce"
  @reject="rejections => toast.error(`${rejections.length} file(s) refused`)"
/>
```
</Demo>

## Invalid and disabled

<Demo stack>
<template #demo>
<IFileUpload v-model="invalidFiles" invalid class="w-full max-w-md" />
<IFileUpload v-model="disabledFiles" disabled class="w-full max-w-md" />
</template>

```vue
<IFileUpload v-model="files" invalid />
<IFileUpload v-model="files" disabled />
```
</Demo>

Inside an [`IFormField`](/components/form-field) the field passes its own validity down, so `invalid` rarely needs setting by hand.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple` | `boolean` | — | Accept more than one file. The model is an array either way |
| `accept` | `string` | — | Native syntax: `image/*`, `.pdf`, `image/png` |
| `maxSize` | `number` | — | Largest accepted size, in bytes |
| `maxFiles` | `number` | — | Cap on how many files may be held at once |
| `disabled` | `boolean` | — | Zone and browse button are inert |
| `invalid` | `boolean` | — | Red border; inherited from `IFormField` when unset |
| `id` | `string` | — | Id for the input; `IFormField` supplies one |
| `label` | `string` | `'Drag and drop a file here'` | Prompt inside the zone |
| `hint` | `string` | — | Fine print under the prompt |
| `browseLabel` | `string` | `'Browse files'` | Text on the browse button |
| `removeLabel` | `string` | `'Remove'` | Accessible name for a row's remove action |
| `tooLargeText` | `string` | `'is too large'` | Message for a `size` rejection |
| `wrongTypeText` | `string` | `'is not an accepted type'` | Message for a `type` rejection |
| `tooManyText` | `string` | `'exceeds the file limit'` | Message for a `count` rejection |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Applied to the wrapper stacking the zone above the list |
| `ui` | `{ root?, dropzone?, input?, icon?, label?, browse?, hint?, list?, item?, thumbnail?, placeholder?, details?, name?, meta?, remove?, error? }` | — | Per-slot class overrides |

## Events

| Event | Payload | When |
| --- | --- | --- |
| `reject` | `FileRejection[]` | One or more files were refused, once per drop or pick |

```ts
interface FileRejection {
  file: File
  reason: 'type' | 'size' | 'count'
}
```

## Model

```ts
const files = ref<File[]>([])
```

The component never uploads anything: it hands you `File` objects, and posting them, showing progress and retrying are yours.
