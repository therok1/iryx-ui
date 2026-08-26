---
eyebrow: Forms
---

<script setup lang="ts">
import { AppleIcon, Github01Icon, GoogleIcon } from '@hugeicons/core-free-icons'
</script>

# IAuthProviders

The third-party sign-in row, with the marks lined up and the labels aligned.

<Demo stack>
<template #demo>
<div class="w-full max-w-xs">
<IAuthProviders :providers="[{ id: 'google', label: 'Continue with Google', icon: GoogleIcon }, { id: 'apple', label: 'Continue with Apple', icon: AppleIcon }, { id: 'github', label: 'Continue with GitHub', icon: Github01Icon }]" />
</div>
</template>

```vue
<IAuthProviders
  :providers="[
    { id: 'google', label: 'Continue with Google', icon: GoogleIcon },
    { id: 'apple', label: 'Continue with Apple', icon: AppleIcon },
    { id: 'github', label: 'Continue with GitHub', icon: Github01Icon },
  ]"
  @select="signInWith"
/>
```
</Demo>

Each provider renders an [`IButton`](/components/button) with the mark pinned to the left edge and the label centred across the full width. That is the whole point: written by hand, rows with labels of different lengths each centre their own mark-and-label pair, so the marks stagger.

## The marks are yours

The component takes an icon and never ships one. Google's and Apple's sign-in branding comes with rules about the mark, the wording, the minimum size and the colours, and meeting them is the application's job — a library that shipped the SVGs would be making that promise on your behalf.

`icon` takes an `IconLike` like everywhere else: a Hugeicons icon, or any component that renders an `<svg>`. The demos here use Hugeicons' own `GoogleIcon`, `AppleIcon` and `Github01Icon`, which are generic glyphs — a production sign-in button wants the marks those companies publish.

## Handling a choice

`select` fires with the whole provider, so the handler can branch on `id`:

```vue
<script setup lang="ts">
import type { AuthProvider } from 'iryx-ui'

const pending = ref<string>()

function signInWith(provider: AuthProvider) {
  pending.value = provider.id
  location.href = `/auth/${provider.id}`
}
</script>
```

For a plain redirect, give the provider an `href` instead and it renders as a link — no handler, and the browser's own middle-click and open-in-new-tab keep working.

## While one is in flight

`loading` on a provider swaps its mark for a spinner; `disabled` on the component stops the rest without making them look broken.

<Demo stack>
<template #demo>
<div class="w-full max-w-xs">
<IAuthProviders disabled :providers="[{ id: 'google', label: 'Continue with Google', icon: GoogleIcon, loading: true }, { id: 'apple', label: 'Continue with Apple', icon: AppleIcon }]" />
</div>
</template>

```vue
<IAuthProviders
  :disabled="!!pending"
  :providers="providers.map(p => ({ ...p, loading: pending === p.id }))"
/>
```
</Demo>

## Marks alone

`compact` drops the labels and squares the buttons. The label stays on as the accessible name, so the buttons are still announced.

<Demo stack>
<template #demo>
<IAuthProviders compact layout="inline" :providers="[{ id: 'google', label: 'Continue with Google', icon: GoogleIcon }, { id: 'apple', label: 'Continue with Apple', icon: AppleIcon }, { id: 'github', label: 'Continue with GitHub', icon: Github01Icon }]" />
</template>

```vue
<IAuthProviders compact layout="inline" :providers="providers" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `providers` | `AuthProvider[]` | `[]` | `{ id, label, icon?, href?, disabled?, loading? }` |
| `layout` | `'stack' \| 'inline'` | `'stack'` | Full-width rows, or one equal column each |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Passed to each button |
| `variant` | `'outline' \| 'ghost' \| 'solid'` | `'outline'` | Passed to each button |
| `compact` | `boolean` | `false` | Marks only; `label` becomes the accessible name |
| `disabled` | `boolean` | `false` | Disables every provider |
| `unstyled` | `boolean` | — | Skip built-in classes |
| `class` | `ClassValue` | — | Merged onto the root |
| `ui` | `{ root?, provider?, icon?, label? }` | — | Per-slot class overrides |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | `AuthProvider` | A provider was chosen. Not fired for `href` providers, which navigate |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| default | `{ provider }` | Replaces the label |
| `icon` | `{ provider }` | Replaces the mark |

## Accessibility

Each provider is a real `<button>` — or an `<a>` when it has an `href` — so keyboard order and activation are the platform's. Under `compact` the visible text is gone, so the `label` is applied as `aria-label` rather than dropped.

The row is deliberately not a `radiogroup` or a listbox: these are three separate actions, not one choice among three, and arrow-key navigation would make the wrong promise.
