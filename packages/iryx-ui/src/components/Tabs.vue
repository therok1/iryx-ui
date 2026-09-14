<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { scrollFadeMask, useScrollEdges } from '../composables/scroll-fade'
import { useIryxUiConfig } from '../config'
import { tabsTheme } from '../theme/tabs'
import Icon from './Icon.vue'

export interface TabsItem {
  label: string
  /** Identifies the tab. Defaults to the label. */
  value?: string
  icon?: IconLike
  disabled?: boolean
}

export interface TabsProps {
  items?: (TabsItem | string)[]
  variant?: 'solid' | 'line'
  orientation?: 'horizontal' | 'vertical'
  /**
   * Keep inactive panels mounted. Useful when a panel holds form state that
   * should survive switching away.
   */
  keepMounted?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ list: 'w-full' }`. */
  ui?: {
    root?: string
    frame?: string
    list?: string
    indicator?: string
    trigger?: string
    content?: string
  }
}

const props = withDefaults(defineProps<TabsProps>(), {
  unstyled: undefined,
})

const options = computed<TabsItem[]>(() =>
  (props.items ?? []).map(item => (typeof item === 'string' ? { label: item } : item)),
)

/**
 * The value defaults to the label, so simple string items just work.
 *
 * Named `itemValue`, not `valueOf`: a template resolves an identifier against
 * the render context, whose prototype chain includes `Object.prototype`. Under
 * SSR the lookup found `Object.prototype.valueOf` instead of this binding and
 * called it with no receiver, so every tab list threw "Cannot convert
 * undefined or null to object" on the server while working perfectly in the
 * browser. Avoid `toString`, `hasOwnProperty` and friends here for the same
 * reason.
 */
const itemValue = (item: TabsItem) => item.value ?? item.label

const model = defineModel<string | undefined>({ default: undefined })

const list = ref<InstanceType<typeof TabsList>>()
const listEl = computed(() => list.value?.$el as HTMLElement | undefined)
const axis = computed(() => (props.orientation === 'vertical' ? 'vertical' : 'horizontal'))
const { atStart, atEnd, overflowing } = useScrollEdges(listEl, axis)

const FADE_PX = 24

const listStyle = computed(() => {
  if (!overflowing.value)
    return undefined
  const mask = scrollFadeMask({ orientation: axis.value, size: `${FADE_PX}px`, fadeStart: !atStart.value, fadeEnd: !atEnd.value })
  return mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined
})

function revealActive(): void {
  const el = listEl.value
  const tab = el?.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
  if (!el || !tab)
    return

  const vertical = axis.value === 'vertical'
  const start = vertical ? tab.offsetTop : tab.offsetLeft
  const end = start + (vertical ? tab.offsetHeight : tab.offsetWidth)
  const scroll = vertical ? el.scrollTop : el.scrollLeft
  const view = vertical ? el.clientHeight : el.clientWidth

  let next = scroll
  if (start < scroll + FADE_PX)
    next = start - FADE_PX
  else if (end > scroll + view - FADE_PX)
    next = end - view + FADE_PX
  if (next === scroll)
    return

  if (vertical)
    el.scrollTop = Math.max(0, next)
  else
    el.scrollLeft = Math.max(0, next)
}

onMounted(() => void nextTick(revealActive))
watch(model, () => void nextTick(revealActive))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  tabsTheme({ variant: props.variant, orientation: props.orientation }),
)

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const frameClass = computed(() =>
  isUnstyled.value ? props.ui?.frame : theme.value.frame({ class: props.ui?.frame }),
)
const listClass = computed(() =>
  isUnstyled.value ? props.ui?.list : theme.value.list({ class: props.ui?.list }),
)
const indicatorClass = computed(() =>
  isUnstyled.value ? props.ui?.indicator : theme.value.indicator({ class: props.ui?.indicator }),
)
const triggerClass = computed(() =>
  isUnstyled.value ? props.ui?.trigger : theme.value.trigger({ class: props.ui?.trigger }),
)
const contentClass = computed(() =>
  isUnstyled.value ? props.ui?.content : theme.value.content({ class: props.ui?.content }),
)
</script>

<template>
  <TabsRoot
    v-model="model"
    :default-value="options[0] ? itemValue(options[0]) : undefined"
    :orientation="props.orientation"
    :class="rootClass"
  >
    <div :class="frameClass">
      <TabsList
        ref="list"
        :class="listClass"
        :style="listStyle"
        :data-overflowing="overflowing ? '' : undefined"
        :data-at-start="atStart ? '' : undefined"
        :data-at-end="atEnd ? '' : undefined"
      >
        <TabsIndicator :class="indicatorClass" />
        <slot name="list">
          <TabsTrigger
            v-for="item in options"
            :key="itemValue(item)"
            :value="itemValue(item)"
            :disabled="item.disabled"
            :class="triggerClass"
          >
            <slot name="trigger" :item="item">
              <Icon v-if="item.icon" :icon="item.icon" />
              {{ item.label }}
            </slot>
          </TabsTrigger>
        </slot>
      </TabsList>
    </div>

    <slot>
      <TabsContent
        v-for="item in options"
        :key="itemValue(item)"
        :value="itemValue(item)"
        :force-mount="props.keepMounted || undefined"
        :class="contentClass"
      >
        <slot :name="itemValue(item)" :item="item" />
      </TabsContent>
    </slot>
  </TabsRoot>
</template>
