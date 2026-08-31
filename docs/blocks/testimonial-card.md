---
eyebrow: Marketing
---

# ITestimonialCard

Someone's words, with their face and their job under it.

```vue
<ITestimonialCard
  quote="We stopped chasing invoices entirely. The reminders do it."
  name="Rae Ellis"
  role="Finance lead, Meridian Foods"
  avatar="/people/rae.jpg"
/>
```

<Demo stack>
<template #demo>
<div class="grid w-full gap-4 sm:grid-cols-2">
<ITestimonialCard quote="We stopped chasing invoices entirely. The reminders do it, and they do it politely." name="Rae Ellis" role="Finance lead, Meridian Foods" />
<ITestimonialCard quote="Month end used to be a weekend. Now it is an afternoon." name="Tomas Vidal" role="Owner, Halcyon Labs" />
</div>
</template>

```vue
<ITestimonialCard quote="Month end used to be a weekend." name="Tomas Vidal" role="Owner, Halcyon Labs" />
```
</Demo>

The curly quotes are added for you — pass the sentence, not the punctuation.

The words render as a `blockquote`, and the attribution sits outside it: who someone is was never part of what they said.

## The avatar

`avatar` is the photo. Without one, [`IAvatar`](/components/avatar) derives initials from `name`, so a card with no image still looks deliberate.

Its `alt` is deliberately empty. The name is printed right beside it, and a screen reader announcing it twice is worse than not announcing it at all. The photo is decorative in every case — the identity lives in the text, never in the image — so a card crediting only a `role` loses nothing by not describing the face.

## Without a name

The attribution renders if either `name` or `role` is given, so a quote can be credited to a job title alone. Leave both out and no footer renders at all — useful for a pull quote from a review site, where the source belongs in the body rather than under a face.

## Size

`size` scales the quote alone; the attribution stays put, since a name set in 18px reads as a heading rather than as a credit.

| `size` | Quote |
| --- | --- |
| `sm` | `text-sm` |
| `md` | Body size (default) |
| `lg` | `text-lg` — for a prominent or standalone quote |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `quote` | `string` | — | What they said, without quote marks |
| `name` | `string` | — | Who said it; also derives the initials |
| `role` | `string` | — | Their job, company, or both |
| `avatar` | `string` | — | Photo URL |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Quote size |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, quote?, author?, identity?, name?, role? }` | — | Per-element class overrides |

## Slots

Use `quote` for plain text, and the default slot when the words need markup of their own. The slot still renders inside the `blockquote`, but the quote marks come with the prop — supply your own punctuation.

| Slot | Description |
| --- | --- |
| `default` | Replaces the quote's content; punctuation is yours |
| `author` | Replaces the whole footer, avatar included |
