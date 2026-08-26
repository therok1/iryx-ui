<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Delete02Icon, File01Icon, Upload05Icon } from '@hugeicons/core-free-icons'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { fileUploadTheme } from '../theme/file-upload'
import Button from './Button.vue'
import Icon from './Icon.vue'

/** Why a file was turned away, so the caller can word its own message. */
export interface FileRejection {
  file: File
  reason: 'type' | 'size' | 'count'
}

export interface FileUploadProps {
  /** Accept more than one file. The model is an array either way. */
  multiple?: boolean
  /** Same syntax as the native attribute: `image/*`, `.pdf`, `image/png`. */
  accept?: string
  /** Largest accepted size, in bytes. */
  maxSize?: number
  /** Cap on how many files may be held at once. */
  maxFiles?: number
  disabled?: boolean
  /** Mark the field as invalid — styles the border and ring red. */
  invalid?: boolean
  id?: string
  /** Prompt inside the drop zone. */
  label?: string
  /** Secondary line under the prompt — good place for the accepted types. */
  hint?: string
  /** Text on the browse button. */
  browseLabel?: string
  /** Labels and messages — override for non-English apps. */
  removeLabel?: string
  tooLargeText?: string
  wrongTypeText?: string
  tooManyText?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  /** Applied to the outer wrapper, which stacks the zone above the list. */
  class?: ClassValue
  /** Override classes per slot, e.g. `{ dropzone: 'py-10' }`. */
  ui?: Partial<Record<
    'root' | 'dropzone' | 'input' | 'icon' | 'label' | 'browse' | 'hint' | 'list'
    | 'item' | 'thumbnail' | 'placeholder' | 'details' | 'name' | 'meta' | 'remove' | 'error',
    string
  >>
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  label: 'Drag and drop a file here',
  browseLabel: 'Browse files',
  removeLabel: 'Remove',
  tooLargeText: 'is too large',
  wrongTypeText: 'is not an accepted type',
  tooManyText: 'exceeds the file limit',
  invalid: undefined,
  unstyled: undefined,
})

const emit = defineEmits<{
  /** Files the component refused, with the reason for each. */
  reject: [rejections: FileRejection[]]
}>()

/**
 * Always an array, even when `multiple` is false — a `File | File[]` union
 * would make every caller narrow the type before touching it, and the single
 * case is just an array that holds at most one.
 */
const model = defineModel<File[]>({ default: () => [] })

const field = useFormField()
const inputId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const rejections = ref<FileRejection[]>([])

/**
 * The native picker already filters by `accept`, but a drop does not — a file
 * dragged in bypasses it entirely, so the check has to live here too.
 */
function matchesAccept(file: File): boolean {
  if (!props.accept)
    return true

  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()

  return props.accept.split(',').map(pattern => pattern.trim().toLowerCase()).filter(Boolean).some((pattern) => {
    if (pattern.startsWith('.'))
      return name.endsWith(pattern)
    if (pattern.endsWith('/*'))
      return type.startsWith(pattern.slice(0, -1))
    return type === pattern
  })
}

function accept(incoming: File[]): void {
  const kept: File[] = []
  const refused: FileRejection[] = []

  // Replacing rather than appending when single, so re-picking swaps the file.
  const existing = props.multiple ? model.value : []

  for (const file of incoming) {
    if (!matchesAccept(file)) {
      refused.push({ file, reason: 'type' })
      continue
    }
    if (props.maxSize != null && file.size > props.maxSize) {
      refused.push({ file, reason: 'size' })
      continue
    }

    const limit = props.multiple ? props.maxFiles : 1
    if (limit != null && existing.length + kept.length >= limit) {
      refused.push({ file, reason: 'count' })
      continue
    }

    kept.push(file)
  }

  rejections.value = refused
  if (refused.length)
    emit('reject', refused)

  if (kept.length)
    model.value = [...existing, ...kept]
}

const inputEl = ref<HTMLInputElement>()

function onSelect(event: Event): void {
  const input = event.target as HTMLInputElement
  accept([...(input.files ?? [])])
  // Reset, or picking the same file twice in a row fires no change event.
  input.value = ''
}

function remove(index: number): void {
  model.value = model.value.filter((_, position) => position !== index)
}

/**
 * Drag state, counted rather than toggled: `dragleave` fires every time the
 * pointer crosses onto a child element, so a plain boolean flickers off while
 * the file is still over the zone.
 */
