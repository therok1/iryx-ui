import * as marketingComponents from './marketing/index'

export type { BrowserFrameProps } from './marketing/BrowserFrame.vue'
export type { FeatureCardProps } from './marketing/FeatureCard.vue'
export type { HeroProps } from './marketing/Hero.vue'
export * from './marketing/index'
export type { PricingCardProps } from './marketing/PricingCard.vue'
export type { PricingPlan, PricingTableProps } from './marketing/PricingTable.vue'
export type { SectionProps } from './marketing/Section.vue'
export type { SiteFooterProps } from './marketing/SiteFooter.vue'
export type { SiteHeaderProps, SiteLink } from './marketing/SiteHeader.vue'
export type { TestimonialCardProps } from './marketing/TestimonialCard.vue'

/**
 * Every marketing component, keyed by name. Pass to the plugin's `components`
 * option to register them globally alongside the core set:
 *
 * ```ts
 * app.use(createIryxUi({ components: marketingComponents }))
 * ```
 */
export { marketingComponents }

/**
 * Marketing components under the default `I` prefix. Declared only when this
 * subpath is imported, so a project that never uses it keeps the core
 * `GlobalComponents` untouched.
 */
export type IryxUiMarketingGlobalComponents = {
  [K in keyof typeof marketingComponents as `I${K}`]: (typeof marketingComponents)[K]
}

declare module 'vue' {
  interface GlobalComponents extends IryxUiMarketingGlobalComponents {}
}
