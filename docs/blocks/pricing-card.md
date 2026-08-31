---
eyebrow: Marketing
---

# IPricingCard

One plan: name, price, what the price is per, a list of what you get, and the button. Use [`IPricingTable`](/blocks/pricing-table) to lay a row of them out — reach for the card directly when a row is not what you are building.

```vue
<IPricingCard
  name="Studio"
  price="€24"
  period="per month"
  description="For a small team that bills every week."
  :features="['Unlimited invoices', 'Five seats included', 'Multi-currency']"
  cta="Start a trial"
  featured
/>
```

<Demo stack>
<template #demo>
<div class="grid w-full gap-4 sm:grid-cols-2">
<IPricingCard name="Solo" price="€0" period="forever" description="For one person and a handful of clients." :features="['Five invoices a month', 'Automatic reminders', 'CSV export']" cta="Start for nothing" />
<IPricingCard name="Studio" price="€24" period="per month" description="For a small team that bills every week." :features="['Unlimited invoices', 'Five seats included', 'Multi-currency']" cta="Start a trial" featured badge="Most chosen" />
</div>
</template>

```vue
<IPricingCard name="Solo" price="€0" period="forever" :features="features" cta="Start for nothing" />
<IPricingCard name="Studio" price="€24" period="per month" :features="features" cta="Start a trial" featured />
```
</Demo>

## The featured plan

`featured` is the plan you are pushing. It rings the card in the primary colour, lifts its shadow, turns its button solid, and shows a badge. Put it on the single plan you want to emphasise in a pricing group — in a row of cards, one of them.

When `featured` is set, the badge reads *Most popular* unless you pass `badge`. Without `featured` there is no badge to name, so `badge` on its own does nothing:

```vue
<IPricingCard featured badge="Most chosen" />
```

## Price

`price` is a string, and it is rendered exactly as given. Plans say *Free*, *Custom* and *Let's talk* as often as they say a figure, and the card does not know your locale anyway. Format it where you do, then pass the result.

`period` sits on the price's baseline, so `€24 per month` aligns however large the figure is.

## Features

Each string in `features` becomes a line with a tick. For anything richer — a footnote, a tooltip, a struck-through line — leave `features` out and put your own list in the default slot, which renders between the description and the footer. The slot does not replace the ticked list: pass both and you get both, one after the other.

```vue
<IPricingCard name="Studio" price="€24">
  <ul class="mt-6 flex flex-col gap-2.5 text-sm">
    <li>Unlimited invoices <ITooltip content="Fair use applies">*</ITooltip></li>
  </ul>
</IPricingCard>
```

## The button

`cta` renders the button; leave it out and no footer renders. Pressing it emits `select`, which is what [`IPricingTable`](/blocks/pricing-table) re-emits with the plan attached.

Replace it through the `footer` slot when the action is a link rather than a handler:

```vue
<IPricingCard name="Studio" price="€24">
  <template #footer>
    <IButton as="a" href="/checkout/studio" block>Start a trial</IButton>
  </template>
</IPricingCard>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Rendered as an `h3` in the header |
| `price` | `string` | — | The price, already formatted |
| `period` | `string` | — | What the price is per |
| `description` | `string` | — | Short text under the price |
| `features` | `string[]` | — | One ticked line each |
| `cta` | `string` | — | Button label; no button without it |
| `featured` | `boolean` | `false` | Ring, badge and a solid button |
| `badge` | `string` | `'Most popular'` | Badge text, when featured |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, header?, name?, price?, amount?, period?, description?, features?, feature?, featureIcon? }` | — | Per-element class overrides |

## Slots

When both a prop and its matching slot are given, the slot wins.

| Slot | Description |
| --- | --- |
| `default` | Between the description and the footer |
| `name` | Replaces the `name` prop |
| `price` | Replaces the whole price line |
| `description` | Replaces the `description` prop |
| `badge` | Replaces the featured badge |
| `footer` | Replaces the button |

## Events

| Event | Payload | Fired |
| --- | --- | --- |
| `select` | — | The button was pressed |
