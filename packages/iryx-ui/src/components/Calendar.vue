<script setup lang="ts">
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'
import { computed } from 'vue'
import { isoToday, toCalendarDate, toIsoDate } from '../composables/date'
import { useIryxUiConfig } from '../config'
import { calendarTheme } from '../theme/calendar'
import Icon from './Icon.vue'

export interface CalendarProps {
  /** Earliest selectable date, as an ISO `YYYY-MM-DD` string. */
  min?: string
  /** Latest selectable date, as an ISO `YYYY-MM-DD` string. */
  max?: string
  /** Locale for the month names and weekday initials. */
  locale?: string
  /** 0 is Sunday. Defaults to the locale's own convention. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** How the weekday headings read — `narrow` is `M`, `short` is `Mon`. */
  weekdayFormat?: 'narrow' | 'short' | 'long'
  /** Months shown side by side. */
  months?: number
  /** Page a month at a time rather than a full view. Only matters past one month. */
  pagedNavigation?: boolean
  /**
   * Keep every month six rows tall. On by default: without it the calendar
   * changes height as you page through, which moves everything below it.
   */
  fixedWeeks?: boolean
  /** Grey out the days that belong to the neighbouring months. */
  disableDaysOutsideCurrentView?: boolean
  disabled?: boolean
  /** Selectable but not changeable. */
  readonly?: boolean
  /** Move focus to the selected day, or today, on mount. */
  initialFocus?: boolean
  /**
   * Refuse a date — a taken slot, a closed day. Given an ISO `YYYY-MM-DD`
   * string. Unavailable days are struck through rather than hidden, so the
   * reader can see the day exists and is spoken for.
   */
  isUnavailable?: (date: string) => boolean
  /** Keep a date selected when it is clicked a second time. */
  preventDeselect?: boolean
  /** Names the whole calendar for a screen reader. */
  label?: string
  /** Navigation labels — override for non-English apps. */
  previousLabel?: string
  nextLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ cellTrigger: 'rounded-full' }`. */
  ui?: Partial<Record<
    'root' | 'header' | 'heading' | 'nav' | 'months' | 'grid'
    | 'headCell' | 'cell' | 'cellTrigger',
    string
  >>
}

/**
 * A month grid that is always on screen, for the cases a popover is wrong for:
 * a booking page, an availability view, a date beside the thing it applies to.
 * [`IDatePicker`](/components/date-picker) is this same grid behind a field.
 */
const props = withDefaults(defineProps<CalendarProps>(), {
  fixedWeeks: true,
  previousLabel: 'Previous month',
  nextLabel: 'Next month',
  unstyled: undefined,
})

/** ISO `YYYY-MM-DD`, never a `Date`. See `composables/date.ts` for why. */
const model = defineModel<string | null>({ default: null })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const calendarValue = computed({
  get: () => toCalendarDate(model.value),
  set: (value) => {
    model.value = toIsoDate(value)
  },
})

const minValue = computed(() => toCalendarDate(props.min))
const maxValue = computed(() => toCalendarDate(props.max))

/**
 * Which month opens when nothing is selected. Today, pulled inside the
 * bounds — a calendar for next month's appointments would otherwise open on
 * this month with every day disabled, and the reader has to work out that the
 * fix is to page forward.
 */
const defaultPlaceholder = computed(() => {
  const today = isoToday()
  if (props.min && today < props.min)
    return toCalendarDate(props.min)
  if (props.max && today > props.max)
    return toCalendarDate(props.max)
  return undefined
})

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

const theme = computed(() => calendarTheme())

function slotClass(slot: keyof NonNullable<CalendarProps['ui']>, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <CalendarRoot
    v-slot="{ grid, weekDays }"
    v-model="calendarValue"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="props.locale"
    :week-starts-on="props.weekStartsOn"
    :weekday-format="props.weekdayFormat"
    :number-of-months="props.months"
    :paged-navigation="props.pagedNavigation"
    :fixed-weeks="props.fixedWeeks"
    :disable-days-outside-current-view="props.disableDaysOutsideCurrentView"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :initial-focus="props.initialFocus"
    :default-placeholder="defaultPlaceholder"
    :is-date-unavailable="isDateUnavailable"
    :prevent-deselect="props.preventDeselect"
    :calendar-label="props.label"
    :class="slotClass('root', props.class)"
  >
    <CalendarHeader :class="slotClass('header')">
      <CalendarPrev :aria-label="props.previousLabel" :class="slotClass('nav')">
        <Icon :icon="ArrowLeft01Icon" />
      </CalendarPrev>
      <CalendarHeading :class="slotClass('heading')" />
      <CalendarNext :aria-label="props.nextLabel" :class="slotClass('nav')">
        <Icon :icon="ArrowRight01Icon" />
      </CalendarNext>
    </CalendarHeader>

    <div :class="slotClass('months')">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        :class="slotClass('grid')"
      >
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              :class="slotClass('headCell')"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(week, index) in month.rows"
            :key="`week-${index}`"
          >
            <CalendarCell
              v-for="date in week"
              :key="date.toString()"
              :date="date"
              :class="slotClass('cell')"
            >
              <CalendarCellTrigger
                :day="date"
                :month="month.value"
                :class="slotClass('cellTrigger')"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
