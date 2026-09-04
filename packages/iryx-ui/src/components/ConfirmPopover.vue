<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { confirmPopoverTheme } from '../theme/confirm-popover'
import Button from './Button.vue'
import Popover from './Popover.vue'

export interface ConfirmPopoverProps {
  /** The question. */
  title?: string
  /** Secondary detail under the question. */
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Style the confirming button as destructive. */
  danger?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Render the little pointer against the trigger. */
  arrow?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ confirm: 'w-full' }`. */
  ui?: {
    content?: string
    title?: string
    description?: string
    actions?: string
    cancel?: string
    confirm?: string
  }
}

const props = withDefaults(defineProps<ConfirmPopoverProps>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  side: 'bottom',
  sideOffset: 6,
  arrow: true,
  unstyled: undefined,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const open = defineModel<boolean | undefined>('open', { default: undefined })

function confirm() {
  emit('confirm')
  open.value = false
}

function cancel() {
  emit('cancel')
  open.value = false
}

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => confirmPopoverTheme())

const descriptionClass = computed(() =>
  isUnstyled.value ? props.ui?.description : theme.value.description({ class: props.ui?.description }),
)
const actionsClass = computed(() =>
  isUnstyled.value ? props.ui?.actions : theme.value.actions({ class: props.ui?.actions }),
)
</script>

<template>
  <Popover
    v-model:open="open"
    :side="props.side"
    :align="props.align"
    :side-offset="props.sideOffset"
    :arrow="props.arrow"
    padding="sm"
    width="sm"
    :title="props.title"
    :unstyled="props.unstyled"
    :class="props.class"
    :ui="{ content: props.ui?.content, title: props.ui?.title }"
  >
    <template #trigger>
      <slot name="trigger" />
    </template>

    <p v-if="props.description || $slots.description" :class="descriptionClass">
      <slot name="description">
        {{ props.description }}
      </slot>
    </p>

    <div :class="actionsClass">
      <Button size="sm" variant="outline" :class="props.ui?.cancel" @click="cancel">
        {{ props.cancelLabel }}
      </Button>
      <Button
        size="sm"
        :class="[props.danger && 'bg-danger bg-none text-danger-foreground hover:brightness-110', props.ui?.confirm]"
        @click="confirm"
      >
        {{ props.confirmLabel }}
      </Button>
    </div>
  </Popover>
</template>
