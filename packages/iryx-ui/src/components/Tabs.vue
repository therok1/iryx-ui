<script setup lang="ts">
import type { Component } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { tabsTheme } from '../theme/tabs'

export interface TabsItem {
  label: string
  /** Identifies the tab. Defaults to the label. */
  value?: string
  icon?: Component
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
  class?: string
  /** Override classes per slot, e.g. `{ list: 'w-full' }`. */
  ui?: {
    root?: string
    list?: string
    trigger?: string
    content?: string
  }
}

// `unstyled: undefined` is required: Vue casts absent boolean props to
// `false`, which would shadow the global config.
const props = withDefaults(defineProps<TabsProps>(), {
  unstyled: undefined,
})

const options = computed<TabsItem[]>(() =>
  (props.items ?? []).map(item => (typeof item === 'string' ? { label: item } : item)),
)

/** The value defaults to the label, so simple string items just work. */
const valueOf = (item: TabsItem) => item.value ?? item.label

const model = defineModel<string>({ default: undefined })

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
const listClass = computed(() =>
  isUnstyled.value ? props.ui?.list : theme.value.list({ class: props.ui?.list }),
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
    :default-value="options[0] ? valueOf(options[0]) : undefined"
    :orientation="props.orientation"
    :class="rootClass"
  >
    <TabsList :class="listClass">
      <slot name="list">
        <TabsTrigger
          v-for="item in options"
          :key="valueOf(item)"
          :value="valueOf(item)"
          :disabled="item.disabled"
          :class="triggerClass"
        >
          <slot name="trigger" :item="item">
            <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
            {{ item.label }}
          </slot>
        </TabsTrigger>
      </slot>
    </TabsList>

    <slot>
      <TabsContent
        v-for="item in options"
        :key="valueOf(item)"
        :value="valueOf(item)"
        :force-mount="props.keepMounted || undefined"
        :class="contentClass"
      >
        <slot :name="valueOf(item)" :item="item" />
      </TabsContent>
    </slot>
  </TabsRoot>
</template>
