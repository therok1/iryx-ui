<script setup lang="ts" generic="Item">
import type { ClassValue } from '../class-value'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useScrollEdges } from '../composables/scroll-fade'
import { useIryxUiConfig } from '../config'
import { carouselTheme } from '../theme/carousel'
import Button from './Button.vue'
import Icon from './Icon.vue'

export interface CarouselProps<Item = unknown> {
  /** What to lay out. Each one is rendered through the default slot. */
  items?: Item[]
  /**
   * How many fit across, at the widest. Below `sm` it is always one, and
   * `'auto'` leaves the width to the slide's own content.
   */
  perView?: 1 | 2 | 3 | 4 | 'auto'
  gap?: 'none' | 'sm' | 'md' | 'lg'
  /** Show the previous and next buttons. */
  arrows?: boolean
  /**
   * Let a mouse drag the track. Touch and trackpad pan it natively either way.
   */
  draggable?: boolean
  /**
   * How far a drag has to travel before it moves on, as a fraction of a slide.
   * A quarter by default: enough that a nudge does not count, little enough
   * that the track goes where it was pushed. `1` demands a whole slide.
   */
  dragThreshold?: number
  /** Show the row of dots under the track. */
  dots?: boolean
  /**
   * Accessible name for the carousel — "Customer stories", "Screenshots".
   * A carousel with no name is a scroll region a screen reader cannot place.
   */
  label?: string
  /** Accessible names for the buttons — override for non-English sites. */
  previousLabel?: string
  nextLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ dot: 'size-3' }`. */
  ui?: {
    root?: string
    track?: string
    item?: string
    viewport?: string
    control?: string
    dots?: string
    dot?: string
  }
}

const props = withDefaults(defineProps<CarouselProps<Item>>(), {
  perView: 1,
  arrows: undefined,
  draggable: undefined,
  dragThreshold: 0.25,
  dots: undefined,
  label: 'Carousel',
  previousLabel: 'Previous',
  nextLabel: 'Next',
  unstyled: undefined,
})

const active = defineModel<number>('active', { default: 0 })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => carouselTheme({ gap: props.gap }))

function slotClass(slot: keyof NonNullable<CarouselProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}

const track = ref<HTMLElement>()

const axis = ref<'horizontal'>('horizontal')
const { atStart, atEnd, overflowing } = useScrollEdges(track, axis)

const gapRem = computed(() => ({ none: 0, sm: 0.5, md: 1, lg: 1.5 }[props.gap ?? 'md']))

function widthFor(perView: number): string {
  const share = (gapRem.value * (perView - 1)) / perView
  return `calc(${100 / perView}% - ${share}rem)`
}

const itemStyle = computed(() => {
  if (props.perView === 'auto')
    return undefined

  return {
    '--iryx-carousel-item': widthFor(props.perView),
    '--iryx-carousel-item-sm': widthFor(Math.min(props.perView, 2)),
  }
})

const count = computed(() => props.items?.length ?? 0)

/*
 * How many places the track can actually stop at.
 *
 * Not the number of slides: with several across, the last few can never reach
 * the start of the track, so a dot per slide leaves the trailing ones dead.
 * Measured rather than worked out from `perView`, because the width in force
 * is the breakpoint's rather than the prop's, and 'auto' has no count at all.
 */
const measured = ref<number>()

/** Every slide is a stop until something has been measured. */
const stops = computed(() => measured.value ?? Math.max(count.value, 1))
let stopObserver: ResizeObserver | undefined

function measureStops(): void {
  const element = track.value
  if (!element)
    return

  // Nothing is laid out yet — before the first paint, or under SSR. Every
  // slide is a stop until there is a width to say otherwise.
  if (!element.clientWidth) {
    measured.value = undefined
    return
  }

  const max = element.scrollWidth - element.clientWidth + 1
  const slides = [...element.children] as HTMLElement[]
  const reachable = slides.filter(slide => slide.offsetLeft - element.offsetLeft <= max).length

  measured.value = Math.max(reachable, 1)
}

watch(track, (element) => {
  stopObserver?.disconnect()
  stopObserver = undefined
  if (!element)
    return

  measureStops()
  if (typeof ResizeObserver === 'undefined')
    return

  stopObserver = new ResizeObserver(measureStops)
  stopObserver.observe(element)
  for (const child of element.children)
    stopObserver.observe(child)
}, { immediate: true })

watch(count, () => nextTick(measureStops))

onBeforeUnmount(() => stopObserver?.disconnect())

/**
 * Where a programmatic scroll is heading, while it is still in flight.
 *
 * Smooth scrolling fires `scroll` the whole way, and every slide it passes is
 * briefly the nearest one — so jumping four dots along would light each dot in
 * turn on the way there. Holding the destination until the track settles keeps
 * the pill on the dot that was actually asked for.
 */
const pending = ref<number>()
let settle: ReturnType<typeof setTimeout> | undefined

function go(index: number): void {
  const element = track.value
  const slide = element?.children[index] as HTMLElement | undefined
  if (!element || !slide)
    return

  pending.value = index
  active.value = index
  element.scrollTo({ left: slide.offsetLeft - element.offsetLeft })

  clearTimeout(settle)
  settle = setTimeout(() => (pending.value = undefined), 1000)
}

function step(direction: 1 | -1): void {
  go(Math.min(Math.max(active.value + direction, 0), stops.value - 1))
}

function nearest(): number {
  const element = track.value
  if (!element)
    return active.value

  const slides = [...element.children] as HTMLElement[]
  const left = element.scrollLeft + element.offsetLeft

  return slides.reduce(
    (best, slide, index) =>
      Math.abs(slide.offsetLeft - left) < Math.abs(slides[best]!.offsetLeft - left) ? index : best,
    0,
  )
}

watch(active, (index) => {
  if (pending.value === undefined && index !== nearest())
    go(index)
})

function onScroll(): void {
  const element = track.value
  if (!element)
    return

  measureStops()

  const settled = Math.min(nearest(), stops.value - 1)

  if (pending.value !== undefined) {
    if (settled === pending.value) {
      pending.value = undefined
      clearTimeout(settle)
    }
    return
  }

  active.value = settled
}

const dragging = ref(false)
let origin = 0
let originScroll = 0
let originIndex = 0
let travelled = 0

function onPointerDown(event: PointerEvent): void {
  const element = track.value
  if (!(props.draggable ?? true) || event.pointerType === 'touch' || !element)
    return

  dragging.value = true
  travelled = 0
  origin = event.clientX
  originScroll = element.scrollLeft
  originIndex = active.value
  element.setPointerCapture(event.pointerId)

  element.style.scrollBehavior = 'auto'
}

function landing(element: HTMLElement): number {
  const slides = [...element.children] as HTMLElement[]
  const pitch = (slides[1]?.offsetLeft ?? 0) - (slides[0]?.offsetLeft ?? 0)
  if (pitch <= 0)
    return active.value

  const moved = (element.scrollLeft - originScroll) / pitch
  const whole = Math.trunc(moved)
  const remainder = Math.abs(moved - whole)
  const threshold = Math.min(Math.max(props.dragThreshold, 0), 1)
  const extra = remainder >= threshold ? Math.sign(moved) : 0

  return Math.min(Math.max(originIndex + whole + extra, 0), stops.value - 1)
}

function onPointerMove(event: PointerEvent): void {
  const element = track.value
  if (!dragging.value || !element)
    return

  const moved = event.clientX - origin
  travelled = Math.max(travelled, Math.abs(moved))
  element.scrollLeft = originScroll - moved
}

function onPointerUp(event: PointerEvent): void {
  const element = track.value
  if (!dragging.value || !element)
    return

  dragging.value = false
  element.releasePointerCapture(event.pointerId)
  element.style.scrollBehavior = ''

  const target = landing(element)
  nextTick(() => go(target))
}

function onClickCapture(event: MouseEvent): void {
  if (travelled > 4) {
    event.preventDefault()
    event.stopPropagation()
    travelled = 0
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    step(1)
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    step(-1)
  }
}

const showArrows = computed(() => (props.arrows ?? true) && overflowing.value)
const showDots = computed(() => (props.dots ?? true) && stops.value > 1)
</script>

<template>
  <div
    role="group"
    aria-roledescription="carousel"
    :aria-label="props.label"
    :class="slotClass('root', props.class)"
  >
    <div :class="slotClass('viewport')">
      <div
        ref="track"
        tabindex="0"
        role="group"
        :aria-label="props.label"
        :class="slotClass('track', dragging ? 'snap-none scroll-auto cursor-grabbing select-none' : (props.draggable ?? true) ? 'cursor-grab' : undefined)"
        @scroll="onScroll"
        @keydown="onKeydown"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @click.capture="onClickCapture"
        @dragstart.prevent
      >
        <div
          v-for="(item, index) in props.items"
          :key="index"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${index + 1} of ${count}`"
          :data-state="index === active ? 'active' : 'inactive'"
          :style="itemStyle"
          :class="slotClass('item', props.perView === 'auto' ? 'w-auto' : 'w-full sm:w-[var(--iryx-carousel-item-sm)] lg:w-[var(--iryx-carousel-item)]')"
        >
          <slot :item="item" :index="index" :active="index === active" />
        </div>
      </div>

      <template v-if="showArrows">
        <div :class="slotClass('control', 'left-2')">
          <Button
            variant="outline"
            size="sm"
            square
            :aria-label="props.previousLabel"
            :disabled="atStart"
            @click="step(-1)"
          >
            <Icon :icon="ArrowLeft01Icon" data-icon />
          </Button>
        </div>

        <div :class="slotClass('control', 'right-2')">
          <Button
            variant="outline"
            size="sm"
            square
            :aria-label="props.nextLabel"
            :disabled="atEnd"
            @click="step(1)"
          >
            <Icon :icon="ArrowRight01Icon" data-icon />
          </Button>
        </div>
      </template>
    </div>

    <div v-if="showDots" :class="slotClass('dots')">
      <button
        v-for="(_, index) in stops"
        :key="index"
        type="button"
        :aria-label="`Go to slide ${index + 1}`"
        :aria-current="index === active"
        :data-state="index === active ? 'active' : 'inactive'"
        :class="slotClass('dot')"
        @click="go(index)"
      />
    </div>
  </div>
</template>
