<script setup lang="ts">
import { Toggle } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { toggleTheme } from '../theme/toggle'

export interface ToggleProps {
  /** Pressed or not. Two-way via `v-model`. */
  modelValue?: boolean | null
  /** Starting state when you are not controlling it. */
  defaultValue?: boolean
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Square the toggle for icon-only use, dropping the horizontal padding.
   * An icon-only control has no text to name it, so pass an `aria-label`.
   *
   * For an icon *beside* a label, mark the icon with
   * `data-icon="inline-start"` or `data-icon="inline-end"` instead — the
   * padding then tightens on that side, exactly as it does on `IButton`.
   */
  square?: boolean
  /** Stretch to the full width of the container. */
  block?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
}

/**
 * A button that stays pressed — bold in a text editor, a filter that is either
 * on or off. If the thing being toggled is a *setting*, `ISwitch` says so more
 * clearly; a toggle button reads as an action you can leave engaged.
 */
/**
 * Reka's `Toggle` renders a hidden form input as a *sibling* of the button, so
 * the component has two root nodes and Vue cannot auto-inherit attributes
 * through it. Without this, the `aria-label` an icon-only toggle depends on
 * would be dropped with a warning — the same fix `ISwitch` needed.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ToggleProps>(), {
  /*
   * Vue casts an absent Boolean prop to `false`, which would hand Reka a real
   * value and put the toggle in controlled mode — `defaultValue` was then
   * ignored and an uncontrolled toggle could never start pressed. It has to
   * stay `undefined` for Reka to know nobody is driving it.
   */
  modelValue: undefined,
  unstyled: undefined,
})

const emits = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const classes = computed(() => {
  if (isUnstyled.value)
    return props.class
  return toggleTheme({
    size: props.size,
    square: props.square,
    block: props.block,
    class: props.class,
  })
})
</script>

<template>
  <Toggle
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :disabled="props.disabled"
    v-bind="$attrs"
    :class="classes"
    @update:model-value="value => emits('update:modelValue', value)"
  >
    <slot />
  </Toggle>
</template>
