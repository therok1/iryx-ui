<script setup lang="ts">
import type { ClassValue } from '../class-value'
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Primitive } from 'reka-ui'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useIryxUiConfig } from '../config'
import { codeTheme } from '../theme/code'
import Icon from './Icon.vue'

export interface CodeProps {
  /** The code itself. The default slot renders instead when it is absent. */
  code?: string
  /** Render a `pre` block rather than an inline chip. */
  block?: boolean
  /** Show a copy button. Defaults to on for a block, off inline. */
  copy?: boolean
  copyLabel?: string
  copiedLabel?: string
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per element, e.g. `{ code: 'text-xs' }`. */
  ui?: {
    root?: string
    code?: string
    copy?: string
  }
}

const props = withDefaults(defineProps<CodeProps>(), {
  copy: undefined,
  copyLabel: 'Copy code',
  copiedLabel: 'Copied',
  unstyled: undefined,
})

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const showCopy = computed(() => props.copy ?? props.block ?? false)

const codeEl = ref<HTMLElement>()
const copied = ref(false)
let reset: ReturnType<typeof setTimeout> | undefined

async function copyCode() {
  const text = props.code ?? codeEl.value?.textContent ?? ''
  if (!text)
    return
  try {
    await navigator.clipboard.writeText(text)
  }
  catch {
    return
  }
  copied.value = true
  clearTimeout(reset)
  reset = setTimeout(() => (copied.value = false), 2000)
}

onBeforeUnmount(() => clearTimeout(reset))

const theme = computed(() => codeTheme({ block: props.block }))

const rootClass = computed(() =>
  isUnstyled.value
    ? [props.ui?.root, props.class]
    : theme.value.root({ class: [props.ui?.root, props.class] }),
)
const codeClass = computed(() =>
  isUnstyled.value ? props.ui?.code : theme.value.code({ class: props.ui?.code }),
)
const copyClass = computed(() =>
  isUnstyled.value ? props.ui?.copy : theme.value.copy({ class: props.ui?.copy }),
)
</script>

<template>
  <Primitive :as="props.block ? 'pre' : 'span'" :class="rootClass">
    <code ref="codeEl" :class="codeClass"><slot>{{ props.code }}</slot></code>
    <button
      v-if="showCopy"
      type="button"
      :class="copyClass"
      :aria-label="copied ? props.copiedLabel : props.copyLabel"
      @click="copyCode"
    >
      <Icon :icon="copied ? Tick02Icon : Copy01Icon" />
    </button>
  </Primitive>
</template>
