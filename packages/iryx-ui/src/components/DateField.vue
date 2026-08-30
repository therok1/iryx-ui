<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { DateFieldInput, DateFieldRoot } from 'reka-ui'
import { computed } from 'vue'
import { toCalendarDate, toIsoDate } from '../composables/date'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { dateFieldTheme } from '../theme/date-field'

export interface DateFieldProps {
  /** ISO `YYYY-MM-DD`, never a `Date`. See `composables/date.ts` for why. */
  modelValue?: string | null
  /** Earliest and latest allowed, in the same ISO form. */
  minValue?: string
  maxValue?: string
  /** Orders the segments and names the months — `en-GB` gives day first. */
  locale?: string
  /** Refuse a date. Given an ISO `YYYY-MM-DD` string. */
  isUnavailable?: (date: string) => boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  id?: string
  /** Submitted with a surrounding native form. */
  name?: string
  required?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ segment: 'px-1' }`. */
  ui?: {
    root?: string
    segment?: string
    literal?: string
  }
}

/**
 * A date typed one segment at a time — day, month, year — each its own
 * arrow-key control, ordered by the locale.
 *
 * The one to reach for when the reader knows the date already: a birthday, an
 * invoice date, anything where hunting for a day in a grid is slower than
 * typing it. [`IDatePicker`](/components/date-picker) is the one for choosing
 * a date, and pairs with this rather than replacing it.
 */
const props = withDefaults(defineProps<DateFieldProps>(), {
  invalid: undefined,
  unstyled: undefined,
})

const emits = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const field = useFormField()
const fieldId = computed(() => props.id ?? field?.id.value)
if (field && props.id)
  field.id.value = props.id

/**
 * Out of bounds, or refused. Reka works this out too and exposes it as
 * `data-invalid`, but it stops there — nothing sets `aria-invalid`, so a
 * value outside `minValue`/`maxValue` was accepted in silence.
 *
 * ISO strings compare as strings, which is most of the reason the model is
 * one. A malformed value is not out of range, it is not a date at all, and
 * the segments already show it as empty.
 */
const outOfRange = computed(() => {
  const value = props.modelValue
  if (!value || !toCalendarDate(value))
    return false
  if (props.minValue && value < props.minValue)
    return true
  if (props.maxValue && value > props.maxValue)
    return true
  return props.isUnavailable?.(value) ?? false
})

/*
 * A caller's `invalid: false` cannot suppress it: being outside the bounds
 * is a fact about the value, not a presentation choice.
 */
const isInvalid = computed(() =>
  (props.invalid ?? field?.invalid.value ?? false) || outOfRange.value,
)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/** Reka hands the predicate a `DateValue`; the caller works in ISO strings. */
const isDateUnavailable = computed(() => {
  const predicate = props.isUnavailable
  if (!predicate)
    return undefined
  return (date: Parameters<typeof toIsoDate>[0]) => {
    const iso = toIsoDate(date)
    return iso ? predicate(iso) : false
  }
})

const theme = computed(() => dateFieldTheme({ size: props.size, invalid: isInvalid.value }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const segmentClass = computed(() =>
  isUnstyled.value ? props.ui?.segment : theme.value.segment({ class: props.ui?.segment }),
)
const literalClass = computed(() =>
  isUnstyled.value ? props.ui?.literal : theme.value.literal({ class: props.ui?.literal }),
)
</script>

<template>
  <DateFieldRoot
    :id="fieldId"
    v-slot="{ segments }"
    :model-value="toCalendarDate(props.modelValue)"
    :min-value="toCalendarDate(props.minValue)"
    :max-value="toCalendarDate(props.maxValue)"
    :locale="props.locale"
    :is-date-unavailable="isDateUnavailable"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :name="props.name"
    :required="props.required"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="field?.describedBy.value"
    :class="rootClass"
    @update:model-value="value => emits('update:modelValue', toIsoDate(value))"
  >
    <!--
      Reka hands back literals (the `/`) alongside the editable parts. A
      literal is punctuation, so it renders as plain text rather than as
      another stop on the way through the field.
    -->
    <template v-for="item in segments" :key="item.part">
      <span v-if="item.part === 'literal'" :class="literalClass">{{ item.value }}</span>
      <DateFieldInput v-else :part="item.part" :class="segmentClass">
        {{ item.value }}
      </DateFieldInput>
    </template>
  </DateFieldRoot>
</template>
