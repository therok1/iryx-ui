---
eyebrow: Feedback
---

# IEmptyState

What a list shows when it has nothing in it. Say why it is empty and what to do about it.

<Demo stack>
<template #demo>
<IEmptyState
  title="No invoices yet"
  description="Create your first invoice and it will show up here."
  class="w-full max-w-md"
>
<template #actions>
<IButton size="sm">New invoice</IButton>
</template>
</IEmptyState>
</template>

```vue
<IEmptyState
  title="No invoices yet"
  description="Create your first invoice and it will show up here."
>
  <template #actions>
    <IButton size="sm">New invoice</IButton>
  </template>
</IEmptyState>
```
</Demo>

## Nothing found, versus nothing yet

An empty search wants a way back out; an empty collection wants a way in.

<Demo stack>
<template #demo>
<IEmptyState
  title="No invoices match “northwind”"
  description="Try a different search, or clear the filters to see everything."
  class="w-full max-w-md"
>
<template #actions>
<IButton size="sm" variant="outline">Clear filters</IButton>
</template>
</IEmptyState>
</template>

```vue
<IEmptyState
  :title="`No invoices match “${query}”`"
  description="Try a different search, or clear the filters to see everything."
>
  <template #actions>
    <IButton size="sm" variant="outline" @click="reset()">
      Clear filters
    </IButton>
  </template>
</IEmptyState>
```
</Demo>

## Sizes

`sm` suits an empty panel inside a page that has other content; `lg` suits a page that is empty all the way through.

<Demo stack>
<template #demo>
<IEmptyState size="sm" title="No attachments" description="Drop a file here to attach it." class="w-full max-w-md" />
<IEmptyState size="md" title="No attachments" description="Drop a file here to attach it." class="w-full max-w-md" />
<IEmptyState size="lg" title="No attachments" description="Drop a file here to attach it." class="w-full max-w-md" />
</template>

```vue
<IEmptyState size="sm" title="No attachments" description="Drop a file here to attach it." />
<IEmptyState size="md" title="No attachments" description="Drop a file here to attach it." />
<IEmptyState size="lg" title="No attachments" description="Drop a file here to attach it." />
```
</Demo>

## Icon

An icon is drawn by default. Pass your own, or `:icon="false"` to drop it.

```vue
<IEmptyState :icon="FolderIcon" title="No attachments" />
<IEmptyState :icon="false" title="No attachments" />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The headline |
| `description` | `string` | — | What to do about it |
| `icon` | icon \| `false` | default glyph | Your own icon, or `false` for none |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Overall scale |
| `as` | `string` | `'div'` | Element to render |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root?, icon?, title?, description?, actions? }` | — | Per-element class overrides |

## Slots

| Slot | When to use it |
| --- | --- |
| `icon` | Replaces the icon entirely |
| `title` / `description` | Either needs markup |
| `actions` | Buttons or links along the bottom |

[`ITable`](/components/table) has its own `emptyText` and `#empty` slot for the no-rows case.
