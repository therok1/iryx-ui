<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'reka-ui'
import { Check, ChevronDown } from 'lucide-vue-next'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { selectTheme } from '../theme/select'

export interface SelectItemOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps extends SelectRootProps {
  /** Options to render. Strings are expanded to `{ label, value }`. */
  items?: (SelectItemOption | string)[]
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: { trigger?: string, content?: string, viewport?: string, item?: string }
}

const props = withDefaults(defineProps<SelectProps>(), {
  unstyled: undefined,
})
const emits = defineEmits<SelectRootEmits>()

const rootProps = computed(() => {
  const {
    items: _items,
    placeholder: _placeholder,
    size: _size,
    unstyled: _unstyled,
    class: _class,
    ui: _ui,
    ...rest
  } = props
  return rest
})
const forwarded = useForwardPropsEmits(rootProps, emits)

const options = computed<SelectItemOption[]>(() =>
  (props.items ?? []).map(item => (typeof item === 'string' ? { label: item, value: item } : item)),
)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const slots = computed(() => selectTheme({ size: props.size }))

const triggerClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.trigger, props.class]
    : slots.value.trigger({ class: [props.ui?.trigger, props.class] }),
)
const contentClass = computed(() =>
  isUnstyled.value ? props.ui?.content : slots.value.content({ class: props.ui?.content }),
)
const viewportClass = computed(() =>
  isUnstyled.value ? props.ui?.viewport : slots.value.viewport({ class: props.ui?.viewport }),
)
const itemClass = computed(() =>
  isUnstyled.value ? props.ui?.item : slots.value.item({ class: props.ui?.item }),
)
const itemIndicatorClass = computed(() =>
  isUnstyled.value ? undefined : slots.value.itemIndicator(),
)
</script>

<template>
  <SelectRoot v-bind="forwarded">
    <SelectTrigger :class="triggerClass">
      <SelectValue :placeholder="props.placeholder" />
      <SelectIcon as-child>
        <ChevronDown />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent :class="contentClass" position="popper" :side-offset="4">
        <SelectViewport :class="viewportClass">
          <slot>
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
              :class="itemClass"
            >
              <SelectItemIndicator :class="itemIndicatorClass">
                <Check />
              </SelectItemIndicator>
              <SelectItemText>{{ option.label }}</SelectItemText>
            </SelectItem>
          </slot>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
