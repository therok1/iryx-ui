<script setup lang="ts">
import type { AcceptableValue, ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed, ref } from 'vue'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { comboboxTheme } from '../theme/combobox'
import Icon from './Icon.vue'

export interface ComboboxItemOption {
  label: string
  value: string
  disabled?: boolean
}

export interface ComboboxProps extends Omit<ComboboxRootProps, 'open' | 'defaultOpen'> {
  /** Options to render. Strings are expanded to `{ label, value }`. */
  items?: (ComboboxItemOption | string)[]
  /** The controlled open state. Can be bound with `v-model:open`. */
  open?: boolean
  /** Open state on first render, when you don't need to control it. */
  defaultOpen?: boolean
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
  }
}

const props = withDefaults(defineProps<ComboboxProps>(), {
  emptyText: 'No results found.',
  createLabel: (query: string) => `Create "${query}"`,
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
 * `open` is managed here rather than forwarded, because choosing the create
 * row has to close the popup itself — its select event is prevented, so Reka
 * never sees a selection to close on.
 */
const uncontrolledOpen = ref(props.defaultOpen ?? false)
const isOpen = computed(() => props.open ?? uncontrolledOpen.value)

function setOpen(value: boolean): void {
  uncontrolledOpen.value = value
  emits('update:open', value)
}

const rootProps = computed(() => {
  const {
    items: _items,
    open: _open,
    defaultOpen: _defaultOpen,
    placeholder: _placeholder,
    size: _size,
    invalid: _invalid,
    id: _id,
    emptyText: _emptyText,
    create: _create,
    createLabel: _createLabel,
    unstyled: _unstyled,
    class: _class,
    ui: _ui,
    ...rest
  } = props
  return rest
})
const forwarded = useForwardPropsEmits(rootProps, emits)

const options = computed<ComboboxItemOption[]>(() =>
  (props.items ?? []).map(item => (typeof item === 'string' ? { label: item, value: item } : item)),
)

/** The typed query. Reka filters the items against it on its own. */
const query = ref('')

/** What the closed field shows: the selected option's label, not its value. */
function displayValue(value: AcceptableValue | AcceptableValue[]): string {
  const labelOf = (v: AcceptableValue) => options.value.find(option => option.value === v)?.label ?? String(v ?? '')
  if (Array.isArray(value))
    return value.map(labelOf).join(', ')
  return value == null || value === '' ? '' : labelOf(value)
}

/**
 * The input shows the selected option's label while idle, and Reka treats
 * whatever is in it as the query. Without selecting that text on focus, the
 * first keystroke appends to the label — searching for `Acme Industriescir` and
 * matching nothing. Selecting it means typing replaces, and leaving without
 * typing still restores the label (`resetSearchTermOnBlur`).
 */
function onInputFocus(event: FocusEvent): void {
  (event.target as HTMLInputElement).select()
}

const showCreate = computed(() => {
  const trimmed = query.value.trim()
  return Boolean(props.create) && trimmed.length > 0
    && !options.value.some(option => option.label.toLowerCase() === trimmed.toLowerCase())
})

function onCreate(event: Event): void {
  // Keep Reka from selecting the query string as if it were a real value.
  event.preventDefault()
  emits('create', query.value.trim())
  // The query is left alone: Reka repaints the input from `displayValue` when
  // the caller sets the model, and clearing it here would blank the field
  // instead, dropping it back to the placeholder.
  setOpen(false)
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

type Slot = 'anchor' | 'input' | 'trigger' | 'content' | 'viewport' | 'item' | 'empty'

function slotClass(slot: Slot, extra?: string) {
  const override = props.ui?.[slot]
  return isUnstyled.value ? [override, extra] : theme.value[slot]({ class: [override, extra] })
}

const itemIndicatorClass = computed(() => (isUnstyled.value ? undefined : theme.value.itemIndicator()))
</script>

<template>
  <ComboboxRoot
    v-bind="forwarded"
    :open="isOpen"
    open-on-click
    open-on-focus
    @update:open="setOpen"
  >
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
      />
      <ComboboxTrigger :class="slotClass('trigger')">
        <Icon :icon="ArrowDown01Icon" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent :class="slotClass('content')" position="popper" :side-offset="4">
        <ComboboxViewport :class="slotClass('viewport')">
          <ComboboxEmpty v-if="!showCreate" :class="slotClass('empty')">
            <slot name="empty" :query="query">
              {{ props.emptyText }}
            </slot>
          </ComboboxEmpty>

          <slot>
            <ComboboxItem
              v-for="option in options"
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
            :key="query"
            :value="query"
            data-create
            :text-value="query"
            :class="slotClass('item')"
            @select="onCreate"
          >
            <slot name="create" :query="query">
              {{ props.createLabel(query.trim()) }}
            </slot>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
