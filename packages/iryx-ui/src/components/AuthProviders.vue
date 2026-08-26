<script setup lang="ts">
import type { ClassValue } from '../class-value'
import type { IconLike } from '../composables/icon'
import { Loading03Icon } from '@hugeicons/core-free-icons'
import { computed } from 'vue'
import { useIryxUiConfig } from '../config'
import { authProvidersTheme } from '../theme/auth-providers'
import Button from './Button.vue'
import Icon from './Icon.vue'

export interface AuthProvider {
  /** Identifies the provider in the `select` event. */
  id: string
  /** Button text, e.g. `'Continue with Google'`. Hidden when `compact`. */
  label: string
  /**
   * The provider's mark. Deliberately yours to supply: the sign-in branding
   * of Google, Apple and the rest comes with rules about the mark, the
   * wording and the colours, and those are the caller's to meet.
   */
  icon?: IconLike
  /** Render as a link instead of a button. */
  href?: string
  disabled?: boolean
  /** Swap the mark for a spinner while the redirect is in flight. */
  loading?: boolean
}

export interface AuthProvidersProps {
  providers?: AuthProvider[]
  /** Full-width rows, or one equal-width column each. */
  layout?: 'stack' | 'inline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'outline' | 'ghost' | 'solid'
  /** Drop the labels and show the marks alone. `label` becomes the a11y name. */
  compact?: boolean
  /** Disable every provider, e.g. while the form it sits beside is submitting. */
  disabled?: boolean
  /** Skip built-in classes; you take over styling entirely. */
  unstyled?: boolean
  class?: ClassValue
  /** Override classes per slot, e.g. `{ provider: 'rounded-full' }`. */
  ui?: {
    root?: string
    provider?: string
    icon?: string
    label?: string
  }
}

const props = withDefaults(defineProps<AuthProvidersProps>(), {
  providers: () => [],
  variant: 'outline',
  unstyled: undefined,
})

const emit = defineEmits<{
  select: [provider: AuthProvider]
}>()

const config = useIryxUiConfig()
const isUnstyled = computed(() => props.unstyled ?? config.unstyled)

const theme = computed(() => authProvidersTheme({
  layout: props.layout,
  size: props.size,
  compact: props.compact,
}))

function slotClass(name: keyof NonNullable<AuthProvidersProps['ui']>, extra?: ClassValue) {
  const override = [props.ui?.[name], extra].filter(Boolean).join(' ')
  return isUnstyled.value ? override : theme.value[name]({ class: override })
}
</script>

<template>
  <div :class="slotClass('root', props.class)">
    <Button
      v-for="provider in props.providers"
      :key="provider.id"
      :as="provider.href ? 'a' : 'button'"
      :href="provider.href"
      :variant="props.variant"
      :size="props.size"
      :square="props.compact"
      :disabled="provider.disabled || provider.loading || props.disabled"
      :aria-label="props.compact ? provider.label : undefined"
      :class="slotClass('provider')"
      @click="emit('select', provider)"
    >
      <span v-if="provider.loading || provider.icon || $slots.icon" :class="slotClass('icon')">
        <Icon v-if="provider.loading" :icon="Loading03Icon" class="animate-spin" data-icon />
        <slot v-else name="icon" :provider="provider">
          <Icon v-if="provider.icon" :icon="provider.icon" data-icon />
        </slot>
      </span>
      <span v-if="!props.compact" :class="slotClass('label')">
        <slot :provider="provider">{{ provider.label }}</slot>
      </span>
    </Button>
  </div>
</template>
