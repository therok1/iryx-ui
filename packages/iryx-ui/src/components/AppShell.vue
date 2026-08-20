<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, ref, useSlots } from 'vue'
import { useElementSize } from '../composables/element-size'
import { useIryxUiConfig } from '../config'
import { appShellTheme } from '../theme/app-shell'

export interface AppShellProps {
  /** Render as a different element or component. */
  as?: string
  /**
   * `main` pins the shell to the viewport and scrolls only the content column.
   * `page` scrolls the document, with a sticky header and sidebar.
   */
  scroll?: 'main' | 'page'
  sidebarPosition?: 'left' | 'right'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ main: 'p-8' }`. */
  ui?: {
    root?: string
    header?: string
    body?: string
    sidebar?: string
    main?: string
    footer?: string
  }
}

const props = withDefaults(defineProps<AppShellProps>(), {
  as: 'div',
  scroll: 'main',
  sidebarPosition: 'left',
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

const theme = computed(() =>
  appShellTheme({ scroll: props.scroll, sidebarPosition: props.sidebarPosition }),
)

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
      <slot name="header" />
    </div>

    <div :class="slotClass('body')">
      <div v-if="$slots.sidebar" :class="slotClass('sidebar')">
        <slot name="sidebar" />
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
