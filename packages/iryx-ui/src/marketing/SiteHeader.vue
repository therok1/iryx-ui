<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Menu01Icon } from '@hugeicons/core-free-icons'
import { Primitive } from 'reka-ui'
import { computed, useSlots } from 'vue'
import Button from '../components/Button.vue'
import Container from '../components/Container.vue'
import Drawer from '../components/Drawer.vue'
import Icon from '../components/Icon.vue'
import { useIryxUiConfig } from '../config'
import { siteHeaderTheme } from '../theme/site-header'

export interface SiteLink {
  label: string
  href: string
  /** Marks the entry as the page being viewed. */
  current?: boolean
  /** Opens in a new tab, with the `rel` that needs. */
  external?: boolean
}

export interface SiteHeaderProps {
  /** Render as a different element or component. */
  as?: string
  /** The product's name, beside the logo. */
  name?: string
  /** Where the brand links to. */
  href?: string
  links?: SiteLink[]
  /** Stick to the top of the viewport, with a blur over what scrolls under it. */
  sticky?: boolean
  bordered?: boolean
  /** Maximum content width, passed to the container. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * Below `md`, move the links into a drawer behind a menu button. Turn it off
   * for a header with no links, or one whose actions are the whole navigation.
   */
  mobileMenu?: boolean
  /** Accessible name for the menu button — override for non-English sites. */
  menuLabel?: string
  /** Heading inside the drawer. */
  menuTitle?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ container: 'h-20' }`. */
  ui?: {
    root?: string
    container?: string
    brand?: string
    nav?: string
    link?: string
    actions?: string
    menu?: string
    menuLink?: string
  }
}

const props = withDefaults(defineProps<SiteHeaderProps>(), {
  as: 'header',
  href: '/',
  sticky: undefined,
  bordered: undefined,
  mobileMenu: undefined,
  menuLabel: 'Open the menu',
  menuTitle: 'Menu',
  unstyled: undefined,
})

/** Open state of the mobile drawer, so a page can close it from the outside. */
const menuOpen = defineModel<boolean>('menuOpen', { default: false })

const slots = useSlots()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  siteHeaderTheme({ sticky: props.sticky ?? true, bordered: props.bordered ?? true }),
)

function slotClass(slot: keyof NonNullable<SiteHeaderProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}

/*
 * The drawer is rendered only when it has something to hold. A menu button
 * that opens an empty panel is worse than no button, and a header whose links
 * all fit is a common case.
 */
const hasMenu = computed(() =>
  (props.mobileMenu ?? true) && Boolean(props.links?.length || slots.menu),
)

function linkAttrs(link: SiteLink) {
  return {
    'href': link.href,
    'aria-current': link.current ? ('page' as const) : undefined,
    'target': link.external ? '_blank' : undefined,
    'rel': link.external ? 'noreferrer' : undefined,
  }
}
</script>

<template>
  <Primitive :as="props.as" :class="slotClass('root', props.class)">
    <Container :size="props.size" :class="slotClass('container')">
      <a v-if="props.name || slots.brand" :href="props.href" :class="slotClass('brand')">
        <slot name="brand">
          {{ props.name }}
        </slot>
      </a>

      <nav v-if="props.links?.length || slots.links" :class="slotClass('nav')">
        <slot name="links">
          <a v-for="link in props.links" :key="link.href" v-bind="linkAttrs(link)" :class="slotClass('link')">
            {{ link.label }}
          </a>
        </slot>
      </nav>

      <div :class="slotClass('actions')">
        <slot name="actions" />

        <Drawer
          v-if="hasMenu"
          v-model:open="menuOpen"
          side="right"
          :title="props.menuTitle"
          class="md:hidden"
        >
          <template #trigger>
            <Button variant="ghost" size="sm" square :aria-label="props.menuLabel" class="md:hidden">
              <Icon :icon="Menu01Icon" data-icon />
            </Button>
          </template>

          <nav :class="slotClass('menu')">
            <slot name="menu" :close="() => (menuOpen = false)">
              <a
                v-for="link in props.links"
                :key="link.href"
                v-bind="linkAttrs(link)"
                :class="slotClass('menuLink')"
                @click="menuOpen = false"
              >
                {{ link.label }}
              </a>
            </slot>
          </nav>
        </Drawer>
      </div>
    </Container>
  </Primitive>
</template>
