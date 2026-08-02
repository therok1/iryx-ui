<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'
import { Check, Minus } from 'lucide-vue-next'
import { CheckboxIndicator, CheckboxRoot, Label, useForwardPropsEmits, useId } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { checkboxTheme } from '../theme/checkbox'

export interface CheckboxProps extends CheckboxRootProps {
  /** Text shown beside the box. Also makes the text clickable. */
  label?: string
  /** Secondary text under the label. */
  description?: string
  size?: 'sm' | 'md' | 'lg'
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ indicator: 'text-black' }`. */
  ui?: {
    wrapper?: string
    root?: string
    indicator?: string
    content?: string
    label?: string
    description?: string
  }
}

// `unstyled: undefined` is required: Vue casts absent boolean props to
// `false`, which would shadow the global config.
const props = withDefaults(defineProps<CheckboxProps>(), {
  unstyled: undefined,
})
const emits = defineEmits<CheckboxRootEmits>()

const rootProps = computed(() => {
  const {
    label: _label,
    description: _description,
    size: _size,
    id: _id,
    unstyled: _unstyled,
    class: _class,
    ui: _ui,
    ...rest
  } = props
  return rest
})
const forwarded = useForwardPropsEmits(rootProps, emits)

const autoId = useId()
const controlId = computed(() => props.id ?? autoId)
/** Only wrap in a labelled layout when there is text to show. */
const hasText = computed(() => Boolean(props.label || props.description))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const slots = computed(() => checkboxTheme({ size: props.size, withText: hasText.value }))

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
      v-bind="forwarded"
      :aria-describedby="props.description ? `${controlId}-description` : undefined"
      :class="rootClass"
    >
      <CheckboxIndicator :class="indicatorClass">
        <slot>
          <Minus v-if="props.modelValue === 'indeterminate'" />
          <Check v-else />
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

  <CheckboxRoot v-else :id="props.id" v-bind="forwarded" :class="rootClass">
    <CheckboxIndicator :class="indicatorClass">
      <slot>
        <Minus v-if="props.modelValue === 'indeterminate'" />
        <Check v-else />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
