<script setup lang="ts">
import type { ToastRecord } from '../composables/toast'
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-vue-next'
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'
import { computed } from 'vue'
import { useToast, useToastState } from '../composables/toast'
import { useIryxUiConfig } from '../config'
import { toastTheme } from '../theme/toast'

export interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  /** Default milliseconds before auto-dismiss; a toast's own `duration` wins. */
  duration?: number
  /** Accessible name for each dismiss button — override for non-English apps. */
  closeLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ viewport: 'sm:max-w-md' }`. */
  ui?: {
    viewport?: string
    root?: string
    icon?: string
    content?: string
    title?: string
    description?: string
    action?: string
    close?: string
  }
}

// `unstyled: undefined` is required: Vue casts absent boolean props to
// `false`, which would shadow the global config.
const props = withDefaults(defineProps<ToasterProps>(), {
  duration: 5000,
  closeLabel: 'Close',
  unstyled: undefined,
})

const toasts = useToastState()
const { dismiss } = useToast()

const defaultIcons = {
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
  info: Info,
} as const

function iconFor(toast: ToastRecord) {
  return toast.variant && toast.variant !== 'neutral' ? defaultIcons[toast.variant] : undefined
}

/** `0` means "stay until dismissed"; Reka expects Infinity for that. */
function durationFor(toast: ToastRecord) {
  const value = toast.duration ?? props.duration
  return value === 0 ? Number.POSITIVE_INFINITY : value
}

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

function themeFor(toast: ToastRecord) {
  return toastTheme({
    variant: toast.variant,
    position: props.position,
    withTitle: Boolean(toast.title),
  })
}

const viewportClass = computed(() => {
  const theme = toastTheme({ position: props.position })
  return isUnstyled.value
    ? [props.ui?.viewport, props.class]
    : theme.viewport({ class: [props.ui?.viewport, props.class] })
})

function slotClass(toast: ToastRecord, slot: keyof ReturnType<typeof toastTheme>) {
  const override = props.ui?.[slot as keyof NonNullable<ToasterProps['ui']>]
  return isUnstyled.value ? override : themeFor(toast)[slot]({ class: override })
}

function onAction(toast: ToastRecord) {
  toast.action?.onClick()
  dismiss(toast.id)
}
</script>

<template>
  <ToastProvider>
    <ToastRoot
      v-for="toast in toasts"
      :key="toast.id"
      :duration="durationFor(toast)"
      :class="slotClass(toast, 'root')"
      @update:open="(open: boolean) => !open && dismiss(toast.id)"
    >
      <div v-if="iconFor(toast)" :class="slotClass(toast, 'icon')">
        <component :is="iconFor(toast)" aria-hidden="true" />
      </div>

      <div :class="slotClass(toast, 'content')">
        <ToastTitle v-if="toast.title" :class="slotClass(toast, 'title')">
          {{ toast.title }}
        </ToastTitle>
        <ToastDescription v-if="toast.description" :class="slotClass(toast, 'description')">
          {{ toast.description }}
        </ToastDescription>
      </div>

      <ToastAction
        v-if="toast.action"
        :alt-text="toast.action.label"
        :class="slotClass(toast, 'action')"
        @click="onAction(toast)"
      >
        {{ toast.action.label }}
      </ToastAction>

      <ToastClose :aria-label="props.closeLabel" :class="slotClass(toast, 'close')">
        <X aria-hidden="true" />
      </ToastClose>
    </ToastRoot>

    <ToastPortal>
      <ToastViewport :class="viewportClass" />
    </ToastPortal>
  </ToastProvider>
</template>
