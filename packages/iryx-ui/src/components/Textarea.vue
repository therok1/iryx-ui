<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { defaultCountLabel, useCharacterCount } from '../composables/character-count'
import { useFormField } from '../composables/form'
import { useIryxUiConfig } from '../config'
import { textareaCountTheme, textareaTheme } from '../theme/input'

export interface TextareaProps {
  size?: 'sm' | 'md' | 'lg'
  /**
   * Fixed height in rows. Ignored when `autosize` is set — pass the bounds
   * through `autosize` instead.
   */
  rows?: number
  /**
   * Grow with the content. `true` grows without limit; `{ min, max }` bounds
   * it in rows, and the field scrolls once it hits `max`.
   */
  autosize?: boolean | { min?: number, max?: number }
  placeholder?: string
  disabled?: boolean
  required?: boolean
  /** Mark the field as invalid — styles the border and ring red. */
  invalid?: boolean
  /** Hard limit in characters, enforced by the browser. */
  maxlength?: number
  /**
   * Show a character count under the field — "120/500" with `maxlength`,
   * turning red within the last tenth of the limit.
   */
  showCount?: boolean
  /**
   * What a screen reader announces near the limit. Override for non-English
   * apps.
   */
  countLabel?: (remaining: number) => string
  id?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  /** Applied to the wrapper when `showCount` is on, otherwise to the textarea. */
  class?: ClassValue
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  invalid: undefined,
  countLabel: defaultCountLabel,
  unstyled: undefined,
})

const model = defineModel<string | null>()

const field = useFormField()
const inputId = computed(() => props.id ?? field?.id.value)
if (field && props.id)
  field.id.value = props.id
const isInvalid = computed(() => props.invalid ?? field?.invalid.value ?? false)

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const classes = computed(() => {
  if (isUnstyled.value)
    return props.class
  return textareaTheme({
    size: props.size,
    invalid: isInvalid.value,
    autosize: !!props.autosize,
    class: props.showCount ? undefined : props.class,
  })
})

const { remaining, nearLimit, text: countText } = useCharacterCount(() => model.value, () => props.maxlength)

const countTheme = computed(() => textareaCountTheme({ nearLimit: nearLimit.value }))
const countRootClass = computed(() => (isUnstyled.value ? props.class : countTheme.value.root({ class: props.class })))
const countClass = computed(() => (isUnstyled.value ? undefined : countTheme.value.count()))

const el = ref<HTMLTextAreaElement>()

defineExpose({
  /** The underlying element, for focus management by the caller. */
  textarea: el,
})

const bounds = computed(() => (typeof props.autosize === 'object' ? props.autosize : {}))

/**
 * Measure against `scrollHeight`, which only ever reports the content height
 * when the element is smaller than its content — so the height has to be reset
 * before reading it, or the field can grow but never shrink again.
 */
/** Unresolved computed styles come back as `''`, and `NaN + 'px'` is not CSS. */
function px(value: string): number {
  return Number.parseFloat(value) || 0
}

function resize(): void {
  const node = el.value
  if (!node || !props.autosize)
    return

  node.style.height = 'auto'

  const styles = window.getComputedStyle(node)
  const lineHeight = px(styles.lineHeight)
  // scrollHeight includes padding in border-box terms; the borders do not.
  const chrome = px(styles.paddingTop) + px(styles.paddingBottom)
  const borders = px(styles.borderTopWidth) + px(styles.borderBottomWidth)

  let height = node.scrollHeight
  if (lineHeight) {
    const { min, max } = bounds.value
    if (min != null)
      height = Math.max(height, min * lineHeight + chrome)
    if (max != null)
      height = Math.min(height, max * lineHeight + chrome)
  }

  node.style.height = `${height + borders}px`
  // Only scroll once the content is actually taller than the cap.
  node.style.overflowY = bounds.value.max != null && node.scrollHeight > height ? 'auto' : 'hidden'
}

onMounted(() => {
  if (props.autosize)
    void nextTick(resize)
})

// The model can change without an input event — a reset, a prefill, or the
// size prop changing the line height underneath us.
watch(() => [model.value, props.autosize, props.size], () => void nextTick(resize))
</script>

<template>
  <div v-if="props.showCount" :class="countRootClass">
    <textarea
      :id="inputId"
      ref="el"
      v-bind="$attrs"
      v-model="model"
      :rows="props.autosize ? bounds.min : props.rows"
      :maxlength="props.maxlength"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="field?.describedBy.value"
      :class="classes"
    />
    <span aria-hidden="true" :class="countClass">
      {{ countText }}
    </span>
    <span class="sr-only" aria-live="polite">
      {{ nearLimit ? props.countLabel(remaining!) : '' }}
    </span>
  </div>
  <textarea
    v-else
    :id="inputId"
    ref="el"
    v-bind="$attrs"
    v-model="model"
    :rows="props.autosize ? bounds.min : props.rows"
    :maxlength="props.maxlength"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :required="props.required"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="field?.describedBy.value"
    :class="classes"
  />
</template>
