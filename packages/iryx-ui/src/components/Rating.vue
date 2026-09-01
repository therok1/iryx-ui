<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { StarIcon } from '@hugeicons/core-free-icons'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { ratingTheme } from '../theme/rating'
import Icon from './Icon.vue'

export interface RatingProps {
  /** How many icons to show. */
  max?: number
  /** Let the reader set the value. Without it this is a read-only score. */
  interactive?: boolean
  /**
   * Smallest step the reader can choose, e.g. `0.5` for half stars. Display is
   * continuous either way — a score of 3.7 fills seven tenths of the fourth.
   */
  step?: number
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  /** The icon to repeat. Any Hugeicons export, or a component that renders an SVG. */
  icon?: IconLike
  /**
   * Accessible name for the control, since a row of stars has no text of its
   * own — "Overall rating", "Rate this reply".
   */
  label?: string
  /** Print the score beside the icons, e.g. `4.5`. */
  showValue?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ fill: 'text-primary' }`. */
  ui?: {
    root?: string
    items?: string
    item?: string
    empty?: string
    fill?: string
    label?: string
  }
}

const props = withDefaults(defineProps<RatingProps>(), {
  max: 5,
  step: 1,
  icon: () => StarIcon,
  label: 'Rating',
  interactive: undefined,
  disabled: undefined,
  showValue: undefined,
  unstyled: undefined,
})

const model = defineModel<number>({ default: 0 })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  ratingTheme({
    size: props.size,
    interactive: props.interactive ?? false,
    disabled: props.disabled ?? false,
  }),
)

function slotClass(slot: keyof NonNullable<RatingProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}

/** Clamped, because a score out of range would paint outside the row. */
const value = computed(() => Math.min(Math.max(model.value, 0), props.max))

/**
 * How much of one icon is earned, as a percentage.
 *
 * Rounded to two places because the subtraction is floating point: a score of
 * 3.7 leaves `0.7000000000000002`, and the width would otherwise reach the DOM
 * as `70.00000000000002%`.
 */
function fillOf(index: number): number {
  const earned = Math.min(Math.max(value.value - index, 0), 1)
  return Math.round(earned * 10000) / 100
}

/** Rounded for the reader: `4.5`, never `4.500000001`. */
const printed = computed(() => Number(value.value.toFixed(2)).toString())

function set(next: number): void {
  if (props.disabled || !props.interactive)
    return
  const stepped = Math.round(next / props.step) * props.step
  model.value = Math.min(Math.max(stepped, props.step), props.max)
}

/**
 * What the row announces as.
 *
 * Interactive, it is a slider: one value on a continuum with a minimum and a
 * maximum, which is what `role="slider"` describes, and it brings the arrow
 * keys a reader already expects. Read-only, it is an image with a text
 * alternative — a screen reader should hear "4.5 out of 5", not five icons.
 *
 * Both live on one root. A `v-if`/`v-else` pair reads more clearly but needs a
 * comment above it to say why, and a leading comment node in a template makes
 * the component a fragment — which drops `class` and every attribute a caller
 * passes. Same trap as the one documented in `ScrollFade.vue`.
 */
const rootAttrs = computed(() =>
  props.interactive
    ? {
        'role': 'slider',
        'tabindex': props.disabled ? -1 : 0,
        'aria-label': props.label,
        'aria-valuemin': 0,
        'aria-valuemax': props.max,
        'aria-valuenow': value.value,
        'aria-valuetext': `${printed.value} out of ${props.max}`,
        'aria-disabled': props.disabled || undefined,
      }
    : { 'role': 'img', 'aria-label': `${props.label}: ${printed.value} out of ${props.max}` },
)

/*
 * Arrow keys move by one step, Home and End to the ends. The row is one tab
 * stop rather than `max` of them: a rating is a single value, and tabbing
 * through five stars to reach the next field is the sort of thing that makes
 * people stop using a keyboard.
 */
function onKeydown(event: KeyboardEvent): void {
  if (!props.interactive)
    return

  const moves: Record<string, number> = {
    ArrowRight: props.step,
    ArrowUp: props.step,
    ArrowLeft: -props.step,
    ArrowDown: -props.step,
  }

  if (event.key in moves) {
    event.preventDefault()
    set(value.value + moves[event.key]!)
  }
  else if (event.key === 'Home') {
    event.preventDefault()
    set(props.step)
  }
  else if (event.key === 'End') {
    event.preventDefault()
    set(props.max)
  }
}
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="slotClass('root', props.class)"
    @keydown="onKeydown"
  >
    <div :class="slotClass('items')" :aria-hidden="props.interactive ? undefined : 'true'">
      <span
        v-for="index in props.max"
        :key="index"
        :class="slotClass('item')"
        @click="set(index)"
      >
        <Icon :icon="props.icon" :class="slotClass('empty')" />
        <span :class="slotClass('fill')" :style="{ width: `${fillOf(index - 1)}%` }">
          <Icon :icon="props.icon" />
        </span>
      </span>
    </div>

    <span v-if="props.showValue" :class="slotClass('label')" aria-hidden="true">{{ printed }}</span>
  </div>
</template>
