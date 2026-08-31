---
eyebrow: Marketing
---

# IPricingTable

A row of plans. Takes the plans as data and renders an [`IPricingCard`](/blocks/pricing-card) for each, sized to how many there are.

```vue
<IPricingTable :plans="plans" @select="checkout" />
```

```ts
const plans = [
  {
    id: 'solo',
    name: 'Solo',
    price: '€0',
    period: 'forever',
    description: 'For one person and a handful of clients.',
    features: ['Up to 5 invoices a month', 'Automatic reminders'],
    cta: 'Start for nothing',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '€24',
    period: 'per month',
    features: ['Unlimited invoices', 'Five seats included'],
    cta: 'Start a trial',
    featured: true,
  },
]
```

<Demo stack>
<template #demo>
<IPricingTable :plans="[
  { name: 'Solo', price: '€0', period: 'forever', description: 'For one person.', features: ['Five invoices a month', 'Automatic reminders'], cta: 'Start for nothing' },
  { name: 'Studio', price: '€24', period: 'per month', description: 'For a small team.', features: ['Unlimited invoices', 'Five seats included'], cta: 'Start a trial', featured: true },
]" badge="Most chosen" class="w-full" />
</template>

```vue
<IPricingTable :plans="plans" badge="Most chosen" />
```
</Demo>

## Plan data

Each object in `plans` is passed straight through to an [`IPricingCard`](/blocks/pricing-card), so every card prop — `featured`, `badge`, `description`, `features`, `cta` — is set per plan. The table adds the layout, the list identity and the `select` event, and nothing else.

`PricingPlan` is a card's props plus an identity:

```ts
interface PricingPlan extends PricingCardProps {
  id?: string | number
}
```

## Columns

The table picks its column count from the number of plans, up to four. Beyond four, the cards wrap rather than shrinking to nothing. Set `columns` to choose the layout yourself.

The count is the layout at the widest; below the listed breakpoint the cards stack.

| Plans | Layout |
| --- | --- |
| 2 | Two columns from `sm` |
| 3 | Three from `lg` |
| 4 or more | Two from `sm`, four from `lg` |

The cards do not stretch to match the tallest. A featured card's ring wrapping empty space under its own button reads as a mistake, so each card ends where its content ends.

## Choosing a plan

`select` fires with the plan object, so the handler gets the whole row rather than an index:

```vue
<IPricingTable :plans="plans" @select="plan => startCheckout(plan.id)" />
```

Give each plan an `id` when the name is not what your backend keys on. It is also the list key: `id` if there is one, otherwise `name`, otherwise the index — so a row whose plans have neither loses its identity when it reorders.

## Taking over the cards

The default slot replaces the generated cards entirely. Use it when the row needs something alongside the standard cards — an enterprise panel that is not a priced plan, say. You keep the grid and give up `plans`, so the cards are yours to render:

```vue
<IPricingTable :columns="3">
  <IPricingCard v-for="plan in plans" :key="plan.name" v-bind="plan" />
  <ICard>
    <h3 class="font-medium">Enterprise</h3>
    <p class="mt-2 text-sm text-muted-foreground">Talk to us.</p>
  </ICard>
</IPricingTable>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `plans` | `PricingPlan[]` | — | One card each |
| `badge` | `string` | — | Default badge for the featured plan; a plan's own `badge` wins |
| `columns` | `1 \| 2 \| 3 \| 4` | auto, max 4 | Columns at the widest |
| `as` | `string` | `'div'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |

`badge` is the default for whichever plan is `featured`; a plan that names its own `badge` keeps it.

## Events

| Event | Payload | Fired |
| --- | --- | --- |
| `select` | `PricingPlan` | The plan's button was pressed |
