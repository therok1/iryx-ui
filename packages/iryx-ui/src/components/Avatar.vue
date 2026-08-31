<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { avatarTheme } from '../theme/avatar'

export interface AvatarProps {
  src?: string
  /**
   * Describes the image. Leave it empty when the avatar sits beside the same
   * person's name — repeating it makes a screen reader say it twice.
   */
  alt?: string
  /**
   * Who this is. Used to derive initials when there is no image, and as the
   * accessible name when nothing else provides one.
   */
  name?: string
  /** Overrides the derived initials. */
  initials?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Circle for a person, square for a company or a project. */
  shape?: 'circle' | 'square'
  /** Presence dot in the corner. */
  status?: 'online' | 'busy' | 'away' | 'offline'
  /** Names that dot, since a colour alone says nothing to a screen reader. */
  statusLabel?: string
  /**
   * Hold the fallback back by this many milliseconds, so a fast connection
   * goes straight to the image instead of flashing initials on the way.
   */
  delayMs?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ fallback: 'bg-primary' }`. */
  ui?: {
    root?: string
    image?: string
    fallback?: string
    status?: string
  }
}

const props = withDefaults(defineProps<AvatarProps>(), {
  unstyled: undefined,
})

/**
 * First letters of the first and last words — "Ana Ruiz" becomes AR, and a
 * single name gives one letter. Anything longer is unreadable at 24px.
 */
const derivedInitials = computed(() => {
  if (props.initials)
    return props.initials
  const words = (props.name ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0)
    return ''
  if (words.length === 1)
    return words[0]!.slice(0, 1)
  return `${words[0]!.slice(0, 1)}${words.at(-1)!.slice(0, 1)}`
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  avatarTheme({ size: props.size, shape: props.shape, status: props.status }),
)

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const imageClass = computed(() =>
  isUnstyled.value ? props.ui?.image : theme.value.image({ class: props.ui?.image }),
)
const fallbackClass = computed(() =>
  isUnstyled.value ? props.ui?.fallback : theme.value.fallback({ class: props.ui?.fallback }),
)
const statusClass = computed(() =>
  isUnstyled.value ? props.ui?.status : theme.value.status({ class: props.ui?.status }),
)
</script>

<template>
  <AvatarRoot :class="rootClass">
    <AvatarImage v-if="props.src" :src="props.src" :alt="props.alt ?? ''" :class="imageClass" />

    <!--
      Reka swaps this in when there is no `src`, or when the image fails or is
      still loading past `delayMs`. It is the normal state for most people,
      not an error state.
    -->
    <AvatarFallback :delay-ms="props.delayMs" :class="fallbackClass">
      <slot name="fallback">
        {{ derivedInitials }}
      </slot>
    </AvatarFallback>

    <!--
      A colour alone carries no meaning, so the dot is given `role="img"` and
      a name — that combination is what makes an `aria-label` on a plain span
      reliable. `title` adds the same text as a hover tooltip for everyone.
    -->
    <span
      v-if="props.status"
      :class="statusClass"
      :title="props.statusLabel ?? props.status"
      role="img"
      :aria-label="props.statusLabel ?? props.status"
    />
  </AvatarRoot>
</template>
