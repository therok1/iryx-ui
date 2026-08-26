<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { computed } from 'vue'
import { parseHotkey, useApplePlatform } from '../composables/kbd'
import { useIryxUiConfig } from '../config'
import { kbdTheme } from '../theme/kbd'

export interface KbdProps {
  /**
   * The shortcut — `'mod+k'`, or `['mod', 'k']`. `mod` is Command on Apple
   * platforms and Control everywhere else, which is the whole point: the
   * same muscle memory, a different glyph.
   *
   * Written the same way `matchesHotkey` reads it, so the shortcut you bind
   * and the shortcut you show cannot drift apart.
   */
  keys?: string | string[]
  size?: 'xs' | 'sm' | 'md'
  /** Draw a `+` between the chips instead of a plain gap. */
  joined?: boolean
  /**
   * Overrides the spoken name. The default spells the combination out —
   * "Command K" — because the glyphs announce as nothing useful on their own.
   */
  ariaLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ key: 'bg-background' }`. */
  ui?: {
    root?: string
    key?: string
    separator?: string
  }
}

/** Display only: shows what to press, binds nothing. */
const props = withDefaults(defineProps<KbdProps>(), {
  keys: () => [],
  unstyled: undefined,
})

const isApple = useApplePlatform()

const parsed = computed(() => parseHotkey(props.keys, isApple.value))

/**
 * "⌘ K" reaches a screen reader as roughly nothing, so the whole chip group
 * is labelled with the spoken form and its contents hidden.
 */
const spoken = computed(() => props.ariaLabel ?? parsed.value.map(key => key.spoken).join(' '))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => kbdTheme({ size: props.size }))

function slotClass(name: keyof NonNullable<KbdProps['ui']>, extra?: ClassValue) {
  const override = [props.ui?.[name], extra].filter(Boolean).join(' ')
  return isUnstyled.value ? override : theme.value[name]({ class: override })
}
</script>

<template>
  <span :class="slotClass('root', props.class)" role="img" :aria-label="spoken">
    <template v-for="(key, index) in parsed" :key="index">
      <span v-if="props.joined && index > 0" :class="slotClass('separator')" aria-hidden="true">+</span>
      <kbd :class="slotClass('key')" aria-hidden="true">
        <slot name="key" :item="key">{{ key.symbol }}</slot>
      </kbd>
    </template>
  </span>
</template>
