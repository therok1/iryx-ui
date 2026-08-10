<script setup lang="ts">
import type { DropdownMenuEntry } from '../composables/dropdown-menu'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from 'reka-ui'
import { isSeparator, isSubmenu } from '../composables/dropdown-menu'
import { dropdownMenuTheme } from '../theme/dropdown-menu'
import Icon from './Icon.vue'

/**
 * Renders one level of menu entries, recursing into submenus.
 *
 * Split out of `DropdownMenu` so it can call itself: an SFC may reference
 * itself by its filename, which is what allows arbitrary nesting depth.
 */
export interface DropdownMenuItemsProps {
  entries: DropdownMenuEntry[]
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  ui?: {
    item?: string
    label?: string
    separator?: string
    subTrigger?: string
    subContent?: string
  }
}

const props = withDefaults(defineProps<DropdownMenuItemsProps>(), {
  unstyled: undefined,
})

function slotClass(slot: 'item' | 'label' | 'separator' | 'subTrigger' | 'subContent', danger?: boolean) {
  const override = props.ui?.[slot]
  if (props.unstyled)
    return override
  return dropdownMenuTheme({ danger })[slot]({ class: override })
}

const subTriggerIconClass = props.unstyled ? undefined : dropdownMenuTheme().subTriggerIcon()
</script>

<template>
  <template v-for="(entry, index) in props.entries" :key="index">
    <DropdownMenuSeparator v-if="isSeparator(entry)" :class="slotClass('separator')" />

    <!-- Nested menu: the entry becomes a trigger for its own content. -->
    <DropdownMenuSub v-else-if="isSubmenu(entry)">
      <DropdownMenuSubTrigger :disabled="entry.disabled" :class="slotClass('subTrigger')">
        <Icon v-if="entry.icon" :icon="entry.icon" />
        {{ entry.label }}
        <Icon :icon="ArrowRight01Icon" :class="subTriggerIconClass" />
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent :class="slotClass('subContent')" :side-offset="4">
          <DropdownMenuItems
            :entries="entry.items!"
            :unstyled="props.unstyled"
            :ui="props.ui"
          />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>

    <DropdownMenuLabel v-else-if="!entry.onSelect" :class="slotClass('label')">
      {{ entry.label }}
    </DropdownMenuLabel>

    <DropdownMenuItem
      v-else
      :disabled="entry.disabled"
      :class="slotClass('item', entry.danger)"
      @select="entry.onSelect"
    >
      <Icon v-if="entry.icon" :icon="entry.icon" />
      {{ entry.label }}
    </DropdownMenuItem>
  </template>
</template>
