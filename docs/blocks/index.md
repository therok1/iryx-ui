---
eyebrow: Reference
description: Page-level building blocks — whole sections of a marketing page rather than single controls, shipped on their own import path so an app that never uses them never pays for them.
---

# Blocks

Components are the primitives; blocks are compositions built from them.

Components take a control and make it consistent. Blocks take a **whole page section** — a hero, a pricing table, a wall of testimonials — and do the same.

They live on their own import paths rather than the package root, because a dashboard has no use for a hero backdrop and should not carry one in its bundle. Nothing here is in `iryx-ui` itself, so nothing here changes what `import { IButton } from 'iryx-ui'` costs you.

## Marketing

The sections a product site is made of. Marketing blocks are available from `iryx-ui/marketing`:

```ts
import { IHero, ISection } from 'iryx-ui/marketing'
```

| Block | Description |
| --- | --- |
| [`IHero`](/blocks/hero) | The top of the page: a moving backdrop, heading, calls to action and a product shot |
| [`ISection`](/blocks/section) | The band a page section sits in: tone, top rule, vertical rhythm, and a centred heading |
| [`IPricingTable`](/blocks/pricing-table) | A row of plans, laid out from data |
| [`IPricingCard`](/blocks/pricing-card) | One plan: price, what you get, and the button |
| [`IFeatureCard`](/blocks/feature-card) | One thing the product does: icon, title, a line about it |
| [`ISiteHeader`](/blocks/site-header) | The bar across the top: brand, links, buttons, and a drawer for them below `md` |
| [`ISiteFooter`](/blocks/site-footer) | The band that closes the page: brand, links, small print |
| [`ITestimonialCard`](/blocks/testimonial-card) | Someone's words, with their name and their job under them |
| [`IBrowserFrame`](/blocks/browser-frame) | Browser chrome around a screenshot, so a flat image reads as a running product |

## Registering them globally

The plugin registers the core components. Blocks are opt-in, through the same `components` option:

```ts
import { createIryxUi } from 'iryx-ui'
import { marketingComponents } from 'iryx-ui/marketing'

app.use(createIryxUi({ components: marketingComponents }))
```

They use the same `prefix` convention as the core components. With the default prefix, `Section` is registered as `<ISection />`.

Importing the subpath also declares the blocks on Vue's `GlobalComponents`, so templates type-check. A project that never imports the subpath keeps its `GlobalComponents` untouched.

Pick individual ones by passing a subset:

```ts
import { Section } from 'iryx-ui/marketing'

app.use(createIryxUi({ components: { Section } }))
```

In Nuxt, turn `blocks` on and the module handles the imports and the registration for you:

```ts
export default defineNuxtConfig({
  modules: ['iryx-ui/nuxt'],
  iryxUi: { blocks: true },
})
```

## Seeing them together

[`marketing.iryx-ui.com`](https://marketing.iryx-ui.com) is a whole product site built from these, and its [source](https://github.com/therok1/iryx-ui/tree/main/examples/marketing) is in the repository.
