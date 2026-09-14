<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { DateRangePreset, DateValue } from '../composables/date'
import { ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon } from '@hugeicons/core-free-icons'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { formatIsoDate, toCalendarDate, toIsoDate } from '../composables/date'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { calendarTheme } from '../theme/calendar'
import { datePickerTheme } from '../theme/date-picker'
import Icon from './Icon.vue'

/** Both ends are ISO `YYYY-MM-DD` strings, and either may be absent. */
export interface DateRange {
  start: string | null
  end: string | null
}

export interface DateRangePickerProps {
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  disabled?: boolean
  /** Mark the field as invalid — styles the border and ring red. */
  invalid?: boolean
  id?: string
  /** Earliest selectable date, as an ISO `YYYY-MM-DD` string. */
  min?: string
  /** Latest selectable date, as an ISO `YYYY-MM-DD` string. */
  max?: string
  /** Locale for the month names, weekday initials and the trigger's text. */
  locale?: string
  /** How each end of the range reads on the trigger. */
  format?: Intl.DateTimeFormatOptions
  /** 0 is Sunday. Defaults to the locale's own convention. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /**
   * Months shown side by side. Two makes picking a span across a boundary
   * sane. Narrow screens always get one.
   */
  months?: number
  /**
   * Shortcuts beside the calendar — "Last 7 days", "This month". Picking one
   * fills the range and closes. `commonDateRangePresets()` builds the usual set.
   */
  presets?: DateRangePreset[]
  /** Accessible name for the preset list — override for non-English apps. */
  presetsLabel?: string
  /** Offer a "clear" action in the footer. */
  clearable?: boolean
  /** Separator between the two dates on the trigger. */
  separator?: string
  /** Footer and navigation labels — override for non-English apps. */
  clearLabel?: string
  previousLabel?: string
  nextLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  /** Applied to the trigger, which is the element carrying the field chrome. */
  class?: ClassValue
  /** Override classes per element, e.g. `{ content: 'p-4' }`. */
  ui?: Partial<Record<
    'trigger' | 'placeholder' | 'content' | 'panel' | 'presets' | 'preset' | 'header' | 'heading' | 'nav'
    | 'months' | 'grid' | 'headCell' | 'cell' | 'cellTrigger' | 'footer' | 'action',
    string
  >>
}

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  placeholder: 'Pick a date range',
  separator: ' – ',
  months: 2,
  clearLabel: 'Clear',
  presetsLabel: 'Presets',
  previousLabel: 'Previous month',
  nextLabel: 'Next month',
  invalid: undefined,
  unstyled: undefined,
})

const model = defineModel<DateRange>({ default: () => ({ start: null, end: null }) })

const open = ref(false)

const field = useFormField()
const triggerId = computed(() => props.id ?? field?.id.value)
if (field && props.id)
  field.id.value = props.id
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/**
 * Reka owns this object; we mirror it to and from the ISO model.
 *
 * A `computed` with a getter that rebuilds `{ start, end }` on every read
 * cannot work here: writing the model changes `modelValue`'s identity, and
 * RangeCalendarRoot drops the half-finished selection it is holding. Every
 * click then starts a fresh range and the end date is never recorded. Syncing
 * only on a real ISO change keeps that churn out of Reka's way.
 */
// shallowRef: `ref` deep-unwraps its type parameter, which reduces the
// CalendarDate class to a structural shape Reka's DateValue no longer accepts.
// Reka replaces the whole object on every emit, so there is nothing to track
// deeply anyway.
const calendarValue = shallowRef<{ start: DateValue | undefined, end: DateValue | undefined }>({
  start: toCalendarDate(model.value?.start),
  end: toCalendarDate(model.value?.end),
})

function sameAsModel(value: { start: DateValue | undefined, end: DateValue | undefined }): boolean {
  return toIsoDate(value.start) === (model.value?.start ?? null)
    && toIsoDate(value.end) === (model.value?.end ?? null)
}

watch(model, () => {
  if (!sameAsModel(calendarValue.value)) {
    calendarValue.value = {
      start: toCalendarDate(model.value?.start),
      end: toCalendarDate(model.value?.end),
    }
  }
}, { deep: true })

watch(calendarValue, (value) => {
  if (!sameAsModel(value))
    model.value = { start: toIsoDate(value.start), end: toIsoDate(value.end) }
})

const narrow = ref(false)
let narrowQuery: MediaQueryList | undefined
function onNarrowChange(event: MediaQueryListEvent): void {
  narrow.value = event.matches
}
onMounted(() => {
  if (typeof window.matchMedia !== 'function')
    return
  narrowQuery = window.matchMedia('(max-width: 39.99rem)')
  narrow.value = narrowQuery.matches
  narrowQuery.addEventListener('change', onNarrowChange)
})
onBeforeUnmount(() => narrowQuery?.removeEventListener('change', onNarrowChange))
const visibleMonths = computed(() => (narrow.value ? 1 : props.months))

const minValue = computed(() => toCalendarDate(props.min))
const maxValue = computed(() => toCalendarDate(props.max))

