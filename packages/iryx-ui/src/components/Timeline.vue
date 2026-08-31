<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { timelineTheme } from '../theme/timeline'
import Icon from './Icon.vue'

export type TimelineVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface TimelineItem {
  /** What happened. Say it in the title — colour alone carries nothing. */
  title: string
  description?: string
  /**
   * When it happened. Rendered as given, so format it where you know the
   * reader's locale rather than guessing here.
   */
  time?: string
  /** Machine-readable timestamp for the `<time>` element, e.g. an ISO string. */
  datetime?: string
  icon?: IconLike
  variant?: TimelineVariant
}

export interface TimelineProps {
  items?: TimelineItem[]
  size?: 'sm' | 'md'
  /** Applied to any item that does not set its own. */
  variant?: TimelineVariant
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ title: 'text-base' }`. */
  ui?: {
    root?: string
    item?: string
    rail?: string
    marker?: string
    line?: string
    content?: string
    header?: string
    title?: string
    time?: string
    description?: string
  }
}

/**
 * A vertical run of events in order — an audit trail, a delivery's progress,
 * a document's history.
 *
 * Distinct from `IStepper`: a stepper is a process you are moving *through*,
 * with a current position and steps still to come. A timeline is a record of
 * what already happened, and nothing in it is pending.
 */
const props = withDefaults(defineProps<TimelineProps>(), {
  unstyled: undefined,
})

const entries = computed(() => props.items ?? [])

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

function themeFor(item: TimelineItem, index: number) {
  return timelineTheme({
    size: props.size,
    variant: item.variant ?? props.variant,
    withIcon: Boolean(item.icon),
    last: index === entries.value.length - 1,
  })
}

/** The shared slots do not vary per item, so one instance covers them. */
const shared = computed(() => timelineTheme({ size: props.size }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : shared.value.root({ class: [props.ui?.root, props.class] }),
)

function slotClass(item: TimelineItem, index: number, name: keyof NonNullable<TimelineProps['ui']>) {
  const override = props.ui?.[name]
  return isUnstyled.value ? override : themeFor(item, index)[name]({ class: override })
}
</script>

<template>
  <ol :class="rootClass">
    <li
      v-for="(item, index) in entries"
      :key="index"
      :class="isUnstyled ? props.ui?.item : shared.item({ class: props.ui?.item })"
    >
      <div :class="isUnstyled ? props.ui?.rail : shared.rail({ class: props.ui?.rail })">
        <span :class="slotClass(item, index, 'marker')">
          <slot name="marker" :item="item" :index="index">
            <Icon v-if="item.icon" :icon="item.icon" />
          </slot>
        </span>

        <!--
          Drawn per item rather than as one line behind the column, so the
          last item can simply omit it — a single background line would run
          past the final marker and trail off into nothing.
        -->
        <span
          v-if="index !== entries.length - 1"
          :class="isUnstyled ? props.ui?.line : shared.line({ class: props.ui?.line })"
        />
      </div>

      <div :class="slotClass(item, index, 'content')">
        <slot name="item" :item="item" :index="index">
          <div :class="slotClass(item, index, 'header')">
            <span :class="slotClass(item, index, 'title')">{{ item.title }}</span>
            <time
              v-if="item.time"
              :datetime="item.datetime"
              :class="slotClass(item, index, 'time')"
            >{{ item.time }}</time>
          </div>
          <p v-if="item.description" :class="slotClass(item, index, 'description')">
            {{ item.description }}
          </p>
        </slot>
      </div>
    </li>
  </ol>
</template>
