<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'
import type { ClassValue } from '../class-value'
import { Label, SwitchRoot, SwitchThumb, useForwardPropsEmits, useId } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { switchTheme } from '../theme/switch'

export interface SwitchProps extends SwitchRootProps {
  /** Text shown beside the switch. Also makes the text clickable. */
  label?: string
  /** Secondary text under the label, e.g. what the setting does. */
  description?: string
  size?: 'sm' | 'md' | 'lg'
  id?: string
  /** Mark as failing validation. Taken from the enclosing `IFormField` when omitted. */
  invalid?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ thumb: 'bg-black' }`. */
  ui?: {
    wrapper?: string
    root?: string
    thumb?: string
    content?: string
    label?: string
    description?: string
  }
}

/**
 * Reka's `SwitchRoot` renders the hidden form input as a *sibling* of the
 * button (reka-ui 2.10 moved it out of the button to fix a `nested-interactive`
 * violation), so it has two root nodes and Vue cannot auto-inherit attributes
 * through it. Without this, `<ISwitch data-testid="x" name="y" />` would warn
 * about extraneous attributes and drop them.
 *
 * Binding `$attrs` explicitly also fixes an older inconsistency: with a label
 * the root was the wrapper `<div>`, so attributes landed on the layout rather
 * than the control. They now reach the switch in both layouts.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SwitchProps>(), {
  invalid: undefined,
  unstyled: undefined,
})
const emits = defineEmits<SwitchRootEmits>()

const rootProps = computed(() => {
  const {
    label: _label,
    description: _description,
    // Ours, not Reka's — forwarding it would land `size` on the DOM node.
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

const slots = computed(() => switchTheme({ size: props.size, withText: hasText.value, invalid: isInvalid.value }))

const wrapperClass = computed(() =>
  isUnstyled.value ? props.ui?.wrapper : slots.value.wrapper({ class: props.ui?.wrapper }),
)
const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : slots.value.root({ class: [props.ui?.root, props.class] }),
)
const thumbClass = computed(() =>
  isUnstyled.value ? props.ui?.thumb : slots.value.thumb({ class: props.ui?.thumb }),
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
    <SwitchRoot
      :id="controlId"
      v-bind="{ ...forwarded, ...$attrs }"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="props.description ? `${controlId}-description` : undefined"
      :class="rootClass"
    >
      <SwitchThumb :class="thumbClass" />
    </SwitchRoot>

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

  <SwitchRoot
    v-else
    :id="controlId"
    v-bind="{ ...forwarded, ...$attrs }"
    :aria-invalid="isInvalid || undefined"
    :class="rootClass"
  >
    <SwitchThumb :class="thumbClass" />
  </SwitchRoot>
</template>
