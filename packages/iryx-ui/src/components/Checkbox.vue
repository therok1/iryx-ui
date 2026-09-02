<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { MinusSignIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { CheckboxIndicator, CheckboxRoot, Label, useForwardPropsEmits, useId } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { checkboxTheme } from '../theme/checkbox'
import Icon from './Icon.vue'

export interface CheckboxProps extends CheckboxRootProps {
  /** Text shown beside the box. Also makes the text clickable. */
  label?: string
  /** Secondary text under the label. */
  description?: string
  /**
   * How the control is drawn. `checkbox` is a box beside its label, `card`
   * makes the whole bordered surface the control, and `tile` centres an icon
   * above the label.
   */
  variant?: 'checkbox' | 'card' | 'tile'
  /** Shown above the label by the `tile` variant, ignored by the others. */
  icon?: IconLike
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
    mark?: string
    icon?: string
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
    variant: _variant,
    icon: _icon,
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

const slots = useSlots()

const autoId = useId()
const field = useFormField()
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)
const controlId = computed(() => props.id ?? field?.id.value ?? autoId)
if (field)
  field.id.value = controlId.value

const hasDescription = computed(() => Boolean(props.description || slots.description))
const hasText = computed(() => Boolean(props.label || slots.label || hasDescription.value))
const describedBy = computed(() => (hasDescription.value ? `${controlId.value}-description` : undefined))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const isBoxed = computed(() => (props.variant ?? 'checkbox') !== 'checkbox')

const theme = computed(() => checkboxTheme({
  variant: props.variant,
  size: props.size,
  withText: hasText.value,
  invalid: isInvalid.value,
}))

const wrapperClass = computed(() =>
  isUnstyled.value ? props.ui?.wrapper : theme.value.wrapper({ class: props.ui?.wrapper }),
)
const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const indicatorClass = computed(() =>
  isUnstyled.value ? props.ui?.indicator : theme.value.indicator({ class: props.ui?.indicator }),
)
const contentClass = computed(() =>
  isUnstyled.value ? props.ui?.content : theme.value.content({ class: props.ui?.content }),
)
const labelClass = computed(() =>
  isUnstyled.value ? props.ui?.label : theme.value.label({ class: props.ui?.label }),
)
const descriptionClass = computed(() =>
  isUnstyled.value ? props.ui?.description : theme.value.description({ class: props.ui?.description }),
)
const markClass = computed(() =>
  isUnstyled.value ? props.ui?.mark : theme.value.mark({ class: props.ui?.mark }),
)
const iconClass = computed(() =>
  isUnstyled.value ? props.ui?.icon : theme.value.icon({ class: props.ui?.icon }),
)
</script>

<template>
  <CheckboxRoot
    v-if="isBoxed"
    :id="controlId"
    v-bind="{ ...forwarded, ...$attrs }"
    :aria-invalid="isInvalid || undefined"
    :aria-labelledby="`${controlId}-label`"
    :aria-describedby="describedBy"
    :class="rootClass"
    class="group/item"
  >
    <span v-if="props.variant === 'card'" :class="markClass">
      <CheckboxIndicator :class="indicatorClass">
        <slot>
          <Icon v-if="props.modelValue === 'indeterminate'" :icon="MinusSignIcon" />
          <Icon v-else :icon="Tick02Icon" />
        </slot>
      </CheckboxIndicator>
    </span>
    <Icon v-else-if="props.icon" :icon="props.icon" data-slot="icon" :class="iconClass" />

    <span :class="contentClass">
      <span :id="`${controlId}-label`" :class="labelClass">
        <slot name="label">{{ props.label }}</slot>
      </span>
      <span v-if="hasDescription" :id="`${controlId}-description`" :class="descriptionClass">
        <slot name="description">
          {{ props.description }}
        </slot>
      </span>
    </span>
  </CheckboxRoot>

  <div v-else-if="hasText" :class="wrapperClass">
    <CheckboxRoot
      :id="controlId"
      v-bind="{ ...forwarded, ...$attrs }"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
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
      <p v-if="hasDescription" :id="`${controlId}-description`" :class="descriptionClass">
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
