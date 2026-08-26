import type * as components from './components'

/**
 * Every component under the default `I` prefix, keyed as the plugin registers
 * them. A custom `prefix` is not reflected here — a type declaration cannot
 * depend on a runtime option — so a project that renames the prefix declares
 * its own augmentation.
 */
export type IryxUiGlobalComponents = {
  [K in keyof typeof components as `I${K}`]: (typeof components)[K]
}

declare module 'vue' {
  interface GlobalComponents extends IryxUiGlobalComponents {}
}
