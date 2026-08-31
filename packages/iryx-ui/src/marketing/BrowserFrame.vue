<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { computed } from 'vue'
import AspectRatio from '../components/AspectRatio.vue'
import Card from '../components/Card.vue'
import { useIryxUiConfig } from '../config'
import { browserFrameTheme } from '../theme/browser-frame'

export interface BrowserFrameProps {
  /** Address shown in the bar. Decorative — nothing is fetched. */
  url?: string
  /**
   * Hold the body at a fixed ratio, e.g. `16 / 10`. Leave it out when the
   * content sizes itself, and set it when the content is an image that has
   * not loaded yet — a reserved box is what stops the page jumping.
   */
  ratio?: number
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ bar: 'py-2' }`. */
  ui?: {
    root?: string
    bar?: string
    dot?: string
    url?: string
    body?: string
  }
}

const props = withDefaults(defineProps<BrowserFrameProps>(), {
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => browserFrameTheme({ shadow: props.shadow }))

function slotClass(slot: keyof NonNullable<BrowserFrameProps['ui']>, extra?: ClassValue): ClassValue {
  if (isUnstyled.value)
    return [props.ui?.[slot], extra]
  return theme.value[slot as 'root']({ class: [props.ui?.[slot], extra] })
}
</script>

<template>
  <Card padding="none" :unstyled="props.unstyled" :class="slotClass('root', props.class)">
    <div :class="slotClass('bar')">
      <span v-for="dot in 3" :key="dot" :class="slotClass('dot')" />
      <span v-if="props.url" :class="slotClass('url')">{{ props.url }}</span>
    </div>

    <!-- The card rounds its own top corners; the body sits under the bar. -->
    <AspectRatio v-if="props.ratio" :ratio="props.ratio" class="rounded-t-none" :class="[props.ui?.body]">
      <slot />
    </AspectRatio>
    <div v-else :class="slotClass('body')">
      <slot />
    </div>
  </Card>
</template>
