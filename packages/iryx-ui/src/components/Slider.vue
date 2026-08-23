<script setup lang="ts">
import type { SliderRootProps } from 'reka-ui'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useId } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { sliderTheme } from '../theme/slider'

export interface SliderProps extends /* @vue-ignore */ Omit<SliderRootProps, 'modelValue' | 'defaultValue'> {
  /**
   * A single number for one thumb, an array for a range. Whichever shape you
   * pass back is the shape you get out, so `v-model` on a plain `ref(50)`
   * stays a number instead of silently becoming `[50]`.
   */
  modelValue?: number | number[] | null
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  inverted?: boolean
  /** Keeps range thumbs from crossing or stacking. */
  minStepsBetweenThumbs?: number
  size?: 'sm' | 'md' | 'lg'
  /** Text shown above the track. */
  label?: string
  /** Show the current value beside the label. */
  showValue?: boolean
  /** Show `min` and `max` captions under the track. Horizontal only. */
  showScale?: boolean
  /**
   * Format the displayed value, the scale captions and each thumb's
   * accessible label. Override for units or non-English locales.
   */
  formatValue?: (value: number) => string
  /**
   * How each thumb of a range is named after the label — "Price minimum",
   * "Price maximum". Override for non-English locales.
   */
  rangeLabels?: [string, string]
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ thumb: 'size-6' }`. */
  ui?: {
    root?: string
    header?: string
    label?: string
    value?: string
    slider?: string
    track?: string
    range?: string
    thumb?: string
    scale?: string
  }
}

/**
 * The root is a plain wrapper; the element carrying `role="group"` and the
 * hidden form inputs is the slider inside it. Attributes left to fall through
 * would land on the wrapper, so they are bound to the control explicitly —
 * the same fix `ISwitch` and `IProgress` needed.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  rangeLabels: () => ['minimum', 'maximum'],
  unstyled: undefined,
})

const emits = defineEmits<{
  'update:modelValue': [value: number | number[]]
  /** Fired once the drag or key repeat ends — the value worth saving. */
  'valueCommit': [value: number | number[]]
}>()

/** `true` while the caller is driving a single thumb with a plain number. */
const isScalar = computed(() => typeof props.modelValue === 'number')

/** Reka always works in arrays; an unset value falls back to one thumb at `min`. */
const values = computed<number[]>(() => {
  if (Array.isArray(props.modelValue))
    return props.modelValue
  if (typeof props.modelValue === 'number')
    return [props.modelValue]
  return [props.min]
})

/** Give back whichever shape came in, so `v-model` round-trips cleanly. */
function toModel(next: number[]): number | number[] {
  return isScalar.value ? (next[0] ?? props.min) : next
}

const format = computed(() => props.formatValue ?? ((value: number) => String(value)))

/** A range reads as "20 – 80"; a single thumb is just its number. */
const valueText = computed(() => values.value.map(v => format.value(v)).join(' – '))

/**
 * The thumb is the element with `role="slider"`, so it is the thumb — not the
 * group around it — that has to carry the accessible name; naming only the
 * group leaves an unnamed ARIA input field. A range names each end after the
 * label so "minimum" and "maximum" are not two anonymous handles, and an
 * unlabelled slider falls back to its own value, which is at least something.
 */
function thumbLabel(index: number, value: number) {
  if (!props.label)
    return values.value.length > 1 ? props.rangeLabels[index] ?? undefined : format.value(value)
  return values.value.length > 1 ? `${props.label} ${props.rangeLabels[index] ?? ''}`.trim() : props.label
}

const autoId = useId()
const labelId = computed(() => `${props.id ?? autoId}-label`)
const hasHeader = computed(() => Boolean(props.label || props.showValue))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const slots = computed(() => sliderTheme({
  orientation: props.orientation,
  size: props.size,
  disabled: props.disabled ?? false,
}))

function slotClass(name: keyof NonNullable<SliderProps['ui']>, extra?: string) {
  const override = [props.ui?.[name], extra]
  return isUnstyled.value ? override : slots.value[name]({ class: override })
}
</script>

<template>
  <div :class="slotClass('root', props.class)">
    <div v-if="hasHeader" :class="slotClass('header')">
      <span v-if="props.label || $slots.label" :id="labelId" :class="slotClass('label')">
        <slot name="label">{{ props.label }}</slot>
      </span>
      <span v-if="props.showValue" :class="slotClass('value')">
        <slot name="value" :values="values" :text="valueText">{{ valueText }}</slot>
      </span>
    </div>

    <SliderRoot
      :model-value="values"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :disabled="props.disabled"
      :orientation="props.orientation"
      :inverted="props.inverted"
      :min-steps-between-thumbs="props.minStepsBetweenThumbs"
      :aria-labelledby="props.label ? labelId : undefined"
      v-bind="$attrs"
      :class="slotClass('slider')"
      @update:model-value="value => value && emits('update:modelValue', toModel(value))"
      @value-commit="value => emits('valueCommit', toModel(value))"
    >
      <SliderTrack :class="slotClass('track')">
        <SliderRange :class="slotClass('range')" />
      </SliderTrack>
      <SliderThumb
        v-for="(value, index) in values"
        :key="index"
        :aria-label="thumbLabel(index, value)"
        :aria-valuetext="format(value)"
        :class="slotClass('thumb')"
      />
    </SliderRoot>

    <div v-if="props.showScale && props.orientation !== 'vertical'" :class="slotClass('scale')">
      <span>{{ format(props.min) }}</span>
      <span>{{ format(props.max) }}</span>
    </div>
  </div>
</template>
