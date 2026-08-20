<script setup lang="ts">
import type { NavigationMenuEntry, NavigationMenuGroupItem, NavigationMenuLinkItem } from '../composables/navigation-menu'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from 'reka-ui'
import { computed } from 'vue'
import { isNavigationGroup } from '../composables/navigation-menu'
import { useIryxUiConfig } from '../config'
import { navigationMenuTheme } from '../theme/navigation-menu'
import Icon from './Icon.vue'

export interface NavigationMenuProps {
  /** Top-level entries. An entry with `items` opens a panel. */
  items?: NavigationMenuEntry[]
  orientation?: 'horizontal' | 'vertical'
  /** Columns in a panel. An entry can override this with its own `columns`. */
  columns?: 1 | 2 | 3
  /**
   * Accessible name for the navigation landmark — override for non-English
   * apps.
   */
  label?: string
  /** Milliseconds a pointer must rest on a trigger before its panel opens. */
  delayDuration?: number
  /** Open panels on click only, for touch-first apps. */
  disableHoverTrigger?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ viewport: 'w-96' }`. */
  ui?: {
    root?: string
    list?: string
    item?: string
    link?: string
    triggerIcon?: string
    viewportWrapper?: string
    viewport?: string
    content?: string
    panelLink?: string
    panelLabel?: string
    panelDescription?: string
    panelIcon?: string
  }
}

const props = withDefaults(defineProps<NavigationMenuProps>(), {
  label: 'Main',
  orientation: 'horizontal',
  columns: 1,
  unstyled: undefined,
})

/** Which panel is open, by entry value. Empty string means none. */
const model = defineModel<string>({ default: undefined })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const entries = computed(() => props.items ?? [])

/**
 * Reka needs a stable per-item value to track the active panel. The label is
 * it, for the same reason `ITabs` uses it: simple menus then need no ids at
 * all. Not named `valueOf` — see the note in `Tabs.vue` for why that name
 * resolves to `Object.prototype` under SSR.
 */
const entryValue = (entry: NavigationMenuEntry) => entry.label

/** No group means no panel, so the viewport would be an empty absolute box. */
const hasPanels = computed(() => entries.value.some(isNavigationGroup))

const theme = computed(() => navigationMenuTheme({ orientation: props.orientation }))

type Slot = keyof NonNullable<NavigationMenuProps['ui']>

function slotClass(slot: Slot) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? override : theme.value[slot]({ class: override })
}

/** A panel's grid, which an entry may widen past the menu-wide default. */
function contentClass(entry: NavigationMenuGroupItem) {
  const override = props.ui?.content
  if (isUnstyled.value)
    return override
  return navigationMenuTheme({
    orientation: props.orientation,
    columns: entry.columns ?? props.columns,
  }).content({ class: override })
}

/** Anchors get a real href; everything else stays a button so it is focusable. */
const tagOf = (item: NavigationMenuLinkItem) => (item.href ? 'a' : 'button')

function onSelect(item: NavigationMenuLinkItem, event: Event) {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  item.onSelect?.()
}
</script>

<template>
  <NavigationMenuRoot
    v-model="model"
    :orientation="props.orientation"
    :delay-duration="props.delayDuration"
    :disable-hover-trigger="props.disableHoverTrigger"
    :aria-label="props.label"
    :class="isUnstyled ? [props.ui?.root, props.class] : theme.root({ class: [props.ui?.root, props.class] })"
  >
    <NavigationMenuList :class="slotClass('list')">
      <slot name="list">
        <NavigationMenuItem
          v-for="entry in entries"
          :key="entryValue(entry)"
          :value="entryValue(entry)"
          :class="slotClass('item')"
        >
          <template v-if="isNavigationGroup(entry)">
            <NavigationMenuTrigger :disabled="entry.disabled" :class="slotClass('link')">
              <slot name="trigger" :item="entry">
                <Icon v-if="entry.icon" :icon="entry.icon" />
                {{ entry.label }}
                <Icon :icon="ArrowDown01Icon" :class="slotClass('triggerIcon')" />
              </slot>
            </NavigationMenuTrigger>

            <NavigationMenuContent :class="contentClass(entry)">
              <slot name="panel" :item="entry">
                <NavigationMenuLink
                  v-for="child in entry.items"
                  :key="child.label"
                  as-child
                  :active="child.active"
                  @select="(event: Event) => onSelect(child, event)"
                >
                  <component
                    :is="tagOf(child)"
                    :href="child.href"
                    :target="child.target"
                    :type="child.href ? undefined : 'button'"
                    :aria-current="child.active ? 'page' : undefined"
                    :aria-disabled="child.disabled || undefined"
                    :data-disabled="child.disabled ? '' : undefined"
                    :class="slotClass('panelLink')"
                  >
                    <span v-if="child.icon" :class="slotClass('panelIcon')">
                      <Icon :icon="child.icon" />
                    </span>
                    <span>
                      <span :class="slotClass('panelLabel')">{{ child.label }}</span>
                      <span v-if="child.description" :class="slotClass('panelDescription')">
                        {{ child.description }}
                      </span>
                    </span>
                  </component>
                </NavigationMenuLink>
              </slot>
            </NavigationMenuContent>
          </template>

          <NavigationMenuLink
            v-else
            as-child
            :active="entry.active"
            @select="(event: Event) => onSelect(entry, event)"
          >
            <component
              :is="tagOf(entry)"
              :href="entry.href"
              :target="entry.target"
              :type="entry.href ? undefined : 'button'"
              :aria-current="entry.active ? 'page' : undefined"
              :aria-disabled="entry.disabled || undefined"
              :data-disabled="entry.disabled ? '' : undefined"
              :class="slotClass('link')"
            >
              <slot name="item" :item="entry">
                <Icon v-if="entry.icon" :icon="entry.icon" />
                {{ entry.label }}
              </slot>
            </component>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </slot>
    </NavigationMenuList>

    <div v-if="hasPanels" :class="slotClass('viewportWrapper')">
      <NavigationMenuViewport :class="slotClass('viewport')" />
    </div>
  </NavigationMenuRoot>
</template>
