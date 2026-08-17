<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'reka-ui'
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import {
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
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
import Icon from './Icon.vue'

export interface SelectItemOption {
  label: string
  value: string
  disabled?: boolean
}

/** A labelled run of options, rendered under a heading. */
export interface SelectItemGroup {
  label: string
  items: (SelectItemOption | string)[]
}

export type SelectItems = (SelectItemOption | SelectItemGroup | string)[]

export interface SelectProps extends SelectRootProps {
  /**
   * Options to render. Strings are expanded to `{ label, value }`, and an
   * entry with its own `items` becomes a labelled group.
   */
  items?: SelectItems
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: {
    trigger?: string
    content?: string
    viewport?: string
    item?: string
    group?: string
    groupLabel?: string
  }
}

/**
 * `SelectRoot` is renderless, so an attribute left to fall through never
 * reached a real element — a `<ISelect aria-label="…">` produced a trigger
 * with no accessible name, which the axe sweep caught. Attributes go to the
 * trigger, which is the button the user actually operates and the element
 * `IFormField` already targets.
 */
defineOptions({ inheritAttrs: false })

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

function toOption(item: SelectItemOption | string): SelectItemOption {
  return typeof item === 'string' ? { label: item, value: item } : item
}

function isGroup(item: SelectItemOption | SelectItemGroup | string): item is SelectItemGroup {
  return typeof item !== 'string' && 'items' in item
}

/** The `items` prop as groups, or `undefined` when it's a flat list. */
const groups = computed<{ label: string, options: SelectItemOption[] }[] | undefined>(() => {
  const items = props.items ?? []
  if (!items.some(isGroup))
    return undefined
  return items.map(item =>
    isGroup(item)
      ? { label: item.label, options: item.items.map(toOption) }
      : { label: '', options: [toOption(item)] },
  )
})

const options = computed<SelectItemOption[]>(() => (props.items ?? []).flatMap(item =>
  isGroup(item) ? item.items.map(toOption) : [toOption(item)],
))

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
const groupClass = computed(() =>
  isUnstyled.value ? props.ui?.group : slots.value.group({ class: props.ui?.group }),
)
const groupLabelClass = computed(() =>
  isUnstyled.value ? props.ui?.groupLabel : slots.value.groupLabel({ class: props.ui?.groupLabel }),
)
</script>

<template>
  <SelectRoot v-bind="forwarded">
    <SelectTrigger v-bind="$attrs" :class="triggerClass">
      <SelectValue :placeholder="props.placeholder" />
      <SelectIcon as-child>
        <Icon :icon="ArrowDown01Icon" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <!--
        `item-aligned` (Reka's default) positions the menu over the trigger with
        the selected item under the cursor, the way a native macOS select does.
        It takes no side offset — that belongs to `popper` positioning.
      -->
      <SelectContent :class="contentClass" position="item-aligned">
        <SelectViewport :class="viewportClass">
          <slot>
            <template v-if="groups">
              <SelectGroup
                v-for="(group, index) in groups"
                :key="group.label || index"
                :class="groupClass"
              >
                <SelectLabel v-if="group.label" :class="groupLabelClass">
                  {{ group.label }}
                </SelectLabel>
                <SelectItem
                  v-for="option in group.options"
                  :key="option.value"
                  :value="option.value"
                  :disabled="option.disabled"
                  :class="itemClass"
                >
                  <SelectItemIndicator :class="itemIndicatorClass">
                    <Icon :icon="Tick02Icon" />
                  </SelectItemIndicator>
                  <SelectItemText>{{ option.label }}</SelectItemText>
                </SelectItem>
              </SelectGroup>
            </template>

            <SelectItem
              v-for="option in options"
              v-else
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
              :class="itemClass"
            >
              <SelectItemIndicator :class="itemIndicatorClass">
                <Icon :icon="Tick02Icon" />
              </SelectItemIndicator>
              <SelectItemText>{{ option.label }}</SelectItemText>
            </SelectItem>
          </slot>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
