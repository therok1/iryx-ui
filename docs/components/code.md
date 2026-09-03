---
eyebrow: Data display
---

# ICode

A snippet of code — a chip inside a sentence, or a `pre` block with a copy button.

<Demo stack>
<template #demo>
<ICode block class="w-full max-w-md" code="corepack pnpm add iryx-ui" />
</template>

```vue
<ICode block code="corepack pnpm add iryx-ui" />
```
</Demo>

## Inline

The default is an inline chip that takes its colour from the text around it, so it works inside a paragraph, a button or an alert.

<Demo stack>
<template #demo>
<p class="max-w-md text-sm">Run <ICode code="pnpm dev" /> to start the dev server, then open <ICode code="localhost:5173" />.</p>
</template>

```vue
<p>Run <ICode code="pnpm dev" /> to start the dev server.</p>
```
</Demo>

## Copying

`copy` shows the copy button — on by default for a block, off inline. The button swaps to a tick for two seconds after a successful write, and says nothing when the clipboard is unavailable, which is what an insecure origin or a denied permission gives you.

<Demo stack>
<template #demo>
<p class="max-w-md text-sm">Your key is <ICode copy code="sk_live_8f2a91" />.</p>
</template>

```vue
<p>Your key is <ICode copy code="sk_live_8f2a91" />.</p>
```
</Demo>

## Multiple lines

A block keeps its own line breaks and scrolls sideways rather than wrapping. Pass the code through the default slot when it carries markup — highlighted output, for one.

<Demo stack>
<template #demo>
<ICode block class="w-full max-w-md" :code="'export default defineConfig({\n  plugins: [iryxUi()],\n})'" />
</template>

```vue
<ICode block :code="source" />
```
</Demo>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | — | The code; the default slot renders instead when absent |
| `block` | `boolean` | `false` | Render a `pre` block rather than an inline chip |
| `copy` | `boolean` | `block` | Show the copy button |
| `copyLabel` | `string` | `'Copy code'` | Accessible name of the button |
| `copiedLabel` | `string` | `'Copied'` | Accessible name after a successful copy |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, code?, copy? }` | — | Per-element class overrides |

Copying reads the rendered text when there is no `code`, so a slotted snippet copies the same way — the markup is stripped, the text is not.

## Syntax highlighting

`ICode` renders text. Highlighting is a highlighter's job, so pass its output through the default slot — the copy button still copies the plain text, because it reads the rendered text rather than the markup.

<Demo stack>
<template #demo>
<CodeHighlightDemo
  class="w-full max-w-md"
  lang="ts"
  :code="`export default defineConfig({
  plugins: [iryxUi()],
})`"
/>
</template>

```vue
<HighlightedCode
  lang="ts"
  :code="`export default defineConfig({
  plugins: [iryxUi()],
})`"
/>
```
</Demo>

This block is highlighted by [Shiki](https://shiki.style) at render time. Wrap it once in your app and use the wrapper everywhere:

```vue
<!-- HighlightedCode.vue -->
<script setup lang="ts">
import { computedAsync } from '@vueuse/core'
import { codeToHtml } from 'shiki'

const props = defineProps<{ code: string, lang?: string }>()

const html = computedAsync(
  () => codeToHtml(props.code, {
    lang: props.lang ?? 'vue',
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  }),
  '',
)
</script>

<template>
  <ICode block :ui="{ code: 'p-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent [&_pre]:p-4' }">
    <span v-html="html" />
  </ICode>
</template>
```

Shiki emits its own `<pre>`, so the `ui` override moves the padding and the scroll onto it and clears its background — the block's border and surface stay with `ICode`. Setting `defaultColor: false` tells Shiki to write both palettes as CSS variables instead of picking one, which is what lets a single render follow light and dark.

`v-html` inserts the highlighter's output as HTML. That is a trust boundary: highlight your own content, or sanitise anything a user wrote before it reaches this component.
