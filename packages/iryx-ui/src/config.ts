import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export interface IryxUiConfig {
  /**
   * Skip all built-in Tailwind classes and render bare Reka UI primitives.
   * Can also be toggled per component via the `unstyled` prop.
   */
  unstyled: boolean
}

export const defaultConfig: IryxUiConfig = {
  unstyled: false,
}

export const iryxUiConfigKey: InjectionKey<IryxUiConfig> = Symbol.for('iryx-ui:config')

/**
 * Read the global config, falling back to the defaults.
 *
 * Any component resolving a boolean against this config must declare an
 * explicit `undefined` default in `withDefaults` — Vue casts an absent boolean
 * prop to `false`, which would shadow the config and make it do nothing. The
 * same applies to props whose type merely includes `false`. `test/config.test.ts`
 * guards this for every component.
 */
export function useIryxUiConfig(): IryxUiConfig {
  return inject(iryxUiConfigKey, defaultConfig)
}