const display = computed(() => {
  const start = formatIsoDate(model.value?.start, props.locale, props.format)
  const end = formatIsoDate(model.value?.end, props.locale, props.format)
  if (!start && !end)
    return ''
  // A half-picked range still deserves a readable trigger.
  return end ? `${start}${props.separator}${end}` : start
})

/**
 * Close once the range is genuinely complete.
 *
 * Both ends populated always means finished, never mid-selection: clicking a
 * new date while a complete range exists makes Reka clear the end and start
 * over, so the model passes through `{ start, null }` first. Counting clicks
 * instead would drift out of sync with Reka whenever a half-finished range is
 * left behind by closing the popover.
 */
watch(model, (value) => {
  if (open.value && value?.start && value?.end)
    open.value = false
}, { deep: true })

const resolvedPresets = computed(() => {
  void open.value
  return (props.presets ?? []).map(preset => ({
    label: preset.label,
    range: typeof preset.range === 'function' ? preset.range() : preset.range,
  }))
})

function withinBounds(range: DateRange): boolean {
  return (!props.min || !range.start || range.start >= props.min)
    && (!props.max || !range.end || range.end <= props.max)
}

function isCurrent(range: DateRange): boolean {
  return model.value?.start === range.start && model.value?.end === range.end
}

function applyPreset(range: DateRange): void {
  model.value = { start: range.start, end: range.end }
  open.value = false
}

function clear(): void {
  model.value = { start: null, end: null }
  open.value = false
}

/*
 * Two themes: the field and its panel, and the month grid shared with
 * `ICalendar` and `IDatePicker`. The range styling is a variant of the grid's,
 * since a band across several days is a property of the grid, not of the field.
 */
const theme = computed(() => ({
  ...datePickerTheme({ size: props.size, invalid: isInvalid.value }),
  ...calendarTheme({ range: true }),
}))

function slotClass(slot: keyof NonNullable<DateRangePickerProps['ui']>, extra?: ClassValue) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <!--
      as-child, because PopoverTrigger binds its own generated `id` and would
      otherwise win — leaving `<ILabel for>` and FormField pointing at nothing.
    -->
    <PopoverTrigger as-child>
      <button
        :id="triggerId"
        type="button"
        :disabled="props.disabled"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="field?.describedBy.value"
        :class="slotClass('trigger', props.class)"
      >
        <span v-if="display">{{ display }}</span>
        <span v-else :class="slotClass('placeholder')">{{ props.placeholder }}</span>
        <Icon :icon="Calendar03Icon" />
      </button>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent :class="slotClass('content')" :side-offset="4" align="start">
        <div :class="slotClass('panel')">
          <div
            v-if="resolvedPresets.length"
            role="group"
            :aria-label="props.presetsLabel"
            :class="slotClass('presets')"
          >
            <button
              v-for="preset in resolvedPresets"
              :key="preset.label"
              type="button"
              :disabled="!withinBounds(preset.range)"
              :aria-pressed="isCurrent(preset.range)"
              :class="slotClass('preset')"
              @click="applyPreset(preset.range)"
            >
              {{ preset.label }}
            </button>
          </div>

          <RangeCalendarRoot
            v-slot="{ grid, weekDays }"
            v-model="calendarValue"
            :min-value="minValue"
            :max-value="maxValue"
            :locale="props.locale"
            :week-starts-on="props.weekStartsOn"
            :number-of-months="visibleMonths"
            fixed-weeks
            initial-focus
          >
            <RangeCalendarHeader :class="slotClass('header')">
              <RangeCalendarPrev :aria-label="props.previousLabel" :class="slotClass('nav')">
                <Icon :icon="ArrowLeft01Icon" />
              </RangeCalendarPrev>
              <RangeCalendarHeading :class="slotClass('heading')" />
              <RangeCalendarNext :aria-label="props.nextLabel" :class="slotClass('nav')">
                <Icon :icon="ArrowRight01Icon" />
              </RangeCalendarNext>
            </RangeCalendarHeader>

            <div :class="slotClass('months')">
              <RangeCalendarGrid
                v-for="month in grid"
                :key="month.value.toString()"
                :class="slotClass('grid')"
              >
                <RangeCalendarGridHead>
                  <RangeCalendarGridRow>
                    <RangeCalendarHeadCell
                      v-for="day in weekDays"
                      :key="day"
                      :class="slotClass('headCell')"
                    >
                      {{ day }}
                    </RangeCalendarHeadCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridHead>
                <RangeCalendarGridBody>
                  <RangeCalendarGridRow
                    v-for="(week, index) in month.rows"
                    :key="`week-${index}`"
                  >
                    <RangeCalendarCell
                      v-for="date in week"
                      :key="date.toString()"
                      :date="date"
                      :class="slotClass('cell')"
                    >
                      <RangeCalendarCellTrigger
                        :day="date"
                        :month="month.value"
                        :class="slotClass('cellTrigger')"
                      />
                    </RangeCalendarCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridBody>
              </RangeCalendarGrid>
            </div>
          </RangeCalendarRoot>
        </div>

        <div v-if="props.clearable" :class="slotClass('footer')">
          <button type="button" :class="slotClass('action')" @click="clear">
            {{ props.clearLabel }}
          </button>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
