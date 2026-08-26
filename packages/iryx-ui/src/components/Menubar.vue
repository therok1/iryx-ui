<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { DropdownMenuEntry } from '../composables/dropdown-menu'
import {
  MenubarContent,
  MenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { dropdownMenuTheme } from '../theme/dropdown-menu'
import { menubarTheme } from '../theme/menubar'
import DropdownMenuItems from './DropdownMenuItems.vue'

export interface MenubarMenuOption {
  label: string
  /** Identifies the menu. Defaults to the label. */
  value?: string
  disabled?: boolean
  /** The menu's entries, in the same shape `IDropdownMenu` takes. */
  items?: DropdownMenuEntry[]
}

export interface MenubarProps {
  menus?: MenubarMenuOption[]
  /** Drop the container so the triggers sit directly on the page. */
  bare?: boolean
  /** Wrap from the last menu back to the first when arrowing past the end. */
  loop?: boolean
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ trigger: 'px-4' }`. */
  ui?: {
    root?: string
    trigger?: string
    content?: string
    item?: string
    label?: string
    separator?: string
    subTrigger?: string
    subContent?: string
  }
}

/** Menus share the entry shape, renderer and panel styling with `IDropdownMenu`. */
const props = withDefaults(defineProps<MenubarProps>(), {
  align: 'start',
  sideOffset: 6,
  unstyled: undefined,
})

/** Which menu is open, by value. Empty string means none. */
const model = defineModel<string>({ default: undefined })

const options = computed(() => props.menus ?? [])

/** Same fallback as `ITabs` and `IToggleGroup`: the label identifies it. */
const menuValue = (menu: MenubarMenuOption) => menu.value ?? menu.label

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => menubarTheme({ bare: props.bare }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const triggerClass = computed(() =>
  isUnstyled.value ? props.ui?.trigger : theme.value.trigger({ class: props.ui?.trigger }),
)
const contentClass = computed(() =>
  isUnstyled.value ? props.ui?.content : dropdownMenuTheme().content({ class: props.ui?.content }),
)
</script>

<template>
  <MenubarRoot v-model="model" :loop="props.loop" :class="rootClass">
    <MenubarMenu v-for="menu in options" :key="menuValue(menu)" :value="menuValue(menu)">
      <MenubarTrigger :disabled="menu.disabled" :class="triggerClass">
        <slot name="trigger" :menu="menu">
          {{ menu.label }}
        </slot>
      </MenubarTrigger>

      <MenubarPortal>
        <MenubarContent
          :align="props.align"
          :side-offset="props.sideOffset"
          :class="contentClass"
        >
          <DropdownMenuItems :entries="menu.items ?? []" :unstyled="isUnstyled" :ui="props.ui" />
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>
