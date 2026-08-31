<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useIryxUiConfig } from '../config'
import { dialogTheme } from '../theme/dialog'
import Icon from './Icon.vue'

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
  class?: ClassValue
  /** Override classes per element, e.g. `{ content: 'max-w-3xl' }`. */
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

const slots = useSlots()

/**
 * Reka renders `aria-describedby` unconditionally, pointing at an id that only
 * exists when a `DialogDescription` was rendered — so every dialog without one
 * warns about a dangling reference. Its message suggests
 * `aria-describedby="undefined"`, but that is React phrasing where `undefined`
 * omits the attribute; the check here is for the attribute's *presence*, so
 * the literal string is no better than the id. It has to be removed.
 *
 * Binding `undefined` through `$attrs` overrides Reka's own value and Vue
 * drops the attribute. With a description we bind nothing, so Reka's id
 * survives and the dialog stays properly described.
 */
const describedByAttrs = computed(() =>
  props.description || slots.description ? {} : { 'aria-describedby': undefined },
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

/**
 * Blocking dialogs opt out of the outside-click and Escape dismissals.
 *
 * The state is controlled rather than left to Reka: preventing the
 * `escapeKeyDown` / `interactOutside` events alone did not reliably stop the
 * close, so the guard lives on the state change itself. Explicit closes (the
 * corner button, the `close` slot prop) set `open` directly and are unaffected.
 */
function onOpenChange(value: boolean) {
  if (!value && !props.dismissible)
    return
  open.value = value
}

function close() {
  open.value = false
}
</script>

<template>
  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay :class="overlayClass" />
      <DialogContent :class="contentClass" v-bind="describedByAttrs">
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
          <slot name="footer" :close="close" />
        </div>

        <!-- A plain button, not DialogClose: this must close even when the
             dialog is not dismissible. -->
        <button
          v-if="props.showClose"
          type="button"
          :aria-label="props.closeLabel"
          :class="closeClass"
          @click="close"
        >
          <Icon :icon="Cancel01Icon" />
        </button>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
