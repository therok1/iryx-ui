<script setup lang="ts">
import type { Component } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { breadcrumbTheme } from '../theme/breadcrumb'

export interface BreadcrumbItem {
  label: string
  /** Omit on the current page. */
  href?: string
  icon?: Component
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
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ current: 'text-primary' }`. */
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
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const entries = computed(() => props.items ?? [])
/** The final crumb is the current page: rendered as text, not a link. */
const lastIndex = computed(() => entries.value.length - 1)

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
      <li v-for="(item, index) in entries" :key="index" :class="slotClass('item')">
        <span v-if="index === lastIndex" aria-current="page" :class="slotClass('current')">
          <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
          {{ item.label }}
        </span>
        <component
          :is="item.href ? 'a' : 'button'"
          v-else
          :href="item.href"
          :type="item.href ? undefined : 'button'"
          :class="slotClass('link')"
          @click="item.onSelect?.()"
        >
          <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
          {{ item.label }}
        </component>

        <span v-if="index !== lastIndex" aria-hidden="true" :class="slotClass('separator')">
          <slot name="separator">
            <ChevronRight />
          </slot>
        </span>
      </li>
    </ol>
  </Primitive>
</template>
