<script setup lang="ts">
import type { ConfigProviderProps } from 'reka-ui'
import type { Appearance } from '../composables/appearance'
import type { Theme, ThemePresetName } from '../theme/presets'
import { ConfigProvider, Primitive } from 'reka-ui'
import { computed, provide, reactive, watch } from 'vue'
import { initAppearance, useAppearance } from '../composables/appearance'
import { defaultConfig, iryxUiConfigKey } from '../config'
import { applyTheme, clearTheme } from '../theme/presets'

export interface AppProps extends /* @vue-ignore */ ConfigProviderProps {
  /**
   * Render bare Reka UI primitives without Iryx's classes, for everything
   * below. Reactive, unlike the install-time plugin option.
   */
  unstyled?: boolean
  /** Colour theme: a preset name (`'emerald'`…) or a custom theme. */
  theme?: Theme | ThemePresetName
  /** Startup appearance. A preference the user already stored wins over this. */
  appearance?: Appearance
  /**
   * Element to render as the root. Defaults to `template`, i.e. no wrapper —
   * pass `div` (with `class`) if you want App to own your page shell.
   */
  as?: string
  class?: string
}

const props = withDefaults(defineProps<AppProps>(), {
  as: 'template',
  unstyled: undefined,
})

/**
 * Reactive config for every descendant. Components read `config.unstyled`
 * inside computeds, so changing the prop re-renders them.
 */
const config = reactive({
  ...defaultConfig,
  unstyled: computed(() => props.unstyled ?? defaultConfig.unstyled),
})
provide(iryxUiConfigKey, config)

watch(
  () => props.theme,
  (theme) => {
    if (theme)
      applyTheme(theme)
    else
      clearTheme()
  },
  { immediate: true },
)

// Appearance is only managed when the prop is set, so App stays inert for
// apps that drive dark mode themselves via `useAppearance()`.
//
// Order matters: `useAppearance()` starts the appearance system, which writes
// the current value to localStorage. Calling it before `initAppearance` would
// make the "has the user stored a preference?" check always true and silently
// ignore this prop.
let appearanceStarted = false
watch(
  () => props.appearance,
  (appearance) => {
    if (!appearance)
      return
    if (appearanceStarted) {
      // A later change is an explicit instruction, so apply it directly.
      useAppearance().setAppearance(appearance)
    }
    else {
      // First pass is a *default* — don't stomp on the user's stored choice.
      initAppearance(appearance)
      appearanceStarted = true
    }
  },
  { immediate: true },
)

const configProviderProps = computed<ConfigProviderProps>(() => ({
  dir: props.dir,
  locale: props.locale,
  scrollBody: props.scrollBody,
  nonce: props.nonce,
  useId: props.useId,
}))
</script>

<template>
  <ConfigProvider v-bind="configProviderProps">
    <Primitive :as="props.as" :class="props.class">
      <slot />
    </Primitive>
  </ConfigProvider>
</template>
