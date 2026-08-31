<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import {
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperRoot,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { stepperTheme } from '../theme/stepper'
import Icon from './Icon.vue'

export interface StepperItemOption {
  title: string
  description?: string
  disabled?: boolean
}

export interface StepperProps {
  items?: (StepperItemOption | string)[]
  orientation?: 'horizontal' | 'vertical'
  /**
   * Require steps to be completed in order.
   *
   * Off by default, because when on, a later step cannot be reached until the
   * ones before it are marked complete — which makes plain `v-model`
   * increments silently do nothing. Turn it on only if you are driving
   * navigation through the stepper's own triggers.
   */
  linear?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ indicator: 'size-10' }`. */
  ui?: {
    root?: string
    item?: string
    trigger?: string
    indicator?: string
    content?: string
    title?: string
    description?: string
    separator?: string
  }
}

const props = withDefaults(defineProps<StepperProps>(), {
  linear: false,
  unstyled: undefined,
})

/** Steps are 1-indexed, matching how they read to a user. */
const step = defineModel<number>({ default: 1 })

const options = computed<StepperItemOption[]>(() =>
  (props.items ?? []).map(item => (typeof item === 'string' ? { title: item } : item)),
)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => stepperTheme({ orientation: props.orientation }))

function slotClass(slot: 'root' | 'item' | 'trigger' | 'indicator' | 'content' | 'title' | 'description' | 'separator') {
  const override = props.ui?.[slot]
  return isUnstyled.value ? override : theme.value[slot]({ class: override })
}

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
</script>

<template>
  <StepperRoot
    v-model="step"
    :orientation="props.orientation"
    :linear="props.linear"
    :class="rootClass"
  >
    <StepperItem
      v-for="(item, index) in options"
      :key="index"
      :step="index + 1"
      :disabled="item.disabled"
      :class="slotClass('item')"
    >
      <StepperTrigger :class="slotClass('trigger')">
        <StepperIndicator :class="slotClass('indicator')">
          <slot name="indicator" :step="index + 1" :item="item">
            <Icon v-if="index + 1 < step" :icon="Tick02Icon" />
            <template v-else>
              {{ index + 1 }}
            </template>
          </slot>
        </StepperIndicator>

        <span :class="slotClass('content')">
          <StepperTitle :class="slotClass('title')">
            {{ item.title }}
          </StepperTitle>
          <StepperDescription v-if="item.description" :class="slotClass('description')">
            {{ item.description }}
          </StepperDescription>
        </span>
      </StepperTrigger>

      <StepperSeparator
        v-if="index < options.length - 1"
        :class="slotClass('separator')"
      />
    </StepperItem>
  </StepperRoot>
</template>
