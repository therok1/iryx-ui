<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { collapsibleTheme } from '../theme/collapsible'
import Icon from './Icon.vue'

export interface CollapsibleProps {
  /** Label on the trigger. Ignored when the `trigger` slot is used. */
  label?: string
  /** Starting state when you are not controlling it. */
  defaultOpen?: boolean
  disabled?: boolean
  /** Which side of the trigger the chevron sits on. */
  iconPosition?: 'start' | 'end'
  /** Drop the chevron entirely — for a trigger that says "open" some other way. */
  hideIcon?: boolean
  /**
   * Remove the content from the DOM while closed rather than hiding it.
   * Costs the open animation, so reach for it only when the content is
   * expensive or must not be found by in-page search while shut.
   */
  unmountOnHide?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ content: 'pt-2' }`. */
  ui?: {
    root?: string
    trigger?: string
    content?: string
    icon?: string
  }
}

/** One region, with no siblings to coordinate with — see `IAccordion` for a list. */
const props = withDefaults(defineProps<CollapsibleProps>(), {
  unstyled: undefined,
})

const open = defineModel<boolean>('open', { default: undefined })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => collapsibleTheme({ iconPosition: props.iconPosition }))

function slotClass(name: keyof NonNullable<CollapsibleProps['ui']>, extra?: ClassValue) {
  const override = [props.ui?.[name], extra].filter(Boolean).join(' ')
  return isUnstyled.value ? override : theme.value[name]({ class: override })
}
</script>

<template>
  <CollapsibleRoot
    v-slot="{ open: isOpen }"
    v-model:open="open"
    :default-open="props.defaultOpen"
    :disabled="props.disabled"
    :unmount-on-hide="props.unmountOnHide"
    :class="slotClass('root', props.class)"
  >
    <CollapsibleTrigger :class="slotClass('trigger')">
      <slot name="trigger" :open="isOpen">
        {{ props.label }}
      </slot>
      <!-- Rotated rather than swapped, so both states are one control. -->
      <Icon
        v-if="!props.hideIcon"
        :icon="ArrowDown01Icon"
        :class="slotClass('icon', isOpen ? 'rotate-180' : undefined)"
      />
    </CollapsibleTrigger>

    <CollapsibleContent :class="slotClass('content')">
      <slot :open="isOpen" />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
