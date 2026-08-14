<script setup lang="ts">
import type { AcceptableValue, ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  ComboboxVirtualizer,
  useFilter,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed, ref, watchEffect } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { comboboxTheme } from '../theme/combobox'
import Icon from './Icon.vue'

export interface ComboboxItemOption {
  label: string
  value: string
  disabled?: boolean
}

/** A labelled run of options. Reka hides the whole group once nothing in it matches. */
export interface ComboboxItemGroup {
  label: string
  items: (ComboboxItemOption | string)[]
}

export type ComboboxItems = (ComboboxItemOption | ComboboxItemGroup | string)[]

export interface ComboboxProps extends ComboboxRootProps {
  /**
   * Options to render. Strings are expanded to `{ label, value }`, and an
   * entry with its own `items` becomes a labelled group.
   */
  items?: ComboboxItems
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  /** Mark the field as invalid — styles the border and ring red. */
  invalid?: boolean
  id?: string
  /** Shown when the query matches nothing. Override for non-English apps. */
  emptyText?: string
  /**
   * Offer a "create" row when the query matches no option's label, for
   * adding a client or item without leaving the field. Selecting it emits
   * `create` with the query — the value is *not* set, since the option
   * doesn't exist yet; add it to `items` and set the model yourself.
   */
  create?: boolean
  /** Label for that row. Receives the current query. */
  createLabel?: (query: string) => string
  /**
   * Render only the rows in view. Worth it in the thousands, not the hundreds.
   * Groups are flattened — Reka's virtualizer is a flat window — so `virtual`
   * and grouped `items` are mutually exclusive.
   */
  virtual?: boolean
  /** Row height in px, used to size the scrollbar before rows are measured. */
  estimateSize?: number
  /** Rows rendered beyond the viewport on each side. */
  overscan?: number
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: string
  ui?: {
    anchor?: string
    input?: string
    trigger?: string
    content?: string
    viewport?: string
    item?: string
    empty?: string
    group?: string
    groupLabel?: string
  }
}

const props = withDefaults(defineProps<ComboboxProps>(), {
  emptyText: 'No results found.',
  createLabel: (query: string) => `Create "${query}"`,
  estimateSize: 32,
  overscan: 12,
  virtual: undefined,
  // Vue casts absent boolean props to `false`, which would make `props.open`
  // pin the popup shut and `props.invalid ?? field.invalid` never inherit.
  open: undefined,
  defaultOpen: undefined,
  invalid: undefined,
  disabled: undefined,
  create: undefined,
  unstyled: undefined,
})

const emits = defineEmits<ComboboxRootEmits & {
  /** The "create" row was chosen. Carries the current query, trimmed. */
  create: [query: string]
}>()

/**
 * `open` is deliberately *not* controlled here. Reka's trigger toggles with
 * `!open` read from the prop, which a parent-owned ref only updates on the
 * next render — so two handlers in one gesture (the outside-click dismissal
 * and the trigger's own toggle) both read stale state and the second flips the
 * popup back open, leaving it up with the field unfocused. Virtualizing
 * thousands of rows slows that render enough to land in the window, which is
 * why it showed up there first. Uncontrolled, Reka mutates its own ref
 * synchronously and the race cannot happen.
 *
 * Opening is on click, never on focus: dismissing restores focus to the input,
 * and `open-on-focus` would reopen on that. It would also pop every combobox
 * open as you tabbed through a form.
 */
const rootProps = computed(() => {
  const {
    items: _items,
    placeholder: _placeholder,
    size: _size,
    invalid: _invalid,
    id: _id,
    emptyText: _emptyText,
    create: _create,
    createLabel: _createLabel,
    virtual: _virtual,
    estimateSize: _estimateSize,
    overscan: _overscan,
    unstyled: _unstyled,
    class: _class,
    ui: _ui,
    ...rest
  } = props
  return rest
})
const forwarded = useForwardPropsEmits(rootProps, emits)

function toOption(item: ComboboxItemOption | string): ComboboxItemOption {
  return typeof item === 'string' ? { label: item, value: item } : item
}

function isGroup(item: ComboboxItemOption | ComboboxItemGroup | string): item is ComboboxItemGroup {
  return typeof item !== 'string' && 'items' in item
}

