<script setup lang="ts">
import type { IconArray } from '@hugeicons/vue'
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { computed } from 'vue'
import { isIconArray } from '../composables/icon'

export interface IconProps {
  icon?: IconLike
  /**
   * Names the icon for assistive technology. Icons are decorative by default
   * and hidden; set this only when the icon is the sole carrier of meaning,
   * such as inside a control with no visible text.
   */
  label?: string
  class?: ClassValue
}

const props = defineProps<IconProps>()

const asArray = computed(() => (props.icon && isIconArray(props.icon) ? props.icon as IconArray : undefined))

const a11y = computed(() => (props.label
  ? { 'role': 'img', 'aria-label': props.label }
  : { 'aria-hidden': true }))

function kebab(attrs: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs))
    out[key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()] = value
  return out
}

/**
 * Hugeicons ships icons as `[tag, attrs]` data, and `<HugeiconsIcon>` renders
 * them — but its precompiled render marks `width`/`height` as dynamic props on
 * the `<svg>`, so Vue patches them as DOM properties. Both are read-only
 * `SVGAnimatedLength` getters, which logged two warnings per icon on every
 * hydration. Rendering the same SVG here sets them as attributes instead.
 */
</script>

<template>
  <svg
    v-if="asArray"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    color="currentColor"
    :class="props.class"
    v-bind="a11y"
  >
    <component
      :is="part[0]"
      v-for="(part, index) in asArray"
      :key="index"
      v-bind="kebab(part[1])"
    />
  </svg>
  <component
    :is="props.icon"
    v-else-if="props.icon"
    :class="props.class"
    v-bind="a11y"
  />
</template>
