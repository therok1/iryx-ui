<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import {
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
  VisuallyHidden,
} from 'reka-ui'
import { computed, useSlots } from 'vue'
import { useIryxUiConfig } from '../config'
import { drawerTheme } from '../theme/drawer'
import Icon from './Icon.vue'

export type DrawerSide = 'right' | 'left' | 'top' | 'bottom'
/** Fractions of the panel (0–1), pixel numbers, or CSS lengths like `'20rem'`. */
export type DrawerSnapPoint = number | string

export interface DrawerProps {
  title?: string
  description?: string
  /** Which edge the panel is attached to. Also the direction you swipe to dismiss. */
  side?: DrawerSide
  /** Width for a left/right drawer, max height for a top/bottom sheet. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * Resting positions the panel snaps between, e.g. `[0.4, 1]` for a sheet
   * that opens part-way and can be dragged to full. Sizing is left to the
   * snap points when this is set — see the note in the setup below.
   */
  snapPoints?: DrawerSnapPoint[]
  /** Snap to the next point in order rather than the nearest by distance. */
  snapToSequentialPoints?: boolean
  /**
   * `true` traps focus and blocks the page behind it; `'trap-focus'` keeps the
   * page interactive while still trapping the Tab ring, which is what a
   * persistent side panel wants; `false` does neither.
   */
  modal?: boolean | 'trap-focus'
  /** Clicking the overlay, pressing Escape or swiping closes it. Set false to force a choice. */
  dismissible?: boolean
  /** Show the drag handle. Defaults on for top/bottom sheets, off for side drawers. */
  handle?: boolean
  /** Render the corner dismiss button. */
  showClose?: boolean
  /** Accessible name for the dismiss button — override for non-English apps. */
  closeLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ content: 'sm:max-w-3xl' }`. */
  ui?: {
    overlay?: string
    content?: string
    handle?: string
    header?: string
    title?: string
    description?: string
    body?: string
    footer?: string
    close?: string
  }
}

const props = withDefaults(defineProps<DrawerProps>(), {
  side: 'right',
  modal: true,
  dismissible: true,
  handle: undefined,
  showClose: true,
  closeLabel: 'Close',
  unstyled: undefined,
})

const open = defineModel<boolean>('open', { default: false })
const snapPoint = defineModel<DrawerSnapPoint | null>('snapPoint', { default: null })

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

/**
 * Reka names the direction you *swipe to dismiss*, which is the edge the panel
 * sits on — except that its vertical names are `up`/`down` rather than
 * `top`/`bottom`. Our prop keeps the CSS edge names, since that is what a
 * caller is thinking about when they place the panel.
 */
const swipeDirection = computed(
  () => (({ right: 'right', left: 'left', top: 'up', bottom: 'down' }) as const)[props.side],
)

/** Side drawers have no natural affordance to hint at; sheets do. */
const showHandle = computed(() => props.handle ?? (props.side === 'top' || props.side === 'bottom'))

const theme = computed(() => drawerTheme({ side: props.side, size: props.size }))

/**
 * Snap points position the panel by translating it, so the panel itself has to
 * be tall enough to translate *out of* — a `size` cap would clip the fully
 * expanded state instead of hiding it below the fold. `class` is merged last,
 * so this beats the size variant rather than fighting it.
 */
const snapSizing = computed(() => (props.snapPoints?.length ? 'max-h-dvh' : undefined))

const overlayClass = computed(() =>
  isUnstyled.value ? props.ui?.overlay : theme.value.overlay({ class: props.ui?.overlay }),
)
const contentClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.content, props.class]
    : theme.value.content({ class: [snapSizing.value, props.ui?.content, props.class] }),
)
const handleClass = computed(() =>
  isUnstyled.value ? props.ui?.handle : theme.value.handle({ class: props.ui?.handle }),
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

const slots = useSlots()

/**
 * Reka binds `aria-describedby` to a generated id whether or not a
 * `DrawerDescription` was rendered, leaving a dangling reference on every
 * drawer without one. Binding `undefined` through `$attrs` overrides it and
 * Vue drops the attribute; with a description we bind nothing, so the id
 * survives. Same fix as `Dialog.vue` — see the long note there.
 */
const describedByAttrs = computed(() =>
  props.description || slots.description ? {} : { 'aria-describedby': undefined },
)

/**
 * Blocking drawers opt out of every dismissal Reka offers — overlay press,
 * Escape *and* swipe. The guard sits on the state change rather than on the
 * individual events, so a dismissal route added upstream is refused by
 * default instead of silently working. Explicit closes set `open` directly
 * and are unaffected.
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
  <DrawerRoot
    :open="open"
    :modal="props.modal"
    :swipe-direction="swipeDirection"
    :snap-points="props.snapPoints"
    :snap-point="snapPoint"
    :snap-to-sequential-points="props.snapToSequentialPoints"
    @update:open="onOpenChange"
    @update:snap-point="snapPoint = $event"
  >
    <DrawerTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay :class="overlayClass" />
      <DrawerContent :class="contentClass" v-bind="describedByAttrs">
        <DrawerHandle v-if="showHandle" :class="handleClass" />

        <div v-if="props.title || props.description || $slots.header" :class="headerClass">
          <slot name="header">
            <DrawerTitle :class="titleClass">
              <slot name="title">
                {{ props.title }}
              </slot>
            </DrawerTitle>
            <DrawerDescription v-if="props.description || $slots.description" :class="descriptionClass">
              <slot name="description">
                {{ props.description }}
              </slot>
            </DrawerDescription>
          </slot>
        </div>

        <!-- Reka requires a title for the accessible name; hide it when unused. -->
        <VisuallyHidden v-else>
          <DrawerTitle>{{ props.closeLabel }}</DrawerTitle>
        </VisuallyHidden>

        <!-- The viewport is what tells Reka which region scrolls, so a drag
             that starts on scrolled content pans it instead of dismissing. -->
        <DrawerViewport :class="bodyClass">
          <slot />
        </DrawerViewport>

        <div v-if="$slots.footer" :class="footerClass">
          <slot name="footer" :close="close" />
        </div>

        <!-- A plain button, not DrawerClose: this must close even when the
             drawer is not dismissible. -->
        <button
          v-if="props.showClose"
          type="button"
          :aria-label="props.closeLabel"
          :class="closeClass"
          @click="close"
        >
          <Icon :icon="Cancel01Icon" />
        </button>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
