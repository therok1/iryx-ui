import type { Appearance } from './composables/appearance'
import type { Theme, ThemePresetName } from './theme/presets'
import { addComponent, addPluginTemplate, defineNuxtModule } from '@nuxt/kit'
import { componentNames, marketingComponentNames } from './component-names'

export interface ModuleOptions {
  /** Prefix for auto-imported components. Defaults to `I` (IButton, ISwitch…). */
  prefix: string
  /** Render bare Reka UI primitives without Iryx's Tailwind classes. */
  unstyled: boolean
  /**
   * Also auto-import the blocks from `iryx-ui/marketing`. Off by default, so an
   * app that has no use for a hero never pulls one into its bundle.
   */
  blocks: boolean
  /** Startup appearance. A preference the user already stored wins over this. */
  appearance?: Appearance
  /** Color theme: a preset name (`'violet'`, `'rose'`) or a custom theme. */
  theme?: Theme | ThemePresetName
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'iryx-ui',
    configKey: 'iryxUi',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    prefix: 'I',
    unstyled: false,
    blocks: false,
  },
  setup(options: ModuleOptions) {
    for (const name of componentNames) {
      addComponent({
        name: `${options.prefix}${name}`,
        export: name,
        filePath: 'iryx-ui',
      })
    }

    if (options.blocks) {
      for (const name of marketingComponentNames) {
        addComponent({
          name: `${options.prefix}${name}`,
          export: name,
          filePath: 'iryx-ui/marketing',
        })
      }
    }

    addPluginTemplate({
      filename: 'iryx-ui.config.mjs',
      getContents: () => `
import { applyTheme, initAppearance, iryxUiConfigKey } from 'iryx-ui'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(iryxUiConfigKey, ${JSON.stringify({ unstyled: options.unstyled })})
  if (import.meta.client) {
    ${options.theme ? `applyTheme(${JSON.stringify(options.theme)})` : ''}
    ${options.appearance ? `initAppearance(${JSON.stringify(options.appearance)})` : ''}
  }
})
`,
    })
  },
})