/** The `items` prop as groups, or `undefined` when it's a flat list. */
const groups = computed<ComboboxItemGroup[] | undefined>(() => {
  const items = props.items ?? []
  return items.some(isGroup)
    ? items.map(item => (isGroup(item) ? item : { label: '', items: [item] }))
    : undefined
})

/** Every option, groups flattened — what the virtualizer and `displayValue` read. */
const options = computed<ComboboxItemOption[]>(() =>
  (props.items ?? []).flatMap(item => (isGroup(item) ? item.items.map(toOption) : [toOption(item)])),
)

const isVirtual = computed(() => Boolean(props.virtual))

if (import.meta.env?.DEV) {
  watchEffect(() => {
    if (isVirtual.value && groups.value)
      console.warn('[iryx-ui] ICombobox: `virtual` renders a flat window, so grouped `items` are flattened and their labels dropped. Drop one or the other.')
  })
}

/** The input's text. Starts out as the selected option's label, not a query. */
const query = ref('')

/**
 * What the user actually typed, which is *not* the same as the input's text:
 * while idle the input shows the selected label, so keying off `query` alone
 * filters a virtual list down to the already-selected row. Reka draws the same
 * distinction internally (`isUserInputted`); this mirrors it for the parts
 * that are ours — the virtual filter and the create row.
 */
const typed = ref('')

function onInput(event: Event): void {
  typed.value = (event.target as HTMLInputElement).value
}

/**
 * Reka's own filtering is disabled while virtualized — `ComboboxVirtualizer`
 * sets `isVirtual`, which short-circuits the root's filter state (and with it
 * `ComboboxEmpty`). So virtual mode filters here instead, with Reka's own
 * collator so matching stays case- and accent-insensitive either way.
 */
const { contains } = useFilter({ sensitivity: 'base' })

const virtualOptions = computed(() => {
  const trimmed = typed.value.trim()
  if (!trimmed)
    return options.value
  return options.value.filter(option => contains(option.label, trimmed))
})

/** What the closed field shows: the selected option's label, not its value. */
function displayValue(value: AcceptableValue | AcceptableValue[]): string {
  const labelOf = (v: AcceptableValue) => options.value.find(option => option.value === v)?.label ?? String(v ?? '')
  if (Array.isArray(value))
    return value.map(labelOf).join(', ')
  return value == null || value === '' ? '' : labelOf(value)
}

/**
 * The input keeps showing the selected option's label, and Reka treats
 * whatever is in it as the query — so the first keystroke would otherwise land
 * *inside* that label, searching for `AcmVertex Groupe Industries`.
 *
 * Selecting the text makes typing replace it. The select is deferred a frame
 * because `focus` fires before `mouseup`, and a click's own caret placement
 * would undo an immediate `select()`.
 */
function onInputFocus(event: FocusEvent): void {
  const input = event.target as HTMLInputElement
  requestAnimationFrame(() => {
    // Focus may have moved on again by the time this runs.
    if (document.activeElement === input)
      input.select()
  })
  typed.value = ''
}

const showCreate = computed(() => {
  const trimmed = typed.value.trim()
  return Boolean(props.create) && trimmed.length > 0
    && !options.value.some(option => option.label.toLowerCase() === trimmed.toLowerCase())
})

function onCreate(event: Event): void {
  // Keep Reka from selecting the query string as if it were a real value.
  event.preventDefault()
  emits('create', typed.value.trim())
  // The query is left alone: Reka repaints the input from `displayValue` when
  // the caller sets the model, and clearing it here would blank the field
  // instead, dropping it back to the placeholder.
  //
  // Closing goes through Escape rather than an `open` prop: a prevented select
  // gives Reka nothing to close on, and owning `open` just to close this one
  // row reintroduces the stale-prop race described above. The layer's own
  // dismissal also restores focus the way every other close does.
  event.target?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
}

const field = useFormField()
const inputId = computed(() => props.id ?? field?.id.value)
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() =>
  comboboxTheme({
    size: props.size,
    invalid: isInvalid.value,
    disabled: props.disabled,
  }),
)

type Slot = 'anchor' | 'input' | 'trigger' | 'content' | 'viewport' | 'item' | 'empty' | 'group' | 'groupLabel'

function slotClass(slot: Slot, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}

const itemIndicatorClass = computed(() => (isUnstyled.value ? undefined : theme.value.itemIndicator()))
</script>

