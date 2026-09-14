---
eyebrow: Forms
---

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

const logo = ref<File[]>([])
const attachments = ref<File[]>([])
const images = ref<File[]>([])
const capped = ref<File[]>([])
const rejectedFiles = ref<File[]>([])
const invalidFiles = ref<File[]>([])
const disabledFiles = ref<File[]>([])
const lastRejection = ref('')

const uploads = ref<File[]>([])
const uploadStatus = reactive(new Map<File, { state: 'uploading' | 'done' | 'error', progress?: number, error?: string }>())
let started = 0

// A pretend upload: every third one fails, so the retry path can be tried.
function startUpload(file: File) {
  const fails = ++started % 3 === 0
  uploadStatus.set(file, { state: 'uploading', progress: 0 })
  const timer = setInterval(() => {
    const current = uploadStatus.get(file)
    if (!current || !uploads.value.includes(file))
      return clearInterval(timer)
    const progress = (current.progress ?? 0) + 10
    if (progress < (fails ? 60 : 100))
      return uploadStatus.set(file, { state: 'uploading', progress })
    clearInterval(timer)
    uploadStatus.set(file, fails ? { state: 'error', error: 'The connection dropped' } : { state: 'done' })
  }, 250)
}

watch(uploads, files => files.filter(f => !uploadStatus.has(f)).forEach(startUpload))

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

## Upload progress

The component doesn't upload anything, but it can show how your upload is going. `statusFor` returns a file's state, and the row follows it: a bar and percentage while uploading, "Uploaded" when done, the error and a retry button when it failed. Leave `progress` out for an indeterminate bar.

<Demo stack>
<template #demo>
<IFileUpload v-model="uploads" multiple :status-for="f => uploadStatus.get(f)" hint="Every third upload fails" class="w-full max-w-md" @retry="startUpload" />
</template>

```vue
<script setup lang="ts">
import type { FileUploadStatus } from 'iryx-ui'

const files = ref<File[]>([])
const status = reactive(new Map<File, FileUploadStatus>())

async function upload(file: File) {
  status.set(file, { state: 'uploading', progress: 0 })
  try {
    await post(file, percent => status.set(file, { state: 'uploading', progress: percent }))
    status.set(file, { state: 'done' })
  }
  catch (error) {
    status.set(file, { state: 'error', error: 'The connection dropped' })
  }
}

watch(files, all => all.filter(f => !status.has(f)).forEach(upload))
</script>

<template>
  <IFileUpload v-model="files" multiple :status-for="f => status.get(f)" @retry="upload" />
</template>
```
</Demo>

A failure is announced to screen readers once. Progress isn't, since reading out every percent would drown everything else.

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
| `statusFor` | `(file: File) => FileUploadStatus \| undefined` | — | Upload state per file, shown on its row |
| `removeLabel` | `string` | `'Remove'` | Accessible name for a row's remove action |
| `doneText` | `string` | `'Uploaded'` | Shown after the size once a file is done |
| `retryLabel` | `string` | `'Retry'` | Accessible name for a failed row's retry button |
| `failedText` | `string` | `'Upload failed'` | Error shown when a status has no `error` |
| `tooLargeText` | `string` | `'is too large'` | Message for a `size` rejection |
| `wrongTypeText` | `string` | `'is not an accepted type'` | Message for a `type` rejection |
| `tooManyText` | `string` | `'exceeds the file limit'` | Message for a `count` rejection |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Applied to the wrapper stacking the zone above the list |
| `ui` | `{ root?, dropzone?, input?, icon?, label?, browse?, hint?, list?, item?, thumbnail?, placeholder?, details?, name?, meta?, remove?, error?, progress?, actions?, retry? }` | — | Per-element class overrides |

## Events

| Event | Payload | When |
| --- | --- | --- |
| `reject` | `FileRejection[]` | One or more files were refused, once per drop or pick |
| `retry` | `File` | The retry button on a failed row was pressed |

```ts
interface FileRejection {
  file: File
  reason: 'type' | 'size' | 'count'
}

interface FileUploadStatus {
  state: 'uploading' | 'done' | 'error'
  progress?: number // 0–100
  error?: string
}
```

## Model

```ts
const files = ref<File[]>([])
```

The component never uploads anything: it hands you `File` objects, and posting them is yours. `statusFor` and `@retry` let it show how that's going.
