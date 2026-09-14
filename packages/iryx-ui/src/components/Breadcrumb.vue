<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { ArrowRight01Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { breadcrumbTheme } from '../theme/breadcrumb'
import DropdownMenu from './DropdownMenu.vue'
import Icon from './Icon.vue'

export interface BreadcrumbItem {
  label: string
  /** Omit on the current page. */
  href?: string
  icon?: IconLike
  /** Handle navigation yourself, e.g. with a router. */
  onSelect?: () => void
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  /**
   * Accessible name for the navigation landmark — override for non-English
   * apps.
   */
  label?: string
  /**
   * Show at most this many crumbs: the first, then a "…" menu holding the
   * middle, then the last `max - 1`. Below 2 it is treated as 2.
   */
  max?: number
  /** Accessible name for the "…" button — override for non-English apps. */
  moreLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ current: 'text-primary' }`. */
  ui?: {
    root?: string
    list?: string
    item?: string
    link?: string
    current?: string
    separator?: string
  }
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  label: 'Breadcrumb',
  moreLabel: 'Show hidden pages',
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const entries = computed(() => props.items ?? [])
/** The final crumb is the current page: rendered as text, not a link. */
const lastIndex = computed(() => entries.value.length - 1)

const hiddenCount = computed(() => {
  if (props.max === undefined)
    return 0
  const max = Math.max(props.max, 2)
  return entries.value.length > max ? entries.value.length - max : 0
})

const rows = computed(() => {
  const all = entries.value.map((item, index) => ({ item, index }))
  if (!hiddenCount.value)
    return all
  return [all[0]!, null, ...all.slice(1 + hiddenCount.value)]
})

const hiddenItems = computed(() =>
  entries.value.slice(1, 1 + hiddenCount.value).map(item => ({
    label: item.label,
    icon: item.icon,
    onSelect: item.onSelect ?? (item.href ? () => window.location.assign(item.href!) : undefined),
  })),
)

const theme = computed(() => breadcrumbTheme())

function slotClass(slot: 'root' | 'list' | 'item' | 'link' | 'current' | 'separator') {
  const override = props.ui?.[slot]
  return isUnstyled.value ? override : theme.value[slot]({ class: override })
}
</script>

<template>
  <Primitive
    as="nav"
    :aria-label="props.label"
    :class="isUnstyled ? [props.ui?.root, props.class] : theme.root({ class: [props.ui?.root, props.class] })"
  >
    <ol :class="slotClass('list')">
      <li v-for="row in rows" :key="row?.index ?? 'more'" :class="slotClass('item')">
        <DropdownMenu v-if="!row" :items="hiddenItems" :unstyled="isUnstyled">
          <template #trigger>
            <button type="button" :aria-label="props.moreLabel" :class="slotClass('link')">
              <Icon :icon="MoreHorizontalIcon" />
            </button>
          </template>
        </DropdownMenu>
        <span v-else-if="row.index === lastIndex" aria-current="page" :class="slotClass('current')">
          <Icon v-if="row.item.icon" :icon="row.item.icon" />
          {{ row.item.label }}
        </span>
        <component
          :is="row.item.href ? 'a' : 'button'"
          v-else
          :href="row.item.href"
          :type="row.item.href ? undefined : 'button'"
          :class="slotClass('link')"
          @click="row.item.onSelect?.()"
        >
          <Icon v-if="row.item.icon" :icon="row.item.icon" />
          {{ row.item.label }}
        </component>

        <span v-if="row?.index !== lastIndex" aria-hidden="true" :class="slotClass('separator')">
          <slot name="separator">
            <Icon :icon="ArrowRight01Icon" />
          </slot>
        </span>
      </li>
    </ol>
  </Primitive>
</template>
