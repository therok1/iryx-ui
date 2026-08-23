<script setup lang="ts">
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import {
  TagsInputClear,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { tagsInputTheme } from '../theme/tags-input'
import Icon from './Icon.vue'

export interface TagsInputProps {
  modelValue?: string[]
  placeholder?: string
  /** Stop accepting tags past this many. */
  max?: number
  /**
   * What ends a tag. A comma by default, so pasting a comma-separated list
   * does the obvious thing.
   */
  delimiter?: string | RegExp
  /** Allow the same tag twice. Off by default — a repeated tag is usually a slip. */
  duplicate?: boolean
  /** Split a pasted string on the delimiter instead of taking it as one tag. */
  addOnPaste?: boolean
  /** Commit the typed text when Tab moves focus on. */
  addOnTab?: boolean
  /**
   * Commit the typed text when focus leaves. Worth turning on: half-typed
   * text silently discarded on blur is the classic way to lose a tag.
   */
  addOnBlur?: boolean
  /** Show a control that empties the whole field. */
  clearable?: boolean
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ tag: 'bg-accent' }`. */
  ui?: {
    root?: string
    tag?: string
    tagText?: string
    tagDelete?: string
    input?: string
    clear?: string
  }
}

/*
 * The root is the wrapper holding the tags; the thing a reader types into,
 * and the thing a `<label for>` has to point at, is the input inside it. So
 * `id`, `aria-label` and the rest are bound to that input rather than left to
 * land on the surrounding box — axe caught the field as unlabelled otherwise.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TagsInputProps>(), {
  delimiter: ',',
  invalid: undefined,
  unstyled: undefined,
})

const emits = defineEmits<{
  'update:modelValue': [value: string[]]
  /** A tag was rejected — a duplicate, or one past `max`. */
  'invalidTag': [value: string]
  'addTag': [value: string]
  'removeTag': [value: string]
}>()

/** Reka accepts objects too; this wrapper is deliberately strings only. */
const tags = computed(() => props.modelValue ?? [])

const atMax = computed(() => props.max !== undefined && tags.value.length >= props.max)

const field = useFormField()
const inputId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const slots = computed(() => tagsInputTheme({ size: props.size, invalid: isInvalid.value }))

function slotClass(name: keyof NonNullable<TagsInputProps['ui']>, extra?: string) {
  const override = [props.ui?.[name], extra]
  return isUnstyled.value ? override : slots.value[name]({ class: override })
}
</script>

<template>
  <TagsInputRoot
    :model-value="tags"
    :max="props.max"
    :delimiter="props.delimiter"
    :duplicate="props.duplicate"
    :add-on-paste="props.addOnPaste"
    :add-on-tab="props.addOnTab"
    :add-on-blur="props.addOnBlur"
    :disabled="props.disabled"
    :class="slotClass('root', props.class)"
    @update:model-value="value => emits('update:modelValue', value as string[])"
    @invalid="value => emits('invalidTag', String(value))"
    @add-tag="value => emits('addTag', String(value))"
    @remove-tag="value => emits('removeTag', String(value))"
  >
    <TagsInputItem
      v-for="tag in tags"
      :key="tag"
      :value="tag"
      :class="slotClass('tag')"
    >
      <slot name="tag" :tag="tag">
        <TagsInputItemText :class="slotClass('tagText')" />
        <TagsInputItemDelete :aria-label="`Remove ${tag}`" :class="slotClass('tagDelete')">
          <Icon :icon="Cancel01Icon" />
        </TagsInputItemDelete>
      </slot>
    </TagsInputItem>

    <!--
      Read-only at the limit rather than removed. Unmounting it would take
      away the element a `<label for>` points at and the field's focus target,
      so a full input would quietly become an unlabelled one.
    -->
    <TagsInputInput
      :id="inputId"
      :placeholder="atMax ? undefined : props.placeholder"
      :readonly="atMax || undefined"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="field?.describedBy.value"
      v-bind="$attrs"
      :class="slotClass('input')"
    />

    <TagsInputClear v-if="props.clearable && tags.length" aria-label="Clear all" :class="slotClass('clear')">
      <slot name="clear">
        <Icon :icon="Cancel01Icon" />
      </slot>
    </TagsInputClear>
  </TagsInputRoot>
</template>
