<script setup lang="ts">
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons'
import { computed, ref } from 'vue'
import { useIryxUiConfig } from '../config'
import { passwordInputTheme } from '../theme/password-input'
import Icon from './Icon.vue'
import Input from './Input.vue'

export interface PasswordInputProps {
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  /** Mark the field as invalid — styles the border and ring red. */
  invalid?: boolean
  id?: string
  /** Show the reveal toggle in the trailing area. */
  toggle?: boolean
  /** Render a four-segment strength meter under the field. */
  strength?: boolean
  /** Accessible names for the reveal toggle — override for non-English apps. */
  showLabel?: string
  hideLabel?: string
  /**
   * Words for scores 1–4, weakest first. Score 0 shows nothing, so this takes
   * exactly four entries. Override for non-English apps.
   */
  strengthLabels?: [string, string, string, string]
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  /** Applied to the outer wrapper, which stacks the field above the meter. */
  class?: string
  /** Override classes per slot, e.g. `{ meter: 'mt-1' }`. */
  ui?: {
    root?: string
    input?: string
    toggle?: string
    meter?: string
    track?: string
    segment?: string
    label?: string
  }
}

// Stray attributes belong on the control, which is Input's business, not on
// the wrapper that stacks the field above the meter.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PasswordInputProps>(), {
  toggle: true,
  showLabel: 'Show password',
  hideLabel: 'Hide password',
  strengthLabels: () => ['Weak', 'Fair', 'Good', 'Strong'],
  invalid: undefined,
  unstyled: undefined,
})

const model = defineModel<string>({ default: '' })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const revealed = ref(false)

/**
 * A deliberately transparent heuristic, not a security control — it nudges
 * users toward longer and more varied passwords. Real policy belongs in the
 * app's validator, where it can be enforced rather than merely suggested.
 */
const score = computed<0 | 1 | 2 | 3 | 4>(() => {
  const value = model.value
  if (!value)
    return 0

  let points = 0
  if (value.length >= 8)
    points++
  if (value.length >= 12)
    points++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value))
    points++
  if (/\d/.test(value))
    points++
  if (/[^\w\s]/.test(value))
    points++

  // Any non-empty value scores at least 1, so the meter never contradicts the
  // "Weak" label beside it by showing no filled segment at all.
  return Math.max(1, Math.min(points, 4)) as 1 | 2 | 3 | 4
})

const showMeter = computed(() => props.strength && model.value.length > 0)

const theme = computed(() => passwordInputTheme({ score: score.value }))

/** Passed through to Input, which owns the control's own classes. */
const inputClass = computed(() =>
  isUnstyled.value ? props.ui?.input : theme.value.input({ class: props.ui?.input }),
)

function slotClass(slot: 'root' | 'toggle' | 'meter' | 'track' | 'segment' | 'label', extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <div :class="slotClass('root', props.class)">
    <Input
      :id="props.id"
      v-model="model"
      :type="revealed ? 'text' : 'password'"
      :size="props.size"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      :invalid="props.invalid"
      :unstyled="props.unstyled"
      :ui="{ input: inputClass }"
      autocomplete="current-password"
      v-bind="$attrs"
    >
      <template v-if="props.toggle" #trailing>
        <button
          type="button"
          tabindex="-1"
          :aria-label="revealed ? props.hideLabel : props.showLabel"
          :aria-pressed="revealed"
          :disabled="props.disabled"
          :class="slotClass('toggle')"
          @click="revealed = !revealed"
        >
          <Icon :icon="revealed ? ViewOffIcon : ViewIcon" />
        </button>
      </template>
    </Input>

    <div v-if="showMeter" :class="slotClass('meter')">
      <!--
        aria-hidden: the segments are a visual restatement of the label beside
        them, so a screen reader would otherwise read the strength twice.
      -->
      <div :class="slotClass('track')" aria-hidden="true">
        <span
          v-for="segment in 4"
          :key="segment"
          :data-filled="segment <= score ? '' : undefined"
          :class="slotClass('segment')"
        />
      </div>
      <span :class="slotClass('label')" role="status">
        {{ props.strengthLabels[score - 1] }}
      </span>
    </div>
  </div>
</template>
