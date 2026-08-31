---
"iryx-ui": minor
---

Add blocks: whole page sections on their own import path, `iryx-ui/marketing`.

`IHero` is the top of a marketing page — a masked, animated backdrop (`aurora` or
`bloom`), an optional ruled grid, and regions for a badge, heading, description,
actions, small print and a product shot. `ISection` is the band every other
section sits in: tone, an optional top rule, vertical rhythm and a centred
heading block. `IPricingTable` lays a row of plans out from data, each an `IPricingCard`.
`IFeatureCard` and `ITestimonialCard` are the cards a features or customers
section is a grid of. `IBrowserFrame` puts browser chrome around a screenshot.

Blocks are not registered by the plugin unless asked for, and are not on the
package root, so an app that never uses them carries none of them:

```ts
import { createIryxUi } from 'iryx-ui'
import { marketingComponents } from 'iryx-ui/marketing'

app.use(createIryxUi({ components: marketingComponents }))
```

The plugin's new `components` option takes any record of components, so a subset
works too. The Nuxt module gains a matching `blocks` option, off by default,
which auto-imports the blocks from the subpath under the same prefix. Importing the subpath declares the blocks on Vue's `GlobalComponents`;
a project that never imports it keeps its declarations untouched.

The hero's backdrop layers ship as plain classes in `theme.css`
(`iryx-hero`, `iryx-hero-aurora`, `iryx-hero-bloom`, `iryx-hero-grid`), so a
panel that is not a hero can reuse them.
