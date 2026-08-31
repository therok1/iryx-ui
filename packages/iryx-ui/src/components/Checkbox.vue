<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'
import type { ClassValue } from '../class-value'
import { MinusSignIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { CheckboxIndicator, CheckboxRoot, Label, useForwardPropsEmits, useId } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { checkboxTheme } from '../theme/checkbox'
import Icon from './Icon.vue'

export interface CheckboxProps extends CheckboxRootProps {
  /** Text shown beside the box. Also makes the text clickable. */
  label?: string
  /** Secondary text under the label. */
  description?: string
  size?: 'sm' | 'md' | 'lg'
  id?: string
  /** Mark as failing validation. Taken from the enclosing `IFormField` when omitted. */
  invalid?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ indicator: 'text-black' }`. */
  ui?: {
    wrapper?: string
    root?: string
    indicator?: string
    content?: string
    label?: string
    description?: string
  }
}

/**
 * Reka's `CheckboxRoot` renders the hidden form input as a *sibling* of the
 * button (reka-ui 2.10 moved it out of the button to fix a `nested-interactive`
 * violation), so it has two root nodes and Vue cannot auto-inherit attributes
 * through it. See the matching note in `Switch.vue`.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxProps>(), {
  invalid: undefined,
  unstyled: undefined,
})
const emits = defineEmits<CheckboxRootEmits>()

const rootProps = computed(() => {
  const {
    label: _label,
    description: _description,
    size: _size,
    id: _id,
    invalid: _invalid,
    unstyled: _unstyled,
    class: _class,
    ui: _ui,
    ...rest
  } = props
  return rest
})
const forwarded = useForwardPropsEmits(rootProps, emits)

const autoId = useId()
const field = useFormField()
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)
const controlId = computed(() => props.id ?? field?.id.value ?? autoId)
if (field)
  field.id.value = controlId.value
/** Only wrap in a labelled layout when there is text to show. */
const hasText = computed(() => Boolean(props.label || props.description))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const slots = computed(() => checkboxTheme({ size: props.size, withText: hasText.value, invalid: isInvalid.value }))

const wrapperClass = computed(() =>
  isUnstyled.value ? props.ui?.wrapper : slots.value.wrapper({ class: props.ui?.wrapper }),
)
const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : slots.value.root({ class: [props.ui?.root, props.class] }),
)
const indicatorClass = computed(() =>
  isUnstyled.value ? props.ui?.indicator : slots.value.indicator({ class: props.ui?.indicator }),
)
const contentClass = computed(() =>
  isUnstyled.value ? props.ui?.content : slots.value.content({ class: props.ui?.content }),
)
const labelClass = computed(() =>
  isUnstyled.value ? props.ui?.label : slots.value.label({ class: props.ui?.label }),
)
const descriptionClass = computed(() =>
  isUnstyled.value ? props.ui?.description : slots.value.description({ class: props.ui?.description }),
)
</script>

<template>
  <div v-if="hasText" :class="wrapperClass">
    <CheckboxRoot
      :id="controlId"
      v-bind="{ ...forwarded, ...$attrs }"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="props.description ? `${controlId}-description` : undefined"
      :class="rootClass"
    >
      <CheckboxIndicator :class="indicatorClass">
        <slot>
          <Icon v-if="props.modelValue === 'indeterminate'" :icon="MinusSignIcon" />
          <Icon v-else :icon="Tick02Icon" />
        </slot>
      </CheckboxIndicator>
    </CheckboxRoot>

    <div :class="contentClass">
      <Label :for="controlId" :class="labelClass">
        <slot name="label">{{ props.label }}</slot>
      </Label>
      <p v-if="props.description || $slots.description" :id="`${controlId}-description`" :class="descriptionClass">
        <slot name="description">
          {{ props.description }}
        </slot>
      </p>
    </div>
  </div>

  <CheckboxRoot
    v-else
    :id="controlId"
    v-bind="{ ...forwarded, ...$attrs }"
    :aria-invalid="isInvalid || undefined"
    :class="rootClass"
  >
    <CheckboxIndicator :class="indicatorClass">
      <slot>
        <Icon v-if="props.modelValue === 'indeterminate'" :icon="MinusSignIcon" />
        <Icon v-else :icon="Tick02Icon" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
