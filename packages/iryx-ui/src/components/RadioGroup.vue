<script setup lang="ts">
import type { RadioGroupRootEmits, RadioGroupRootProps } from 'reka-ui'
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { Label, RadioGroupIndicator, RadioGroupItem, RadioGroupRoot, useForwardPropsEmits, useId } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { radioGroupTheme } from '../theme/radio-group'
import Icon from './Icon.vue'

export interface RadioGroupItemOption {
  label: string
  value: string
  /** Secondary text under the label. */
  description?: string
  /** Shown above the label by the `tile` variant, ignored by the others. */
  icon?: IconLike
  disabled?: boolean
}

export interface RadioGroupProps extends RadioGroupRootProps {
  /** Options to render. Strings are expanded to `{ label, value }`. */
  items?: (RadioGroupItemOption | string)[]
  /**
   * How each option is drawn. `radio` is a circle beside its label, `card`
   * makes the whole bordered surface the control, and `tile` centres an icon
   * above the label.
   */
  variant?: 'radio' | 'card' | 'tile'
  size?: 'sm' | 'md' | 'lg'
  /** Mark as failing validation. Taken from the enclosing `IFormField` when omitted. */
  invalid?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  ui?: {
    root?: string
    item?: string
    mark?: string
    icon?: string
    content?: string
    label?: string
    description?: string
  }
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  invalid: undefined,
  unstyled: undefined,
})
const emits = defineEmits<RadioGroupRootEmits>()

const rootProps = computed(() => {
  const { items: _items, variant: _variant, size: _size, invalid: _invalid, unstyled: _unstyled, class: _class, ui: _ui, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(rootProps, emits)

const options = computed<RadioGroupItemOption[]>(() =>
  (props.items ?? []).map(item => (typeof item === 'string' ? { label: item, value: item } : item)),
)

const groupId = useId()
const field = useFormField()
if (field)
  field.id.value = undefined
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/*
 * `orientation` is read here *and* left in the forwarded props: Reka needs it
 * for arrow-key direction, and the theme needs it for the layout. Destructuring
 * it out of `rootProps` would fix the look and break the keyboard.
 */
const slots = computed(() => radioGroupTheme({
  variant: props.variant,
  size: props.size,
  orientation: props.orientation ?? 'vertical',
  invalid: isInvalid.value,
}))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : slots.value.root({ class: [props.ui?.root, props.class] }),
)
const itemClass = computed(() =>
  isUnstyled.value ? props.ui?.item : slots.value.item({ class: props.ui?.item }),
)
const labelClass = computed(() =>
  isUnstyled.value ? props.ui?.label : slots.value.label({ class: props.ui?.label }),
)
const descriptionClass = computed(() =>
  isUnstyled.value ? props.ui?.description : slots.value.description({ class: props.ui?.description }),
)
const contentClass = computed(() =>
  isUnstyled.value ? props.ui?.content : slots.value.content({ class: props.ui?.content }),
)
const markClass = computed(() =>
  isUnstyled.value ? props.ui?.mark : slots.value.mark({ class: props.ui?.mark }),
)
const iconClass = computed(() =>
  isUnstyled.value ? props.ui?.icon : slots.value.icon({ class: props.ui?.icon }),
)
</script>

<template>
  <RadioGroupRoot
    v-bind="forwarded"
    :aria-labelledby="field?.labelId.value"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="field?.describedBy.value"
    :class="rootClass"
  >
    <slot>
      <template v-for="option in options" :key="option.value">
        <div v-if="(props.variant ?? 'radio') === 'radio'" :class="isUnstyled ? undefined : slots.wrapper()">
          <RadioGroupItem
            :id="`${groupId}-${option.value}`"
            :value="option.value"
            :disabled="option.disabled"
            :aria-describedby="option.description ? `${groupId}-${option.value}-description` : undefined"
            :class="itemClass"
          >
            <RadioGroupIndicator :class="isUnstyled ? undefined : slots.indicator()" />
          </RadioGroupItem>
          <div :class="contentClass">
            <Label :for="`${groupId}-${option.value}`" :class="labelClass">
              {{ option.label }}
            </Label>
            <p
              v-if="option.description"
              :id="`${groupId}-${option.value}-description`"
              :class="descriptionClass"
            >
              {{ option.description }}
            </p>
          </div>
        </div>

        <RadioGroupItem
          v-else
          :value="option.value"
          :disabled="option.disabled"
          :aria-labelledby="`${groupId}-${option.value}-label`"
          :aria-describedby="option.description ? `${groupId}-${option.value}-description` : undefined"
          :class="itemClass"
          class="group/item"
        >
          <span v-if="props.variant === 'card'" :class="markClass">
            <RadioGroupIndicator :class="isUnstyled ? undefined : slots.indicator()" />
          </span>
          <Icon v-else-if="option.icon" :icon="option.icon" data-slot="icon" :class="iconClass" />

          <span :class="contentClass">
            <span :id="`${groupId}-${option.value}-label`" :class="labelClass">
              {{ option.label }}
            </span>
            <span
              v-if="option.description"
              :id="`${groupId}-${option.value}-description`"
              :class="descriptionClass"
            >
              {{ option.description }}
            </span>
          </span>
        </RadioGroupItem>
      </template>
    </slot>
  </RadioGroupRoot>
</template>
