<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import type { ToggleGroupVariant } from '../theme/toggle'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { toggleGroupTheme, toggleTheme } from '../theme/toggle'
import Icon from './Icon.vue'

export interface ToggleGroupItemOption {
  label: string
  /** Identifies the item. Defaults to the label. */
  value?: string
  icon?: IconLike
  disabled?: boolean
  /**
   * Names the item when `iconOnly` hides its label. Without one, an icon-only
   * item reaches a screen reader as an unnamed button.
   */
  ariaLabel?: string
}

export interface ToggleGroupProps {
  items?: (ToggleGroupItemOption | string)[]
  /**
   * `single` behaves like a segmented control — one item on at a time, and
   * the model is that item's value. `multiple` lets any number be on, and the
   * model is an array.
   */
  type?: 'single' | 'multiple'
  modelValue?: string | string[]
  variant?: ToggleGroupVariant
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  orientation?: 'horizontal' | 'vertical'
  /** Hide the labels and square the items, leaving only the icons. */
  iconOnly?: boolean
  /** Stretch to fill the container, splitting the width between items. */
  block?: boolean
  disabled?: boolean
  /** Wrap from the last item back to the first when arrowing past the end. */
  loop?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ item: 'px-6' }`. */
  ui?: {
    root?: string
    item?: string
  }
}

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  type: 'single',
  unstyled: undefined,
})

const emits = defineEmits<{ 'update:modelValue': [value: string | string[]] }>()

const options = computed<ToggleGroupItemOption[]>(() =>
  (props.items ?? []).map(item => (typeof item === 'string' ? { label: item } : item)),
)

/**
 * The value defaults to the label, so simple string items just work.
 *
 * Named `itemValue`, not `valueOf`: a template resolves an identifier against
 * the render context, whose prototype chain includes `Object.prototype`, so
 * `valueOf` would resolve to the built-in under SSR and throw. `ITabs`
 * carries the same note for the same reason.
 */
const itemValue = (item: ToggleGroupItemOption) => item.value ?? item.label

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  toggleGroupTheme({
    variant: props.variant,
    orientation: props.orientation,
    block: props.block,
  }),
)

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)

/**
 * An item is a {@link toggleTheme} button plus the group's own joining and
 * stretching classes, so a group and a lone toggle beside it are the same
 * control rendered twice rather than two things that merely resemble each
 * other.
 */
const itemClass = computed(() => {
  if (isUnstyled.value)
    return props.ui?.item
  return toggleTheme({
    size: props.size,
    square: props.iconOnly,
    class: theme.value.item({ class: props.ui?.item }),
  })
})
</script>

<template>
  <ToggleGroupRoot
    :type="props.type"
    :model-value="props.modelValue"
    :disabled="props.disabled"
    :orientation="props.orientation"
    :loop="props.loop"
    :class="rootClass"
    @update:model-value="value => emits('update:modelValue', value as string | string[])"
  >
    <ToggleGroupItem
      v-for="item in options"
      :key="itemValue(item)"
      :value="itemValue(item)"
      :disabled="item.disabled"
      :aria-label="item.ariaLabel ?? (props.iconOnly ? item.label : undefined)"
      :class="itemClass"
    >
      <slot name="item" :item="item">
        <!--
          Marked as leading only when a label follows it, so the padding
          tightens on the icon's side. An icon-only item is square with no
          horizontal padding to tighten.
        -->
        <Icon
          v-if="item.icon"
          :icon="item.icon"
          :data-icon="props.iconOnly ? undefined : 'inline-start'"
        />
        <span v-if="!props.iconOnly">{{ item.label }}</span>
      </slot>
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
