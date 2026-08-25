<script setup lang="ts">
import { Calendar03Icon } from '@hugeicons/core-free-icons'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { computed, ref } from 'vue'
import { formatIsoDate, isoToday } from '../composables/date'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { datePickerTheme } from '../theme/date-picker'
import Calendar from './Calendar.vue'
import Icon from './Icon.vue'

export interface DatePickerProps {
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
  /** How the selected date reads on the trigger. */
  format?: Intl.DateTimeFormatOptions
  /** 0 is Sunday. Defaults to the locale's own convention. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /**
   * Refuse a date — a taken slot, a closed day. Given an ISO `YYYY-MM-DD`
   * string. Unavailable days are struck through rather than hidden.
   */
  isUnavailable?: (date: string) => boolean
  /** Offer a "clear" action in the footer. */
  clearable?: boolean
  /** Footer and navigation labels — override for non-English apps. */
  todayLabel?: string
  clearLabel?: string
  previousLabel?: string
  nextLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  /** Applied to the trigger, which is the element carrying the field chrome. */
  class?: string
  /** Override classes per slot, e.g. `{ content: 'p-4' }`. */
  ui?: Partial<Record<
    'trigger' | 'placeholder' | 'content' | 'header' | 'heading' | 'nav'
    | 'months' | 'grid' | 'headCell' | 'cell' | 'cellTrigger' | 'footer' | 'action',
    string
  >>
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  placeholder: 'Pick a date',
  todayLabel: 'Today',
  clearLabel: 'Clear',
  previousLabel: 'Previous month',
  nextLabel: 'Next month',
  invalid: undefined,
  unstyled: undefined,
})

/** ISO `YYYY-MM-DD`, never a `Date`. See `composables/date.ts` for why. */
const model = defineModel<string | null>({ default: null })

const open = ref(false)

const field = useFormField()
const triggerId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const display = computed(() => formatIsoDate(model.value, props.locale, props.format))

function pickToday(): void {
  model.value = isoToday()
  open.value = false
}

function clear(): void {
  model.value = null
  open.value = false
}

const theme = computed(() => datePickerTheme({ size: props.size, invalid: isInvalid.value }))

/** The field and panel slots this component still owns. */
type FieldSlot = 'trigger' | 'placeholder' | 'content' | 'footer' | 'action'

function slotClass(slot: FieldSlot, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}

/** The rest belong to the grid, and are forwarded to it untouched. */
const calendarUi = computed(() => {
  const { trigger, placeholder, content, footer, action, ...rest } = props.ui ?? {}
  return rest
})
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
        <Calendar
          v-model="model"
          :min="props.min"
          :max="props.max"
          :locale="props.locale"
          :week-starts-on="props.weekStartsOn"
          :is-unavailable="props.isUnavailable"
          :previous-label="props.previousLabel"
          :next-label="props.nextLabel"
          initial-focus
          :unstyled="props.unstyled"
          :ui="calendarUi"
          @update:model-value="open = false"
        />

        <div :class="slotClass('footer')">
          <button type="button" :class="slotClass('action')" @click="pickToday">
            {{ props.todayLabel }}
          </button>
          <button
            v-if="props.clearable"
            type="button"
            :class="slotClass('action')"
            @click="clear"
          >
            {{ props.clearLabel }}
          </button>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