<template>
  <!--
    `display: contents` is load-bearing, not cosmetic. ComboboxRoot renders a
    block div, so it stretches to its parent's width while the field inside is
    usually narrower — leaving an invisible strip beside the field that still
    counts as *inside* the combobox. Clicking there dismissed nothing and left
    the popup open with the field unfocused. Generating no box removes the
    strip; the anchor becomes the layout box and the popper still measures it.
  -->
  <ComboboxRoot v-bind="forwarded" open-on-click class="contents">
    <ComboboxAnchor :class="slotClass('anchor', props.class)">
      <ComboboxInput
        :id="inputId"
        v-model="query"
        :placeholder="props.placeholder"
        :display-value="displayValue"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="field?.describedBy.value"
        :class="slotClass('input')"
        @focus="onInputFocus"
        @input="onInput"
      />
      <ComboboxTrigger :class="slotClass('trigger')">
        <Icon :icon="ArrowDown01Icon" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent :class="slotClass('content')" position="popper" :side-offset="4">
        <ComboboxViewport :class="slotClass('viewport')">
          <!--
            ComboboxEmpty reads the root's filter count, which virtual mode
            short-circuits, so the windowed branch decides for itself.
          -->
          <div
            v-if="isVirtual"
            v-show="!showCreate && virtualOptions.length === 0"
            :class="slotClass('empty')"
          >
            <slot name="empty" :query="typed">
              {{ props.emptyText }}
            </slot>
          </div>
          <ComboboxEmpty v-else-if="!showCreate" :class="slotClass('empty')">
            <slot name="empty" :query="typed">
              {{ props.emptyText }}
            </slot>
          </ComboboxEmpty>

          <slot>
            <ComboboxVirtualizer
              v-if="isVirtual"
              v-slot="{ option }"
              :options="virtualOptions"
              :estimate-size="props.estimateSize"
              :overscan="props.overscan"
              :text-content="(option: ComboboxItemOption) => option.label"
            >
              <ComboboxItem
                :value="option.value"
                :text-value="option.label"
                :disabled="option.disabled"
                :class="slotClass('item')"
              >
                <ComboboxItemIndicator :class="itemIndicatorClass">
                  <Icon :icon="Tick02Icon" />
                </ComboboxItemIndicator>
                {{ option.label }}
              </ComboboxItem>
            </ComboboxVirtualizer>

            <template v-else-if="groups">
              <ComboboxGroup
                v-for="(group, index) in groups"
                :key="group.label || index"
                :class="slotClass('group')"
              >
                <ComboboxLabel v-if="group.label" :class="slotClass('groupLabel')">
                  {{ group.label }}
                </ComboboxLabel>
                <ComboboxItem
                  v-for="item in group.items"
                  :key="typeof item === 'string' ? item : item.value"
                  :value="typeof item === 'string' ? item : item.value"
                  :text-value="typeof item === 'string' ? item : item.label"
                  :disabled="typeof item === 'string' ? undefined : item.disabled"
                  :class="slotClass('item')"
                >
                  <ComboboxItemIndicator :class="itemIndicatorClass">
                    <Icon :icon="Tick02Icon" />
                  </ComboboxItemIndicator>
                  {{ typeof item === 'string' ? item : item.label }}
                </ComboboxItem>
              </ComboboxGroup>
            </template>

            <ComboboxItem
              v-for="option in options"
              v-else
              :key="option.value"
              :value="option.value"
              :text-value="option.label"
              :disabled="option.disabled"
              :class="slotClass('item')"
            >
              <ComboboxItemIndicator :class="itemIndicatorClass">
                <Icon :icon="Tick02Icon" />
              </ComboboxItemIndicator>
              {{ option.label }}
            </ComboboxItem>
          </slot>

          <!--
            Keyed on the query so it remounts as you type: Reka registers an
            item's filter text once, on mount, so a create row mounted at "D"
            would filter *itself* out as soon as the query grew to "Delta".
          -->
          <ComboboxItem
            v-if="showCreate"
            :key="typed"
            :value="typed"
            data-create
            :text-value="typed"
            :class="slotClass('item')"
            @select="onCreate"
          >
            <slot name="create" :query="typed">
              {{ props.createLabel(typed.trim()) }}
            </slot>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
