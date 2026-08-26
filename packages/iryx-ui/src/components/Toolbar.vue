<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { ToolbarButton, ToolbarLink, ToolbarRoot, ToolbarSeparator } from 'reka-ui'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { buttonTheme } from '../theme/button'
import { toolbarTheme } from '../theme/toolbar'
import Icon from './Icon.vue'

export interface ToolbarButtonOption {
  label: string
  icon?: IconLike
  /** Run when the control is pressed. Ignored on a link. */
  onSelect?: () => void
  /** Renders a link instead of a button. */
  href?: string
  disabled?: boolean
  /** Hide the label, leaving only the icon. The label becomes its name. */
  iconOnly?: boolean
  /** Overrides that name when the label is too terse to stand alone. */
  ariaLabel?: string
}

/** `'-'` renders a separator between groups of controls. */
export type ToolbarEntry = ToolbarButtonOption | '-'

export interface ToolbarProps {
  items?: ToolbarEntry[]
  orientation?: 'horizontal' | 'vertical'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Drop the container so the controls sit directly on the page. */
  bare?: boolean
  /** Wrap from the last control back to the first when arrowing past the end. */
  loop?: boolean
  /** Names the bar, e.g. "Formatting". A toolbar with no name is unlabelled chrome. */
  ariaLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ button: 'px-3' }`. */
  ui?: {
    root?: string
    button?: string
    separator?: string
  }
}

/**
 * A bar of controls that share one Tab stop, with arrow keys moving between
 * them. That is the whole point: a formatting bar of fifteen buttons should
 * not be fifteen stops on the way to the text below it.
 *
 * Entries cover buttons, links and separators. For anything else — a toggle
 * group, a select, a search field — use the default slot; `IToggleGroup`
 * brings its own arrow-key handling, so it nests inside without conflict.
 */
const props = withDefaults(defineProps<ToolbarProps>(), {
  size: 'sm',
  unstyled: undefined,
})

const entries = computed(() => props.items ?? [])

const isSeparator = (entry: ToolbarEntry): entry is '-' => entry === '-'

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => toolbarTheme({ orientation: props.orientation, bare: props.bare }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const separatorClass = computed(() =>
  isUnstyled.value ? props.ui?.separator : theme.value.separator({ class: props.ui?.separator }),
)

/**
 * Controls are `IButton`s in ghost form rather than a look invented here, so
 * a toolbar button and a button elsewhere cannot drift apart.
 */
function controlClass(entry: ToolbarButtonOption) {
  if (isUnstyled.value)
    return props.ui?.button
  return buttonTheme({
    variant: 'ghost',
    size: props.size,
    square: entry.iconOnly,
    class: props.ui?.button,
  })
}

/** An icon-only control has no text to name it, so the hidden label does the job. */
function nameFor(entry: ToolbarButtonOption) {
  return entry.ariaLabel ?? (entry.iconOnly ? entry.label : undefined)
}
</script>

<template>
  <ToolbarRoot
    :orientation="props.orientation"
    :loop="props.loop"
    :aria-label="props.ariaLabel"
    :class="rootClass"
  >
    <slot>
      <template v-for="(entry, index) in entries" :key="index">
        <ToolbarSeparator v-if="isSeparator(entry)" :class="separatorClass" />

        <ToolbarLink
          v-else-if="entry.href"
          :href="entry.href"
          :aria-label="nameFor(entry)"
          :class="controlClass(entry)"
        >
          <Icon
            v-if="entry.icon"
            :icon="entry.icon"
            :data-icon="entry.iconOnly ? undefined : 'inline-start'"
          />
          <span v-if="!entry.iconOnly">{{ entry.label }}</span>
        </ToolbarLink>

        <ToolbarButton
          v-else
          :disabled="entry.disabled"
          :aria-label="nameFor(entry)"
          :class="controlClass(entry)"
          @click="entry.onSelect?.()"
        >
          <Icon
            v-if="entry.icon"
            :icon="entry.icon"
            :data-icon="entry.iconOnly ? undefined : 'inline-start'"
          />
          <span v-if="!entry.iconOnly">{{ entry.label }}</span>
        </ToolbarButton>
      </template>
    </slot>
  </ToolbarRoot>
</template>
