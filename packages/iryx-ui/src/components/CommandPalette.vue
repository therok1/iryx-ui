<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { CommandEntry, CommandItem } from '../composables/command-palette'
import { Search01Icon } from '@hugeicons/core-free-icons'
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxRoot,
  useFilter,
  VisuallyHidden,
} from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { commandHaystack, matchesHotkey, toCommandGroups } from '../composables/command-palette'
import { useIryxUiConfig } from '../config'
import { commandPaletteTheme } from '../theme/command-palette'
import Icon from './Icon.vue'
import Kbd from './Kbd.vue'

export interface CommandPaletteProps {
  /** Commands, optionally grouped. An entry with `items` is a group. */
  items?: CommandEntry[]
  placeholder?: string
  /** Shown when the query matches nothing. Override for non-English apps. */
  emptyText?: string
  /** Accessible name for the dialog, since a palette has no visible title. */
  label?: string
  /**
   * Global shortcut that opens it. `mod` is Command on Apple platforms and
   * Control elsewhere. Pass `null` to bind nothing and drive `open` yourself.
   */
  hotkey?: string | null
  /** Close once a command is chosen. */
  closeOnSelect?: boolean
  /** Hint row along the bottom. Set `false` to drop it. */
  footer?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  ui?: Partial<Record<
    'overlay' | 'content' | 'header' | 'icon' | 'input' | 'viewport' | 'group'
    | 'groupLabel' | 'item' | 'itemIcon' | 'itemLabel' | 'shortcut' | 'key' | 'empty' | 'footer' | 'list',
    string
  >>
}

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  placeholder: 'Search commands…',
  emptyText: 'No matching commands.',
  label: 'Command palette',
  hotkey: 'mod+k',
  closeOnSelect: true,
  footer: true,
  unstyled: undefined,
})

const emit = defineEmits<{
  /** A command was chosen. Fires alongside the item's own `onSelect`. */
  select: [item: CommandItem]
}>()

const open = defineModel<boolean>('open', { default: false })

const query = ref('')

/*
 * The query is cleared on close rather than on open: clearing on open runs
 * while the panel is animating in, and the reader watches their previous
 * search disappear a frame after it becomes visible.
 */
watch(open, (value) => {
  if (!value)
    query.value = ''
})

const { contains } = useFilter({ sensitivity: 'base' })

const groups = computed(() => toCommandGroups(props.items))

/**
 * Groups with their surviving commands, and empty groups dropped — a heading
 * over nothing reads as a loading state.
 */
const results = computed(() => {
  const typed = query.value.trim()

  return groups.value
    .map(group => ({
      ...group,
      items: typed
        ? group.items.filter(item => contains(commandHaystack(item, group.label), typed))
        : group.items,
    }))
    .filter(group => group.items.length > 0)
})

const isEmpty = computed(() => results.value.length === 0)

/**
 * Reka needs a value per item, and a label is not reliably unique — two
 * groups can each hold "Settings". The index pair is.
 */
function valueOf(groupIndex: number, itemIndex: number): string {
  return `${groupIndex}:${itemIndex}`
}

function onSelect(item: CommandItem): void {
  if (item.disabled)
    return

  emit('select', item)
  item.onSelect?.()

  if (props.closeOnSelect)
    open.value = false
}

/*
 * The hotkey is bound on the window rather than on the palette, because the
 * palette does not exist in the DOM until it opens — a listener on it could
 * never be what opens it.
 */
function onKeydown(event: KeyboardEvent): void {
  if (!props.hotkey)
    return
  if (!matchesHotkey(event, props.hotkey))
    return

  // The browser's own binding for this chord loses to ours, deliberately:
  // an app that asks for `mod+k` means it.
  event.preventDefault()
  open.value = !open.value
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)
const theme = computed(() => commandPaletteTheme())

type Slot = keyof NonNullable<CommandPaletteProps['ui']>

/** Always a string: `IKbd` takes a plain `class`, and an array will not do. */
function slotClass(slot: Slot, extra?: ClassValue) {
  const override = props.ui?.[slot]
  return isUnstyled.value
    ? [override, extra].filter(Boolean).join(' ')
    : theme.value[slot]({ class: [override, extra] })
}

/** Shortcuts are written as spaced keys — `mod K`, `G then I`. */
function keysOf(shortcut: string): string[] {
  return shortcut.split(' ').filter(Boolean)
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="slotClass('overlay')" />
      <DialogContent
        :class="isUnstyled ? [props.ui?.content, props.class] : theme.content({ class: [props.ui?.content, props.class] })"
        :aria-label="props.label"
        :aria-describedby="undefined"
      >
        <!-- Reka requires a title for the accessible name; a palette shows none. -->
        <VisuallyHidden>
          <DialogTitle>{{ props.label }}</DialogTitle>
        </VisuallyHidden>

        <ListboxRoot highlight-on-hover :class="slotClass('list')">
          <div :class="slotClass('header')">
            <span :class="slotClass('icon')">
              <Icon :icon="Search01Icon" />
            </span>
            <ListboxFilter
              v-model="query"
              auto-focus
              :placeholder="props.placeholder"
              :class="slotClass('input')"
            />
          </div>

          <ListboxContent :class="slotClass('viewport')">
            <p v-if="isEmpty" :class="slotClass('empty')">
              <slot name="empty" :query="query">
                {{ props.emptyText }}
              </slot>
            </p>

            <ListboxGroup
              v-for="(group, groupIndex) in results"
              :key="group.label || groupIndex"
              :class="slotClass('group')"
            >
              <ListboxGroupLabel v-if="group.label" :class="slotClass('groupLabel')">
                {{ group.label }}
              </ListboxGroupLabel>

              <ListboxItem
                v-for="(item, itemIndex) in group.items"
                :key="valueOf(groupIndex, itemIndex)"
                :value="valueOf(groupIndex, itemIndex)"
                :disabled="item.disabled"
                :aria-disabled="item.disabled || undefined"
                :as="item.href ? 'a' : 'div'"
                :href="item.href"
                :class="slotClass('item')"
                @select="onSelect(item)"
              >
                <slot name="item" :item="item">
                  <span v-if="item.icon" :class="slotClass('itemIcon')">
                    <Icon :icon="item.icon" />
                  </span>
                  <span :class="slotClass('itemLabel')">{{ item.label }}</span>
                  <!--
                    Rendered by `IKbd` rather than inline, so a shortcut in the
                    palette and one shown anywhere else are the same chips —
                    including the platform glyph for `mod`.
                  -->
                  <Kbd
                    v-if="item.shortcut"
                    :keys="keysOf(item.shortcut)"
                    :class="slotClass('shortcut')"
                    :ui="{ key: props.ui?.key }"
                  />
                </slot>
              </ListboxItem>
            </ListboxGroup>
          </ListboxContent>
        </ListboxRoot>

        <div v-if="props.footer" :class="slotClass('footer')">
          <slot name="footer">
            <span><Kbd :keys="['up', 'down']" :ui="{ key: props.ui?.key }" /> to navigate</span>
            <span><Kbd keys="enter" :ui="{ key: props.ui?.key }" /> to select</span>
            <span><Kbd keys="escape" :ui="{ key: props.ui?.key }" /> to close</span>
          </slot>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
