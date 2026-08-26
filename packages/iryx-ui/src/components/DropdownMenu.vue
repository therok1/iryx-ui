<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { DropdownMenuEntry } from '../composables/dropdown-menu'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { dropdownMenuTheme } from '../theme/dropdown-menu'
import DropdownMenuItems from './DropdownMenuItems.vue'

export interface DropdownMenuProps {
  /** Entries to render. Nest by giving an entry its own `items`. */
  items?: DropdownMenuEntry[]
  /** Which edge of the trigger to align to. */
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ item: 'py-2' }`. */
  ui?: {
    content?: string
    header?: string
    item?: string
    label?: string
    separator?: string
    subTrigger?: string
    subContent?: string
  }
}

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  align: 'start',
  sideOffset: 4,
  unstyled: undefined,
})

defineSlots<{
  /** What opens the menu. */
  trigger?: () => unknown
  /**
   * A block above the items — an account's name and address, a workspace, a
   * plan. Not a menu row: it is not focusable and nothing selects it.
   */
  header?: () => unknown
  /** Replaces the items entirely. */
  default?: () => unknown
}>()

const open = defineModel<boolean>('open', { default: false })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const entries = computed(() => props.items ?? [])

const headerClass = computed(() => {
  if (isUnstyled.value)
    return props.ui?.header
  return dropdownMenuTheme().header({ class: props.ui?.header })
})

const contentClass = computed(() => {
  if (isUnstyled.value)
    return [props.ui?.content, props.class]
  return dropdownMenuTheme().content({ class: [props.ui?.content, props.class] })
})
</script>

<template>
  <DropdownMenuRoot v-model:open="open">
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :align="props.align"
        :align-offset="props.alignOffset"
        :side="props.side"
        :side-offset="props.sideOffset"
        :class="contentClass"
      >
        <!--
          Outside the item list on purpose: a header is read, not chosen, so
          it must not take a stop in the arrow-key order or answer to
          typeahead.
        -->
        <div v-if="$slots.header" :class="headerClass">
          <slot name="header" />
        </div>

        <slot>
          <DropdownMenuItems :entries="entries" :unstyled="isUnstyled" :ui="props.ui" />
        </slot>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
