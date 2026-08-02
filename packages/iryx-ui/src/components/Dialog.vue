<script setup lang="ts">
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { dialogTheme } from '../theme/dialog'

export interface DialogProps {
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Clicking the overlay or pressing Escape closes it. Set false to force a choice. */
  dismissible?: boolean
  /** Render the corner dismiss button. */
  showClose?: boolean
  /** Accessible name for the dismiss button — override for non-English apps. */
  closeLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  /** Override classes per slot, e.g. `{ content: 'max-w-3xl' }`. */
  ui?: {
    overlay?: string
    content?: string
    header?: string
    title?: string
    description?: string
    body?: string
    footer?: string
    close?: string
  }
}

// `undefined` defaults are required: Vue casts absent boolean props to
// `false`, which would shadow the global config.
const props = withDefaults(defineProps<DialogProps>(), {
  dismissible: true,
  showClose: true,
  closeLabel: 'Close',
  unstyled: undefined,
})

const open = defineModel<boolean>('open', { default: false })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => dialogTheme({ size: props.size }))

const overlayClass = computed(() =>
  isUnstyled.value ? props.ui?.overlay : theme.value.overlay({ class: props.ui?.overlay }),
)
const contentClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.content, props.class]
    : theme.value.content({ class: [props.ui?.content, props.class] }),
)
const headerClass = computed(() =>
  isUnstyled.value ? props.ui?.header : theme.value.header({ class: props.ui?.header }),
)
const titleClass = computed(() =>
  isUnstyled.value ? props.ui?.title : theme.value.title({ class: props.ui?.title }),
)
const descriptionClass = computed(() =>
  isUnstyled.value ? props.ui?.description : theme.value.description({ class: props.ui?.description }),
)
const bodyClass = computed(() =>
  isUnstyled.value ? props.ui?.body : theme.value.body({ class: props.ui?.body }),
)
const footerClass = computed(() =>
  isUnstyled.value ? props.ui?.footer : theme.value.footer({ class: props.ui?.footer }),
)
const closeClass = computed(() =>
  isUnstyled.value ? props.ui?.close : theme.value.close({ class: props.ui?.close }),
)

/** Blocking dialogs opt out of the outside-click and Escape dismissals. */
function onDismiss(event: Event) {
  if (!props.dismissible)
    event.preventDefault()
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay :class="overlayClass" />
      <DialogContent
        :class="contentClass"
        @escape-key-down="onDismiss"
        @pointer-down-outside="onDismiss"
        @interact-outside="onDismiss"
      >
        <div v-if="props.title || props.description || $slots.header" :class="headerClass">
          <slot name="header">
            <DialogTitle :class="titleClass">
              <slot name="title">
                {{ props.title }}
              </slot>
            </DialogTitle>
            <DialogDescription v-if="props.description || $slots.description" :class="descriptionClass">
              <slot name="description">
                {{ props.description }}
              </slot>
            </DialogDescription>
          </slot>
        </div>

        <!-- Reka requires a title for the accessible name; hide it when unused. -->
        <VisuallyHidden v-else>
          <DialogTitle>{{ props.closeLabel }}</DialogTitle>
        </VisuallyHidden>

        <div :class="bodyClass">
          <slot />
        </div>

        <div v-if="$slots.footer" :class="footerClass">
          <slot name="footer" :close="() => (open = false)" />
        </div>

        <DialogClose v-if="props.showClose" :aria-label="props.closeLabel" :class="closeClass">
          <X aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
