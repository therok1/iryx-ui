<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { popoverTheme } from '../theme/popover'
import Icon from './Icon.vue'

export interface PopoverProps {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Render the little pointer against the trigger. */
  arrow?: boolean
  /**
   * Trap focus and make the rest of the page inert, as a dialog does. For a
   * popover holding a form rather than a passing detail.
   */
  modal?: boolean
  /** Show a close button in the corner. */
  showClose?: boolean
  /** Names that close button, since it is an icon on its own. */
  closeLabel?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** `none` lets the content size itself — for a grid or a menu. */
  width?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Heading shown above the content. It is also the only row inset to clear
   * the close button, so the body below can fill the panel's full width.
   */
  title?: string
  /** Names the panel for a screen reader. Without one it is an unnamed dialog. */
  ariaLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ content: 'w-96' }`. */
  ui?: {
    content?: string
    title?: string
    arrow?: string
    close?: string
  }
}

/**
 * A panel anchored to whatever opened it, for content too big for a tooltip
 * and too small for a dialog. Unlike `ITooltip` it takes focus and can hold
 * interactive content; unlike `IDialog` it leaves the page usable behind it.
 */
const props = withDefaults(defineProps<PopoverProps>(), {
  side: 'bottom',
  align: 'center',
  sideOffset: 6,
  closeLabel: 'Close',
  unstyled: undefined,
})

const open = defineModel<boolean>('open', { default: undefined })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  popoverTheme({ padding: props.padding, width: props.width, withClose: props.showClose }),
)

const contentClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.content, props.class]
    // `relative` anchors the close button, which is positioned against it.
    : theme.value.content({ class: [props.showClose && 'relative', props.ui?.content, props.class] }),
)
const arrowClass = computed(() =>
  isUnstyled.value ? props.ui?.arrow : theme.value.arrow({ class: props.ui?.arrow }),
)
const closeClass = computed(() =>
  isUnstyled.value ? props.ui?.close : theme.value.close({ class: props.ui?.close }),
)
const titleClass = computed(() =>
  isUnstyled.value ? props.ui?.title : theme.value.title({ class: props.ui?.title }),
)
</script>

<template>
  <PopoverRoot v-model:open="open" :modal="props.modal">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
        :aria-label="props.ariaLabel"
        :class="contentClass"
      >
        <p v-if="props.title || $slots.title" :class="titleClass">
          <slot name="title">
            {{ props.title }}
          </slot>
        </p>

        <slot :close="() => (open = false)" />

        <!--
          Positioned in the panel's own padding rather than given room by it.
          Padding the panel indented every row, so a form inside could never
          reach the full width; only `title` makes way for the button now.
        -->
        <PopoverClose v-if="props.showClose" data-popover-close :aria-label="props.closeLabel" :class="closeClass">
          <Icon :icon="Cancel01Icon" />
        </PopoverClose>

        <PopoverArrow v-if="props.arrow" :class="arrowClass" :width="10" :height="5" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
