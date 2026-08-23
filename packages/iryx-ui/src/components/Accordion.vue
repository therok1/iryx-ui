<script setup lang="ts">
import type { IconLike } from '../composables/icon'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { accordionTheme } from '../theme/accordion'
import Icon from './Icon.vue'

export interface AccordionItemData {
  /** Row heading, and the fallback value when none is given. */
  label: string
  /** Body text. Use the `content` slot for anything with markup. */
  content?: string
  /** Identity in the model. Defaults to the label. */
  value?: string
  icon?: IconLike
  disabled?: boolean
}

export interface AccordionProps {
  items?: AccordionItemData[]
  /** One panel open at a time, or several. */
  type?: 'single' | 'multiple'
  /**
   * Let the open panel be closed again by clicking its trigger. Only means
   * anything for `single` — with `multiple` every panel already closes.
   */
  collapsible?: boolean
  variant?: 'plain' | 'outline'
  disabled?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: Partial<Record<
    'root' | 'item' | 'header' | 'trigger' | 'icon' | 'content' | 'contentInner',
    string
  >>
}

const props = withDefaults(defineProps<AccordionProps>(), {
  type: 'single',
  collapsible: true,
  unstyled: undefined,
})

/**
 * `string` for `single`, `string[]` for `multiple` — Reka's own shape, kept
 * rather than normalised, so a caller's model reads the way the docs for the
 * primitive say it will.
 */
const model = defineModel<string | string[] | undefined>()

const entries = computed(() =>
  (props.items ?? []).map(item => ({ ...item, value: item.value ?? item.label })),
)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)
const theme = computed(() => accordionTheme({ variant: props.variant }))

type Slot = keyof NonNullable<AccordionProps['ui']>

function slotClass(slot: Slot) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? override : theme.value[slot]({ class: override })
}
</script>

<template>
  <AccordionRoot
    v-model="model as any"
    :type="props.type"
    :collapsible="props.collapsible"
    :disabled="props.disabled"
    :class="isUnstyled ? [props.ui?.root, props.class] : theme.root({ class: [props.ui?.root, props.class] })"
  >
    <AccordionItem
      v-for="item in entries"
      :key="item.value"
      :value="item.value"
      :disabled="item.disabled"
      :class="slotClass('item')"
    >
      <AccordionHeader :class="slotClass('header')">
        <AccordionTrigger :class="slotClass('trigger')">
          <slot name="trigger" :item="item">
            <span class="flex min-w-0 items-center gap-2">
              <Icon v-if="item.icon" :icon="item.icon" class="size-4 shrink-0 text-muted-foreground" />
              <span class="truncate">{{ item.label }}</span>
            </span>
          </slot>
          <Icon :icon="ArrowDown01Icon" :class="slotClass('icon')" />
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent :class="slotClass('content')">
        <div :class="slotClass('contentInner')">
          <slot name="content" :item="item">
            {{ item.content }}
          </slot>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
