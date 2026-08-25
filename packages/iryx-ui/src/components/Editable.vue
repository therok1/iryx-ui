<script setup lang="ts">
import { Cancel01Icon, Edit02Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import {
  EditableArea,
  EditableCancelTrigger,
  EditableEditTrigger,
  EditableInput,
  EditablePreview,
  EditableRoot,
  EditableSubmitTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { editableTheme } from '../theme/editable'
import Icon from './Icon.vue'

export interface EditableProps {
  modelValue?: string
  placeholder?: string
  /**
   * What puts it into edit mode. `focus` is the default and the kindest — a
   * double click is invisible to anyone who does not already know it is there,
   * and impossible to discover with a keyboard.
   */
  activationMode?: 'focus' | 'dblclick' | 'none'
  /**
   * What commits the value. `blur` commits when focus leaves, `enter` on the
   * key, `both` on either, `none` only through the controls.
   */
  submitMode?: 'blur' | 'enter' | 'both' | 'none'
  /** Show edit, save and cancel buttons beside the value. */
  controls?: boolean
  /** Select the existing text when editing starts, so typing replaces it. */
  selectOnFocus?: boolean
  /** Start in edit mode — for a row that was just added and has no value yet. */
  startWithEditMode?: boolean
  maxLength?: number
  /**
   * Size the field to its text. On by default: an input left at its own
   * intrinsic width is about twenty characters wide whatever it holds, so the
   * line jumps as soon as an edit starts.
   */
  autoResize?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  id?: string
  /** Submitted with a surrounding native form. */
  name?: string
  required?: boolean
  /** Control labels — override for non-English apps. */
  editLabel?: string
  submitLabel?: string
  cancelLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: {
    root?: string
    area?: string
    preview?: string
    placeholder?: string
    input?: string
    control?: string
  }
}

/**
 * Text that becomes a field where it sits — a title, a row's name, a note.
 *
 * For editing one value in place, where opening a form or a dialog to change
 * a single line is more ceremony than the change deserves.
 */
const props = withDefaults(defineProps<EditableProps>(), {
  submitMode: 'both',
  autoResize: true,
  editLabel: 'Edit',
  submitLabel: 'Save',
  cancelLabel: 'Cancel',
  invalid: undefined,
  unstyled: undefined,
})

const emits = defineEmits<{
  'update:modelValue': [value: string]
  'submit': [value: string]
}>()

defineSlots<{
  /** Replaces the rendered value. Given the value and whether it is empty. */
  preview?: (props: { value: string, isEmpty: boolean }) => unknown
}>()

/**
 * Reka commits on blur through its dismissable-layer stack, and that stack
 * treats *any* later `[data-dismissable-layer]` in the document as a layer
 * above this one — so clicking a second editable further down the page leaves
 * the first one still editing. Fine for a popover inside a dialog, wrong for
 * two siblings in a table.
 *
 * So Reka is left the key handling and we take blur ourselves.
 */
const rekaSubmitMode = computed(() => {
  if (props.submitMode === 'both')
    return 'enter'
  return props.submitMode === 'blur' ? 'none' : props.submitMode
})

function handleBlur(event: FocusEvent, submit: () => void): void {
  if (props.submitMode !== 'blur' && props.submitMode !== 'both')
    return
  // Focus moving to this editable's own controls is not leaving it.
  const next = event.relatedTarget as Node | null
  const root = (event.currentTarget as HTMLElement).closest('[data-dismissable-layer]')
  if (next && root?.contains(next))
    return
  submit()
}

const field = useFormField()
const fieldId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => editableTheme({ size: props.size, invalid: isInvalid.value }))

function slotClass(slot: keyof NonNullable<EditableProps['ui']>, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <EditableRoot
    :id="fieldId"
    v-slot="{ isEditing, isEmpty, modelValue: value, edit, submit, cancel }"
    :model-value="props.modelValue"
    :placeholder="props.placeholder"
    :activation-mode="props.activationMode"
    :submit-mode="rekaSubmitMode"
    :select-on-focus="props.selectOnFocus"
    :start-with-edit-mode="props.startWithEditMode"
    :max-length="props.maxLength"
    :auto-resize="props.autoResize"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :name="props.name"
    :required="props.required"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="field?.describedBy.value"
    :class="slotClass('root', props.class)"
    @update:model-value="next => emits('update:modelValue', next ?? '')"
    @submit="() => emits('submit', props.modelValue ?? '')"
  >
    <EditableArea :class="slotClass('area')">
      <EditablePreview :class="slotClass('preview', isEmpty ? theme.placeholder() : undefined)">
        <slot name="preview" :value="value ?? ''" :is-empty="isEmpty" />
      </EditablePreview>
      <EditableInput :class="slotClass('input')" @blur="(event: FocusEvent) => handleBlur(event, submit)" />
    </EditableArea>

    <!--
      Only ever one set on screen: an edit button while reading, save and
      cancel while editing. Showing all three at once leaves two of them inert
      and the reader working out which one applies.
    -->
    <template v-if="props.controls">
      <EditableEditTrigger
        v-if="!isEditing"
        :aria-label="props.editLabel"
        :class="slotClass('control')"
        @click="edit"
      >
        <Icon :icon="Edit02Icon" />
      </EditableEditTrigger>

      <template v-else>
        <EditableSubmitTrigger
          :aria-label="props.submitLabel"
          :class="slotClass('control')"
          @click="submit"
        >
          <Icon :icon="Tick02Icon" />
        </EditableSubmitTrigger>
        <EditableCancelTrigger
          :aria-label="props.cancelLabel"
          :class="slotClass('control')"
          @click="cancel"
        >
          <Icon :icon="Cancel01Icon" />
        </EditableCancelTrigger>
      </template>
    </template>
  </EditableRoot>
</template>
