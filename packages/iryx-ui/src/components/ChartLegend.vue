<script setup lang="ts">
import type { ChartSeries } from '../composables/cartesian'
import { computed } from 'vue'
import { seriesColor, slotOf } from '../composables/cartesian'
import { useIryxUiConfig } from '../config'
import { chartLegendTheme } from '../theme/chart-legend'

export interface ChartLegendProps {
  series: readonly ChartSeries[]
  /** Dim the entries that are not the one being hovered. */
  active?: number
  unstyled?: boolean
  class?: string
  ui?: Partial<Record<'root' | 'item' | 'swatch' | 'name', string>>
}

const props = defineProps<ChartLegendProps>()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => chartLegendTheme())

function slotClass(slot: 'root' | 'item' | 'swatch' | 'name', extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}
</script>

<template>
  <ul :class="slotClass('root', props.class)">
    <li
      v-for="(entry, index) in props.series"
      :key="entry.key"
      :class="slotClass('item', props.active != null && props.active !== index ? 'opacity-40' : undefined)"
    >
      <span :class="slotClass('swatch')" :style="{ background: seriesColor(slotOf(entry, index)) }" />
      <span :class="slotClass('name')">{{ entry.name ?? entry.key }}</span>
    </li>
  </ul>
</template>
