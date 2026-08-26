<script setup lang="ts">
import type { ClassValue } from '../class-value'
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { tooltipTheme } from '../theme/tooltip'

export interface TooltipProps {
  /** Tooltip text. Ignored when the `content` slot is used. */
  text?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Milliseconds to hover before it opens. */
  delay?: number
  /** Render the little pointer against the trigger. */
  arrow?: boolean
  disabled?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ content: 'max-w-sm' }`. */
  ui?: {
    content?: string
    arrow?: string
  }
}

const props = withDefaults(defineProps<TooltipProps>(), {
  side: 'top',
  sideOffset: 6,
  delay: 300,
  unstyled: undefined,
})

const open = defineModel<boolean | undefined>('open', { default: undefined })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => tooltipTheme())

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
  <TooltipProvider :delay-duration="props.delay">
    <TooltipRoot v-model:open="open" :disabled="props.disabled">
      <TooltipTrigger as-child>
        <slot name="trigger" />
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent
          :side="props.side"
          :align="props.align"
          :side-offset="props.sideOffset"
          :class="contentClass"
        >
          <slot name="content">
            {{ props.text }}
          </slot>
          <TooltipArrow v-if="props.arrow" :class="arrowClass" :width="10" :height="5" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
