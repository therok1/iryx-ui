<script setup lang="ts">
import type { SignaturePoint, SignatureStroke } from '../composables/signature'
import { ArrowTurnBackwardIcon, Delete02Icon } from '@hugeicons/core-free-icons'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAppearance } from '../composables/appearance'
import { useFormField } from '../composables/form'
import { hasInk, strokeWidth } from '../composables/signature'
import { useIryxUiConfig } from '../config'
import { signaturePadTheme } from '../theme/signature-pad'
import Icon from './Icon.vue'

export interface SignaturePadProps {
  /**
   * The signature as a PNG data URL, or `null` when nothing has been drawn.
   * A data URL is what goes in a request body and what an `<img>` can render
   * back, so it is what the model holds.
   */
  modelValue?: string | null
  /** Height of the drawing surface. The width follows the container. */
  height?: number
  penColor?: string
  /** Nominal pen width. The drawn width varies with speed and pressure. */
  penWidth?: number
  undoLabel?: string
  clearLabel?: string
  /** Names the pad itself, since a canvas has no text of its own. */
  ariaLabel?: string
  disabled?: boolean
  invalid?: boolean
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ canvas: 'bg-white' }`. */
  ui?: {
    root?: string
    canvas?: string
    actions?: string
    action?: string
  }
}

const props = withDefaults(defineProps<SignaturePadProps>(), {
  height: 160,
  penColor: 'currentColor',
  penWidth: 2,
  undoLabel: 'Undo last stroke',
  clearLabel: 'Clear signature',
  ariaLabel: 'Signature',
  invalid: undefined,
  unstyled: undefined,
})

const emits = defineEmits<{
  'update:modelValue': [value: string | null]
  /** A stroke began. Useful for marking a form dirty. */
  'start': []
  /** A stroke finished, with the signature as it now stands. */
  'end': [value: string | null]
  'clear': []
}>()

const canvas = ref<HTMLCanvasElement>()
const strokes = ref<SignatureStroke[]>([])

/*
 * Whether a stroke is in progress, rather than a reference to it.
 *
 * Holding the array itself was a bug: `strokes` stores a *reactive proxy* of
 * it, so pushing through the raw reference mutated the data without
 * invalidating anything reading `strokes`. The pad looked drawn on but still
 * reported itself empty until the next pointerdown replaced the array.
 */
let drawing = false
let startedAt = 0

/** Always through the proxy, so every push is seen. */
const currentStroke = () => strokes.value.at(-1)

const field = useFormField()
const padId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const isEmpty = computed(() => !hasInk(strokes.value))

/**
 * `currentColor` is not a value a canvas understands, so it is resolved
 * against the element — which is what lets the default follow the theme,
 * including a switch to dark mode.
 */
function resolvedPen(): string {
  if (props.penColor !== 'currentColor')
    return props.penColor
  const el = canvas.value
  return el ? getComputedStyle(el).color : '#000000'
}

/**
 * Size the backing store to the device's pixels, not CSS pixels. Skipping
 * this is what makes a signature look soft on any modern screen.
 */
function resize(): void {
  const el = canvas.value
  if (!el)
    return

  const ratio = window.devicePixelRatio || 1
  const width = el.clientWidth
  if (!width)
    return

  el.width = Math.round(width * ratio)
  el.height = Math.round(props.height * ratio)

  const ctx = el.getContext('2d')
  if (!ctx)
    return
  ctx.scale(ratio, ratio)
  redraw()
}

function redraw(): void {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx)
    return

  const ratio = window.devicePixelRatio || 1
  ctx.clearRect(0, 0, el.width / ratio, el.height / ratio)

  ctx.strokeStyle = resolvedPen()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (const stroke of strokes.value) {
    for (let i = 1; i < stroke.length; i++) {
      const from = stroke[i - 1]!
      const to = stroke[i]!
      // Each segment is its own path: a varying width cannot be applied to a
      // single stroked path after the fact.
      ctx.beginPath()
      ctx.lineWidth = strokeWidth(props.penWidth, from, to)
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    }
  }
}

function toDataUrl(): string | null {
  if (isEmpty.value)
    return null
  return canvas.value?.toDataURL('image/png') ?? null
}

function commit(): void {
  const value = toDataUrl()
  emits('update:modelValue', value)
  emits('end', value)
}

function pointFrom(event: PointerEvent): SignaturePoint {
  const rect = canvas.value!.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    t: performance.now() - startedAt,
    pressure: event.pressure > 0 ? event.pressure : 0.5,
  }
}

function onPointerDown(event: PointerEvent): void {
  if (props.disabled)
    return

  // Capture so a stroke that leaves the pad still finishes on this element,
  // rather than being abandoned mid-mark.
  canvas.value?.setPointerCapture(event.pointerId)
  startedAt = performance.now()
  drawing = true
  strokes.value = [...strokes.value, [pointFrom(event)]]
  emits('start')
}

function onPointerMove(event: PointerEvent): void {
  if (!drawing)
    return
  currentStroke()?.push(pointFrom(event))
  redraw()
}

function onPointerUp(event: PointerEvent): void {
  if (!drawing)
    return
  canvas.value?.releasePointerCapture(event.pointerId)
  drawing = false
  redraw()
  commit()
}

function undo(): void {
  if (!strokes.value.length)
    return
  strokes.value = strokes.value.slice(0, -1)
  redraw()
  commit()
}

function clear(): void {
  strokes.value = []
  redraw()
  emits('update:modelValue', null)
  emits('clear')
}

/*
 * The default pen is `currentColor`, resolved when a segment is drawn — so a
 * theme change left the existing ink in the old colour until something forced
 * a redraw. The strokes are kept as points rather than pixels precisely so
 * they can be repainted; this is the other reason why.
 */
const { isDark } = useAppearance()
watch(isDark, redraw)

let observer: ResizeObserver | undefined

onMounted(() => {
  resize()
  // The pad's width follows its container, and a resize would otherwise clear
  // the backing store and lose the signature.
  observer = new ResizeObserver(resize)
  if (canvas.value)
    observer.observe(canvas.value)
})

onBeforeUnmount(() => observer?.disconnect())

defineExpose({ clear, undo, isEmpty, toDataUrl })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  signaturePadTheme({ invalid: isInvalid.value, disabled: props.disabled }),
)

function slotClass(name: keyof NonNullable<SignaturePadProps['ui']>, extra?: string) {
  const override = [props.ui?.[name], extra].filter(Boolean).join(' ')
  return isUnstyled.value ? override : theme.value[name]({ class: override })
}
</script>

<template>
  <div :class="slotClass('root', props.class)">
    <canvas
      :id="padId"
      ref="canvas"
      role="img"
      :aria-label="props.ariaLabel"
      :aria-describedby="field?.describedBy.value"
      :style="{ height: `${props.height}px` }"
      :class="slotClass('canvas')"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    />

    <div :class="slotClass('actions')">
      <button
        type="button"
        :aria-label="props.undoLabel"
        :title="props.undoLabel"
        :disabled="props.disabled || !strokes.length"
        :class="slotClass('action')"
        @click="undo"
      >
        <Icon :icon="ArrowTurnBackwardIcon" />
      </button>
      <button
        type="button"
        :aria-label="props.clearLabel"
        :title="props.clearLabel"
        :disabled="props.disabled || isEmpty"
        :class="slotClass('action')"
        @click="clear"
      >
        <Icon :icon="Delete02Icon" />
      </button>
    </div>
  </div>
</template>
