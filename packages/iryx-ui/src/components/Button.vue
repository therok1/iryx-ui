<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { useButtonGroup } from '../composables/button-group'
import { useIryxUiConfig } from '../config'
import { buttonTheme } from '../theme/button'

export interface ButtonProps {
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto the immediate child instead of rendering an element. */
  asChild?: boolean
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Stretch to the full width of the container. */
  block?: boolean
  /**
   * Square the button for icon-only use, dropping the horizontal padding.
   *
   * For an icon *beside* a label, mark the icon with
   * `data-icon="inline-start"` or `data-icon="inline-end"` instead — the
   * padding then tightens on that side.
   */
  square?: boolean
  /** Show a spinner (in the leading position) and disable interaction. */
  loading?: boolean
  disabled?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  type?: 'button' | 'submit' | 'reset'
  class?: string
}

// `unstyled: undefined` is required: Vue casts absent boolean props to
// `false`, which would shadow the global config.
const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  type: 'button',
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

// Inherit the size from an enclosing ButtonGroup; an explicit prop still wins.
const group = useButtonGroup()
const size = computed(() => props.size ?? group?.size.value)

const classes = computed(() => {
  if (isUnstyled.value)
    return props.class
  return buttonTheme({
    variant: props.variant,
    size: size.value,
    block: props.block,
    square: props.square,
    class: props.class,
  })
})
</script>

<template>
  <Primitive
    :as="props.as" :as-child="props.asChild" :type="props.as === 'button' ? props.type : undefined"
    :disabled="props.disabled || props.loading || undefined" :class="classes"
  >
    <!-- The spinner renders ahead of the slot, so it marks itself as leading. -->
    <LoaderCircle v-if="props.loading" data-icon="inline-start" class="animate-spin" aria-hidden="true" />
    <slot />
  </Primitive>
</template>
