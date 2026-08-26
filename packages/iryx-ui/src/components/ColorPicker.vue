<script setup lang="ts">
import type { Color, HSBColor } from 'reka-ui'
import type { ClassValue } from '../class-value'
import {
  ColorAreaArea,
  ColorAreaRoot,
  ColorAreaThumb,
  ColorFieldInput,
  ColorFieldRoot,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  ColorSwatchPickerItem,
  ColorSwatchPickerItemSwatch,
  ColorSwatchPickerRoot,
  colorToString,
  convertToHsb,
  normalizeColor,
} from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useIryxUiConfig } from '../config'
import { colorPickerTheme } from '../theme/color-picker'

export interface ColorPickerProps {
  /**
   * The colour as a hex **string** — `#16a372`, or `#16a372ff` with `alpha`.
   * A string is what goes into a stylesheet, a database column and a design
   * token, so it is what the model holds; the colour object stays inside.
   */
  modelValue?: string
  /** Add an opacity ramp, and eight hex digits to the model. */
  alpha?: boolean
  /** Hide the hex field, leaving only the visual controls. */
  hideField?: boolean
  /**
   * Names the hex input. It sits among unlabelled visual controls, so without
   * one it reaches a screen reader as an anonymous text box.
   */
  fieldLabel?: string
  /** Preset colours offered under the picker. */
  swatches?: string[]
  disabled?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ area: 'h-56' }`. */
  ui?: {
    root?: string
    area?: string
    thumb?: string
    sliderThumb?: string
    slider?: string
    checkerboard?: string
    track?: string
    field?: string
    input?: string
    preview?: string
    swatches?: string
    swatch?: string
  }
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '#000000',
  fieldLabel: 'Hex colour',
  unstyled: undefined,
})

const emits = defineEmits<{ 'update:modelValue': [value: string] }>()

const set = (value: string) => emits('update:modelValue', value)

/** Malformed input resolves to red rather than throwing mid-render. */
function parse(value: string): HSBColor {
  try {
    return convertToHsb(normalizeColor(value))
  }
  catch {
    return { space: 'hsb', h: 0, s: 100, b: 100, alpha: 1 }
  }
}

const toHex = (c: Color) => colorToString(c, 'hex')

/**
 * The colour the controls are driven from, held as an object rather than
 * re-derived from `modelValue` on every move.
 *
 * Hex is eight bits per channel, so a round trip through it quantises hue,
 * saturation and brightness. Feeding the thumbs back their own rounded value
 * mid-drag made the *other* thumb twitch as its derived position shifted
 * under it. The model still receives hex — that is the public contract — but
 * nothing here reads it back while the reader is dragging.
 */
const colour = ref<HSBColor>(parse(props.modelValue))

/**
 * Black and the greys have no hue: once saturation or brightness reaches
 * zero, every hue converts to the same colour, so an incoming hex cannot
 * carry one. Keeping the previous hue is what stops the ramp snapping to red
 * when the plane is dragged into a corner.
 */
const isAchromatic = (c: HSBColor) => c.s === 0 || c.b === 0

watch(() => props.modelValue, (next) => {
  // Ignore the echo of our own emit; only a genuine outside change re-parses.
  if (toHex(colour.value) === next)
    return
  const parsed = parse(next)
  colour.value = isAchromatic(parsed) ? { ...parsed, h: colour.value.h } : parsed
})

function commit(next: HSBColor) {
  colour.value = next
  set(toHex(next))
}

/** Each control owns its own channels; the rest are carried over untouched. */
function onAreaChange(next: Color) {
  return commit({ ...convertToHsb(next), h: colour.value.h, alpha: colour.value.alpha })
}

function onHueChange(next: Color) {
  return commit({ ...colour.value, h: convertToHsb(next).h })
}

function onAlphaChange(next: Color) {
  return commit({ ...colour.value, alpha: convertToHsb(next).alpha })
}

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => colorPickerTheme())

function slotClass(name: keyof NonNullable<ColorPickerProps['ui']>, extra?: ClassValue) {
  const override = [props.ui?.[name], extra].filter(Boolean).join(' ')
  return isUnstyled.value ? override : theme.value[name]({ class: override })
}
</script>

<template>
  <div :class="slotClass('root', props.class)">
    <!--
      Saturation across, brightness down, with hue left to the ramp below.
      Reka's default plane puts *hue* on the x axis, which duplicates the ramp
      and leaves brightness unreachable — the picker then cannot express a
      pure `#ff0000` at all.

      Unlike the ramps, the plane is not painted for us either: `ColorAreaRoot`
      hands the gradient down through its slot and something has to apply it.
      Miss that and the area renders as a blank box that still tracks input.
    -->
    <ColorAreaRoot
      v-slot="{ style: areaStyle }"
      color-space="hsb"
      x-channel="saturation"
      y-channel="brightness"
      :model-value="colour"
      :disabled="props.disabled"
      :class="slotClass('area')"
      @update:color="onAreaChange"
    >
      <ColorAreaArea class="size-full rounded-[inherit]" :style="areaStyle">
        <ColorAreaThumb :class="slotClass('thumb')" />
      </ColorAreaArea>
    </ColorAreaRoot>

    <ColorSliderRoot
      color-space="hsb"
      channel="hue"
      :model-value="colour"
      :disabled="props.disabled"
      :class="slotClass('slider')"
      @update:color="onHueChange"
    >
      <ColorSliderTrack :class="slotClass('track')" />
      <ColorSliderThumb :class="[slotClass('thumb'), slotClass('sliderThumb')]" />
    </ColorSliderRoot>

    <!--
      The alpha ramp is transparent at one end, so a chequerboard sits behind
      it — without one, "fully transparent" is indistinguishable from white.
    -->
    <ColorSliderRoot
      v-if="props.alpha"
      color-space="hsb"
      channel="alpha"
      :model-value="colour"
      :disabled="props.disabled"
      :class="slotClass('slider')"
      @update:color="onAlphaChange"
    >
      <span :class="slotClass('checkerboard')" />
      <ColorSliderTrack :class="slotClass('track')" />
      <ColorSliderThumb :class="[slotClass('thumb'), slotClass('sliderThumb')]" />
    </ColorSliderRoot>

    <ColorFieldRoot
      v-if="!props.hideField"
      :model-value="props.modelValue"
      :disabled="props.disabled"
      :class="slotClass('field')"
      @update:model-value="set"
    >
      <span :class="slotClass('preview')">
        <span :class="slotClass('checkerboard', 'rounded-none')" />
        <span class="absolute inset-0" :style="{ background: props.modelValue }" />
      </span>
      <ColorFieldInput :aria-label="props.fieldLabel" :class="slotClass('input')" />
    </ColorFieldRoot>

    <ColorSwatchPickerRoot
      v-if="props.swatches?.length"
      :model-value="props.modelValue"
      :class="slotClass('swatches')"
      @update:model-value="value => set(String(value))"
    >
      <ColorSwatchPickerItem
        v-for="colour in props.swatches"
        :key="colour"
        :value="colour"
        :class="slotClass('swatch')"
      >
        <!-- Reka publishes the colour as a CSS variable; painting it is ours. -->
        <ColorSwatchPickerItemSwatch class="size-full rounded-[inherit] bg-[var(--reka-color-swatch-color)]" />
      </ColorSwatchPickerItem>
    </ColorSwatchPickerRoot>
  </div>
</template>
