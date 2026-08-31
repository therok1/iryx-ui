import type { Component, Plugin } from 'vue'
import type { Appearance } from './composables/appearance'
import type { IryxUiConfig } from './config'
import type { Theme, ThemePresetName } from './theme/presets'
import { componentNames } from './component-names'
import * as components from './components'
import { initAppearance } from './composables/appearance'
import { defaultConfig, iryxUiConfigKey } from './config'
import { applyTheme } from './theme/presets'

export interface IryxUiPluginOptions extends Partial<IryxUiConfig> {
  /**
   * Extra components to register globally, keyed by name. Used by the optional
   * subpaths, e.g. `import { marketingComponents } from 'iryx-ui/marketing'`.
   */
  components?: Record<string, Component>
  /** Prefix for globally registered components. Defaults to `I` (IButton, ISwitch…). */
  prefix?: string
  /** Startup appearance. A preference the user already stored wins over this. */
  appearance?: Appearance
  /** Color theme: a preset name (`'violet'`, `'rose'`) or a custom theme. */
  theme?: Theme | ThemePresetName
}

/**
 * Create the Iryx UI Vue plugin. Registers every component globally
 * (prefixed) and provides the global config.
 *
 * ```ts
 * app.use(createIryxUi({ prefix: 'I', unstyled: false }))
 * ```
 */
export function createIryxUi(options: IryxUiPluginOptions = {}): Plugin {
  const { prefix = 'I', appearance, theme, components: extra, ...config } = options
  return {
    install(app) {
      app.provide(iryxUiConfigKey, { ...defaultConfig, ...config })
      for (const name of componentNames)
        app.component(`${prefix}${name}`, components[name])
      for (const [name, component] of Object.entries(extra ?? {}))
        app.component(`${prefix}${name}`, component)
      if (theme)
        applyTheme(theme)
      if (appearance)
        initAppearance(appearance)
    },
  }
}

/** The Iryx UI Vue plugin with default options. */
export const IryxUi: Plugin = createIryxUi()
