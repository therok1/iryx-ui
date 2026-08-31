<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { DropdownMenuEntry } from '../composables/dropdown-menu'
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { dropdownMenuTheme } from '../theme/dropdown-menu'
import DropdownMenuItems from './DropdownMenuItems.vue'

export interface ContextMenuProps {
  /** Entries to render. Nest by giving an entry its own `items`. */
  items?: DropdownMenuEntry[]
  /**
   * How far the menu is kept from the viewport edge when it would overflow.
   */
  collisionPadding?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ item: 'py-2' }`. */
  ui?: {
    content?: string
    item?: string
    label?: string
    separator?: string
    subTrigger?: string
    subContent?: string
  }
}

/** `IDropdownMenu`'s entries, renderer and theme, opened by right-click. */
const props = withDefaults(defineProps<ContextMenuProps>(), {
  unstyled: undefined,
})

/**
 * Reported, never dictated. Reka types the root as `Omit<MenuProps, 'open'>`:
 * a context menu opens where the pointer is, so there is no meaningful way to
 * open one from code — it would have nowhere to appear. Hence an emit rather
 * than a `v-model:open`.
 */
const emits = defineEmits<{ 'update:open': [value: boolean] }>()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const entries = computed(() => props.items ?? [])

const contentClass = computed(() => {
  if (isUnstyled.value)
    return [props.ui?.content, props.class]
  return dropdownMenuTheme().content({ class: [props.ui?.content, props.class] })
})
</script>

<template>
  <ContextMenuRoot @update:open="value => emits('update:open', value)">
    <ContextMenuTrigger as-child>
      <slot name="trigger" />
    </ContextMenuTrigger>

    <ContextMenuPortal>
      <ContextMenuContent :collision-padding="props.collisionPadding" :class="contentClass">
        <slot>
          <DropdownMenuItems :entries="entries" :unstyled="isUnstyled" :ui="props.ui" />
        </slot>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
