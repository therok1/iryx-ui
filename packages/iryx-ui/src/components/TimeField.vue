<script setup lang="ts">
import { TimeFieldInput, TimeFieldRoot } from 'reka-ui'
import { computed } from 'vue'
import { toIsoTime, toTime } from '../composables/date'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { timeFieldTheme } from '../theme/time-field'

export interface TimeFieldProps {
  /**
   * The time as a `HH:mm` (or `HH:mm:ss`) **string** on a 24-hour clock,
   * never a `Date`. A `Date` carries a date and a time zone nobody asked for,
   * and "half past nine" is neither. Padded so it sorts as a string.
   */
  modelValue?: string | null
  /** How much of the time to show. `second` adds a seconds segment. */
  granularity?: 'hour' | 'minute' | 'second'
  /**
   * 12- or 24-hour display. Left unset it follows `locale`, which is the
   * right default — this is a display choice, not a data one; the model
   * stays 24-hour either way.
   */
  hourCycle?: 12 | 24
  locale?: string
  /** Stepping interval per segment, for arrow keys and scrolling. */
  step?: { hour?: number, minute?: number, second?: number }
  /** Earliest and latest allowed, in the same `HH:mm` form. */
  minValue?: string
  maxValue?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ segment: 'px-1' }`. */
  ui?: {
    root?: string
    segment?: string
    literal?: string
  }
}

/**
 * A time entered one segment at a time — hour, minute, optionally seconds —
 * each its own arrow-key control.
 *
 * Chosen over a bare `<input type="time">` because that gives no say over the
 * hour cycle, the granularity, or how each part is announced, and it renders
 * a different control in every browser.
 */
const props = withDefaults(defineProps<TimeFieldProps>(), {
  invalid: undefined,
  unstyled: undefined,
})

const emits = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const field = useFormField()
const fieldId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => timeFieldTheme({ size: props.size, invalid: isInvalid.value }))

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
  <TimeFieldRoot
    :id="fieldId"
    v-slot="{ segments }"
    :model-value="toTime(props.modelValue)"
    :granularity="props.granularity"
    :hour-cycle="props.hourCycle"
    :locale="props.locale"
    :step="props.step"
    :min-value="toTime(props.minValue)"
    :max-value="toTime(props.maxValue)"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="field?.describedBy.value"
    :class="rootClass"
    @update:model-value="value => emits('update:modelValue', toIsoTime(value))"
  >
    <!--
      Reka hands back literals (the `:`) alongside the editable parts. A
      literal is punctuation, so it renders as plain text rather than as
      another stop on the way through the field.
    -->
    <template v-for="item in segments" :key="item.part">
      <span v-if="item.part === 'literal'" :class="literalClass">{{ item.value }}</span>
      <TimeFieldInput v-else :part="item.part" :class="segmentClass">
        {{ item.value }}
      </TimeFieldInput>
    </template>
  </TimeFieldRoot>
</template>
