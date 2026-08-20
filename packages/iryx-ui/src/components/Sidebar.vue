<script setup lang="ts">
import type { SidebarItems, SidebarLink } from '../composables/sidebar'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger, Primitive } from 'reka-ui'
import { computed } from 'vue'
import { isSidebarGroup, toSidebarSections } from '../composables/sidebar'
import { useIryxUiConfig } from '../config'
import { sidebarTheme } from '../theme/sidebar'
import Icon from './Icon.vue'

export interface SidebarProps {
  /** Links, optionally grouped into labelled sections. */
  items?: SidebarItems
  /** Which edge it sits on. Only decides where the border goes. */
  side?: 'left' | 'right'
  /**
   * Accessible name for the navigation landmark — override for non-English
   * apps.
   */
  label?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ nav: 'px-4' }`. */
  ui?: {
    root?: string
    header?: string
    nav?: string
    footer?: string
    section?: string
    sectionLabel?: string
    link?: string
    linkLabel?: string
    linkBadge?: string
    groupIcon?: string
    groupContent?: string
  }
}

const props = withDefaults(defineProps<SidebarProps>(), {
  side: 'left',
  label: 'Sidebar',
  unstyled: undefined,
})

/** Icons-only mode. Bind it to persist the choice, or leave it internal. */
const collapsed = defineModel<boolean>('collapsed', { default: false })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const sections = computed(() => toSidebarSections(props.items))

const theme = computed(() => sidebarTheme({ side: props.side, collapsed: collapsed.value }))

type Slot = keyof NonNullable<SidebarProps['ui']>

function slotClass(slot: Slot) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? override : theme.value[slot]({ class: override })
}

/** Anchors get a real href; everything else stays a button so it is focusable. */
const tagOf = (link: SidebarLink) => (link.href ? 'a' : 'button')

function onSelect(link: SidebarLink, event: Event) {
  if (link.disabled) {
    event.preventDefault()
    return
  }
  link.onSelect?.()
}

/**
 * Collapsed hides the label from sight, so the accessible name has to come
 * from somewhere else. Set unconditionally rather than only when collapsed:
 * a name that appears and disappears with a layout state is worse than one
 * that is simply always correct.
 */
const nameOf = (link: SidebarLink) => link.label
</script>

<template>
  <Primitive
    as="nav"
    :aria-label="props.label"
    :data-collapsed="collapsed ? '' : undefined"
    :class="isUnstyled ? [props.ui?.root, props.class] : theme.root({ class: [props.ui?.root, props.class] })"
  >
    <div v-if="$slots.header" :class="slotClass('header')">
      <slot name="header" :collapsed="collapsed" />
    </div>

    <div :class="slotClass('nav')">
      <slot :collapsed="collapsed">
        <div
          v-for="(section, index) in sections"
          :key="section.section || index"
          :class="slotClass('section')"
        >
          <p v-if="section.section" :class="slotClass('sectionLabel')">
            {{ section.section }}
          </p>

          <template v-for="link in section.items" :key="link.label">
            <!-- A group: the trigger is the link row, children live under it. -->
            <CollapsibleRoot
              v-if="isSidebarGroup(link)"
              :default-open="link.defaultOpen"
              :disabled="link.disabled"
            >
              <CollapsibleTrigger
                :aria-label="nameOf(link)"
                :data-active="link.active ? '' : undefined"
                :data-disabled="link.disabled ? '' : undefined"
                :class="slotClass('link')"
              >
                <Icon v-if="link.icon" :icon="link.icon" />
                <span :class="slotClass('linkLabel')">{{ link.label }}</span>
                <Icon :icon="ArrowRight01Icon" :class="slotClass('groupIcon')" />
              </CollapsibleTrigger>

              <CollapsibleContent :class="slotClass('groupContent')">
                <component
                  :is="tagOf(child)"
                  v-for="child in link.items"
                  :key="child.label"
                  :href="child.href"
                  :type="child.href ? undefined : 'button'"
                  :aria-label="nameOf(child)"
                  :aria-current="child.active ? 'page' : undefined"
                  :aria-disabled="child.disabled || undefined"
                  :data-active="child.active ? '' : undefined"
                  :data-disabled="child.disabled ? '' : undefined"
                  :class="slotClass('link')"
                  @click="(event: Event) => onSelect(child, event)"
                >
                  <Icon v-if="child.icon" :icon="child.icon" />
                  <span :class="slotClass('linkLabel')">{{ child.label }}</span>
                  <span v-if="child.badge !== undefined" :class="slotClass('linkBadge')">
                    {{ child.badge }}
                  </span>
                </component>
              </CollapsibleContent>
            </CollapsibleRoot>

            <component
              :is="tagOf(link)"
              v-else
              :href="link.href"
              :type="link.href ? undefined : 'button'"
              :aria-label="nameOf(link)"
              :aria-current="link.active ? 'page' : undefined"
              :aria-disabled="link.disabled || undefined"
              :data-active="link.active ? '' : undefined"
              :data-disabled="link.disabled ? '' : undefined"
              :class="slotClass('link')"
              @click="(event: Event) => onSelect(link, event)"
            >
              <slot name="link" :link="link" :collapsed="collapsed">
                <Icon v-if="link.icon" :icon="link.icon" />
                <span :class="slotClass('linkLabel')">{{ link.label }}</span>
                <span v-if="link.badge !== undefined" :class="slotClass('linkBadge')">
                  {{ link.badge }}
                </span>
              </slot>
            </component>
          </template>
        </div>
      </slot>
    </div>

    <div v-if="$slots.footer" :class="slotClass('footer')">
      <slot name="footer" :collapsed="collapsed" />
    </div>
  </Primitive>
</template>
