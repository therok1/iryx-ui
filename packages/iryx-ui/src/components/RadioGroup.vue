<script setup lang="ts">
import type { RadioGroupRootEmits, RadioGroupRootProps } from 'reka-ui'
import type { ClassValue } from '../class-value'
import { Label, RadioGroupIndicator, RadioGroupItem, RadioGroupRoot, useForwardPropsEmits, useId } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { radioGroupTheme } from '../theme/radio-group'

export interface RadioGroupItemOption {
  label: string
  value: string
  /** Secondary text under the label. */
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps extends RadioGroupRootProps {
  /** Options to render. Strings are expanded to `{ label, value }`. */
  items?: (RadioGroupItemOption | string)[]
  size?: 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  ui?: { root?: string, item?: string, label?: string, description?: string }
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  unstyled: undefined,
})
const emits = defineEmits<RadioGroupRootEmits>()

const rootProps = computed(() => {
  const { items: _items, size: _size, unstyled: _unstyled, class: _class, ui: _ui, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(rootProps, emits)

const options = computed<RadioGroupItemOption[]>(() =>
  (props.items ?? []).map(item => (typeof item === 'string' ? { label: item, value: item } : item)),
)

const groupId = useId()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/*
 * `orientation` is read here *and* left in the forwarded props: Reka needs it
 * for arrow-key direction, and the theme needs it for the layout. Destructuring
 * it out of `rootProps` would fix the look and break the keyboard.
 */
const slots = computed(() => radioGroupTheme({
  size: props.size,
  orientation: props.orientation ?? 'vertical',
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
</script>

<template>
  <RadioGroupRoot v-bind="forwarded" :class="rootClass">
    <slot>
      <div v-for="option in options" :key="option.value" :class="isUnstyled ? undefined : slots.wrapper()">
        <RadioGroupItem
          :id="`${groupId}-${option.value}`"
          :value="option.value"
          :disabled="option.disabled"
          :aria-describedby="option.description ? `${groupId}-${option.value}-description` : undefined"
          :class="itemClass"
        >
          <RadioGroupIndicator :class="isUnstyled ? undefined : slots.indicator()" />
        </RadioGroupItem>
        <div :class="isUnstyled ? undefined : slots.content()">
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
    </slot>
  </RadioGroupRoot>
</template>
