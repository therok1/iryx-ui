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

export function useIryxUiConfig(): IryxUiConfig {
  return inject(iryxUiConfigKey, defaultConfig)
}
