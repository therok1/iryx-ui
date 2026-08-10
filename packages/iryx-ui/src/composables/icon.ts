import type { IconArray } from '@hugeicons/vue'
import type { Component } from 'vue'

/**
 * Anything that can be rendered as an icon.
 *
 * Hugeicons ships icons as data arrays rather than components, so both forms
 * are accepted: pass a Hugeicons export, or any component that renders an SVG.
 */
export type IconLike = Component | IconArray

export function isIconArray(icon: IconLike): icon is IconArray {
  return Array.isArray(icon)
}
