<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Menu01Icon } from '@hugeicons/core-free-icons'
import { Primitive } from 'reka-ui'
import { computed, ref, useSlots } from 'vue'
import { useElementSize } from '../composables/element-size'
import { useIryxUiConfig } from '../config'
import { appShellTheme } from '../theme/app-shell'
import Drawer from './Drawer.vue'
import Icon from './Icon.vue'

export interface AppShellProps {
  /** Render as a different element or component. */
  as?: string
  /**
   * `main` pins the shell to the viewport and scrolls only the content column.
   * `page` scrolls the document, with a sticky header and sidebar.
   */
  scroll?: 'main' | 'page'
  sidebarPosition?: 'left' | 'right'
  /**
   * Below `md`, move the sidebar into a drawer and put a trigger for it in
   * the header. A sidebar narrow enough for a phone is not a sidebar, and
   * one that simply squeezes takes the content column with it.
   */
  mobileNav?: boolean
  /** Accessible name for that trigger — override for non-English apps. */
  navLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ main: 'p-8' }`. */
  ui?: {
    root?: string
    header?: string
    body?: string
    sidebar?: string
    headerRow?: string
    headerContent?: string
    navTrigger?: string
    navDrawer?: string
    navDrawerBody?: string
    main?: string
    footer?: string
  }
}

const props = withDefaults(defineProps<AppShellProps>(), {
  as: 'div',
  scroll: 'main',
  sidebarPosition: 'left',
  mobileNav: true,
  navLabel: 'Open navigation',
  unstyled: undefined,
})

const slots = useSlots()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const header = ref<HTMLElement>()
const { height: headerHeight } = useElementSize(header)

/**
 * In `page` mode the sidebar sticks to the viewport, which would park it
 * behind the sticky header. There is no way to express "below the header" in
 * CSS without knowing how tall the header is, so it is measured and published
 * as a variable the theme's `top-(--iryx-shell-header-height)` reads.
 *
 * `useElementSize` reports the content box, so this is only the true offset
 * while the header wrapper carries no padding of its own — it does not, and an
 * app adding some via `ui.header` should pad its own bar instead.
 */
const rootStyle = computed(() =>
  props.scroll === 'page' && slots.header
    ? { '--iryx-shell-header-height': `${headerHeight.value}px` }
    : undefined,
)

/** Open state for the mobile drawer. Closed again whenever a link is used. */
const navOpen = ref(false)

/*
 * Only worth a drawer if there is something to put in it. An app with no
 * sidebar slot gets no trigger and no drawer at all.
 */
const hasMobileNav = computed(() => props.mobileNav && Boolean(slots.sidebar))

const theme = computed(() =>
  appShellTheme({
    scroll: props.scroll,
    sidebarPosition: props.sidebarPosition,
    mobileNav: hasMobileNav.value,
  }),
)

defineExpose({
  /** Open or close the mobile navigation drawer from the outside. */
  navOpen,
})

type Slot = keyof NonNullable<AppShellProps['ui']>

function slotClass(slot: Slot) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? override : theme.value[slot]({ class: override })
}
</script>

<template>
  <Primitive
    :as="props.as"
    :style="rootStyle"
    :class="isUnstyled ? [props.ui?.root, props.class] : theme.root({ class: [props.ui?.root, props.class] })"
  >
    <div v-if="$slots.header" ref="header" :class="slotClass('header')">
      <!--
        The trigger is the shell's own, not the app's, so a sidebar becomes
        usable on a phone without the app wiring anything up. It leads the row
        because a navigation control belongs at the start of a bar, and it is
        `md:hidden`, so the row collapses back to just the app's own content on
        a wide screen.
      -->
      <div :class="slotClass('headerRow')">
        <button
          v-if="hasMobileNav"
          type="button"
          :aria-label="props.navLabel"
          :aria-expanded="navOpen"
          :class="slotClass('navTrigger')"
          @click="navOpen = true"
        >
          <Icon :icon="Menu01Icon" />
        </button>

        <div :class="slotClass('headerContent')">
          <slot name="header" :nav-open="navOpen" :toggle-nav="() => (navOpen = !navOpen)" />
        </div>
      </div>
    </div>

    <!--
      The same slot, rendered a second time. Vue renders slot content per call
      site, so the drawer gets its own instances rather than moving the
      sidebar's nodes about — which would tear down and rebuild the sidebar on
      every breakpoint change.
    -->
    <Drawer
      v-if="hasMobileNav"
      v-model:open="navOpen"
      side="left"
      size="sm"
      :class="slotClass('navDrawer')"
      :ui="{
        body: slotClass('navDrawerBody'),
        /* Left open across a resize past the breakpoint, the panel would sit
           over a layout that already has its sidebar back. */
        overlay: 'md:hidden',
        content: 'md:hidden',
      }"
    >
      <slot name="sidebar" :in-drawer="true" />
    </Drawer>

    <div :class="slotClass('body')">
      <div v-if="$slots.sidebar" :class="slotClass('sidebar')">
        <slot name="sidebar" :in-drawer="false" />
      </div>

      <main :class="slotClass('main')">
        <slot />
      </main>
    </div>

    <div v-if="$slots.footer" :class="slotClass('footer')">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
