<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { splitterTheme } from '../theme/splitter'

export interface SplitterPanelOption {
  /** Starting size, as a percentage of the group. */
  size?: number
  minSize?: number
  maxSize?: number
  /** Allow dragging past `minSize` to collapse the panel entirely. */
  collapsible?: boolean
  /** What "collapsed" means, as a percentage. `0` hides the panel. */
  collapsedSize?: number
  /** Identifies the panel; needed when panels are conditionally rendered. */
  id?: string
}

export interface SplitterProps {
  /** One entry per panel. Two by default, split evenly. */
  panels?: SplitterPanelOption[]
  direction?: 'horizontal' | 'vertical'
  /**
   * Remember the arrangement under this key, so a reader's layout survives a
   * reload. Stored in `localStorage`.
   */
  autoSaveId?: string
  /** How far each arrow key press moves the handle, as a percentage. */
  keyboardResizeBy?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ rule: 'bg-primary' }`. */
  ui?: {
    root?: string
    panel?: string
    handle?: string
    rule?: string
  }
}

/**
 * Resizable panes divided by a draggable handle — a list beside a detail view,
 * an editor above a preview.
 *
 * Panels come from the `panels` prop and their content from numbered slots:
 * `#panel-0`, `#panel-1`, and so on. Give the splitter a height, since it
 * fills its container and a container with no height leaves nothing to split.
 */
const props = withDefaults(defineProps<SplitterProps>(), {
  direction: 'horizontal',
  unstyled: undefined,
})

const emits = defineEmits<{
  /** The new sizes, as percentages, whenever the arrangement changes. */
  layout: [sizes: number[]]
}>()

/** Two evenly split panels is the shape almost every splitter starts as. */
const entries = computed<SplitterPanelOption[]>(() =>
  props.panels?.length ? props.panels : [{}, {}],
)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => splitterTheme({ direction: props.direction }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const panelClass = computed(() =>
  isUnstyled.value ? props.ui?.panel : theme.value.panel({ class: props.ui?.panel }),
)
const handleClass = computed(() =>
  isUnstyled.value ? props.ui?.handle : theme.value.handle({ class: props.ui?.handle }),
)
const ruleClass = computed(() =>
  isUnstyled.value ? props.ui?.rule : theme.value.rule({ class: props.ui?.rule }),
)
</script>

<template>
  <SplitterGroup
    :direction="props.direction"
    :auto-save-id="props.autoSaveId"
    :keyboard-resize-by="props.keyboardResizeBy"
    :class="rootClass"
    @layout="sizes => emits('layout', sizes)"
  >
    <template v-for="(panel, index) in entries" :key="panel.id ?? index">
      <!--
        A handle goes *between* panels, so it is rendered ahead of every panel
        but the first. Trailing it after each panel instead would leave one
        hanging off the end of the group with nothing to resize.
      -->
      <SplitterResizeHandle v-if="index > 0" :class="handleClass">
        <slot name="handle">
          <span :class="ruleClass" />
        </slot>
      </SplitterResizeHandle>

      <SplitterPanel
        :id="panel.id"
        :default-size="panel.size"
        :min-size="panel.minSize"
        :max-size="panel.maxSize"
        :collapsible="panel.collapsible"
        :collapsed-size="panel.collapsedSize"
        :class="panelClass"
      >
        <slot :name="`panel-${index}`" :panel="panel" :index="index" />
      </SplitterPanel>
    </template>
  </SplitterGroup>
</template>