const dragDepth = ref(0)
const isDragging = computed(() => dragDepth.value > 0)

function onDragEnter(): void {
  if (!props.disabled)
    dragDepth.value++
}

function onDragLeave(): void {
  if (dragDepth.value > 0)
    dragDepth.value--
}

function onDrop(event: DragEvent): void {
  dragDepth.value = 0
  if (props.disabled)
    return
  accept([...(event.dataTransfer?.files ?? [])])
}

/**
 * Object URLs are held until revoked, so they are tracked per file and
 * released as soon as the file leaves the list or the component unmounts.
 */
const previews = ref(new Map<File, string>())

watch(model, (files) => {
  for (const [file, url] of previews.value) {
    if (!files.includes(file)) {
      URL.revokeObjectURL(url)
      previews.value.delete(file)
    }
  }
  for (const file of files) {
    if (file.type.startsWith('image/') && !previews.value.has(file))
      previews.value.set(file, URL.createObjectURL(file))
  }
}, { immediate: true, deep: true })

onBeforeUnmount(() => {
  for (const url of previews.value.values())
    URL.revokeObjectURL(url)
})

/** Rounded to one decimal, in the units a person would actually say. */
function formatSize(bytes: number): string {
  const units = ['B', 'kB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${unit === 0 ? value : Math.round(value * 10) / 10} ${units[unit]}`
}

function messageFor(rejection: FileRejection): string {
  const reason = rejection.reason === 'size'
    ? props.tooLargeText
    : rejection.reason === 'type' ? props.wrongTypeText : props.tooManyText
  return `${rejection.file.name} ${reason}`
}

const theme = computed(() =>
  fileUploadTheme({
    dragging: isDragging.value,
    invalid: isInvalid.value,
    disabled: props.disabled,
  }),
)

function slotClass(slot: keyof NonNullable<FileUploadProps['ui']>, extra?: ClassValue) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}

/** Button types `class` as a string, so this slot cannot hand back an array. */
const browseClass = computed(() =>
  isUnstyled.value ? props.ui?.browse : theme.value.browse({ class: props.ui?.browse }),
)
</script>

<template>
  <div :class="slotClass('root', props.class)">
    <label
      :class="slotClass('dropzone')"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        :id="inputId"
        ref="inputEl"
        type="file"
        :multiple="props.multiple"
        :accept="props.accept"
        :disabled="props.disabled"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="field?.describedBy.value"
        :class="slotClass('input')"
        @change="onSelect"
      >
      <span :class="slotClass('icon')">
        <Icon :icon="Upload05Icon" />
      </span>
      <span :class="slotClass('label')">{{ props.label }}</span>
      <span v-if="props.hint" :class="slotClass('hint')">{{ props.hint }}</span>
      <!--
        Last, as the call to action — the hint qualifies what is being asked
        for, so it belongs above the control that acts on it.

        `as="span"`: a real <button> here would sit inside the <label> and
        swallow the click the label exists to provide, as well as nesting one
        interactive element in another. The off-screen input stays the control,
        so the keyboard path is unaffected.
      -->
      <Button as="span" variant="outline" size="sm" :class="browseClass">
        {{ props.browseLabel }}
      </Button>
    </label>

    <p v-for="rejection in rejections" :key="rejection.file.name" :class="slotClass('error')">
      {{ messageFor(rejection) }}
    </p>

    <ul v-if="model.length" :class="slotClass('list')">
      <li v-for="(file, index) in model" :key="`${file.name}-${index}`" :class="slotClass('item')">
        <img
          v-if="previews.get(file)"
          :src="previews.get(file)"
          alt=""
          :class="slotClass('thumbnail')"
        >
        <span v-else :class="slotClass('placeholder')">
          <Icon :icon="File01Icon" />
        </span>

        <span :class="slotClass('details')">
          <span :class="slotClass('name')">{{ file.name }}</span>
          <span :class="slotClass('meta')">{{ formatSize(file.size) }}</span>
        </span>

        <button
          type="button"
          :aria-label="`${props.removeLabel} ${file.name}`"
          :disabled="props.disabled"
          :class="slotClass('remove')"
          @click="remove(index)"
        >
          <Icon :icon="Delete02Icon" />
        </button>
      </li>
    </ul>
  </div>
</template>
