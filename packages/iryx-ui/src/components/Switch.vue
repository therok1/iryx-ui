<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'
import { Label, SwitchRoot, SwitchThumb, useForwardPropsEmits, useId } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { switchTheme } from '../theme/switch'

export interface SwitchProps extends SwitchRootProps {
  /** Text shown beside the switch. Also makes the text clickable. */
  label?: string
  /** Secondary text under the label, e.g. what the setting does. */
  description?: string
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
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

const props = withDefaults(defineProps<SwitchProps>(), {
  unstyled: undefined,
})
const emits = defineEmits<SwitchRootEmits>()

const rootProps = computed(() => {
  const {
    label: _label,
    description: _description,
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

const slots = switchTheme()

const wrapperClass = computed(() =>
  isUnstyled.value ? props.ui?.wrapper : slots.wrapper({ class: props.ui?.wrapper }),
)
const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : slots.root({ class: [props.ui?.root, props.class] }),
)
const thumbClass = computed(() =>
  isUnstyled.value ? props.ui?.thumb : slots.thumb({ class: props.ui?.thumb }),
)
const contentClass = computed(() =>
  isUnstyled.value ? props.ui?.content : slots.content({ class: props.ui?.content }),
)
const labelClass = computed(() =>
  isUnstyled.value ? props.ui?.label : slots.label({ class: props.ui?.label }),
)
const descriptionClass = computed(() =>
  isUnstyled.value ? props.ui?.description : slots.description({ class: props.ui?.description }),
)
</script>

<template>
  <div v-if="hasText" :class="wrapperClass">
    <SwitchRoot
      :id="controlId"
      v-bind="forwarded"
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

  <SwitchRoot v-else :id="props.id" v-bind="forwarded" :class="rootClass">
    <SwitchThumb :class="thumbClass" />
  </SwitchRoot>
</template>
