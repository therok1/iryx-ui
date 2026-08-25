<script setup lang="ts">
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { hoverCardTheme } from '../theme/hover-card'

export interface HoverCardProps {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Render the little pointer against the trigger. */
  arrow?: boolean
  /** How long the pointer must rest on the trigger before the card opens, in ms. */
  openDelay?: number
  /**
   * Grace period after the pointer leaves, in ms. It is what lets the pointer
   * travel from the trigger to the card without the card vanishing on the way.
   */
  closeDelay?: number
  /**
   * Open on touch as well. Off by default, and worth leaving off: a tap has no
   * hover to precede it, so the card competes with whatever the trigger does
   * when tapped. Put the same content somewhere reachable instead.
   */
  enableTouch?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** `none` lets the content size itself. */
  width?: 'none' | 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: {
    content?: string
    arrow?: string
  }
}

/**
 * A preview of what a link points at, shown when the pointer rests on it.
 *
 * It is for **supplementary** content — a profile, a definition, a summary of
 * the page behind a link. Nothing inside may be the only way to reach an
 * action: the card is hover- and focus-summoned, so a touch user never sees
 * it. `ITooltip` is the one for a short label, and `IPopover` the one for
 * content a reader has to be able to click into.
 */
const props = withDefaults(defineProps<HoverCardProps>(), {
  side: 'bottom',
  align: 'center',
  sideOffset: 6,
  unstyled: undefined,
})

const open = defineModel<boolean>('open', { default: undefined })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => hoverCardTheme({ padding: props.padding, width: props.width }))

const contentClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.content, props.class]
    : theme.value.content({ class: [props.ui?.content, props.class] }),
)
const arrowClass = computed(() =>
  isUnstyled.value ? props.ui?.arrow : theme.value.arrow({ class: props.ui?.arrow }),
)
</script>

<template>
  <HoverCardRoot
    v-model:open="open"
    :open-delay="props.openDelay"
    :close-delay="props.closeDelay"
    :enable-touch="props.enableTouch"
  >
    <HoverCardTrigger as-child>
      <slot name="trigger" />
    </HoverCardTrigger>

    <HoverCardPortal>
      <HoverCardContent
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
        :class="contentClass"
      >
        <slot />

        <HoverCardArrow v-if="props.arrow" :class="arrowClass" :width="10" :height="5" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
