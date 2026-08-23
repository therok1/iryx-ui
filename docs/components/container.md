---
eyebrow: Layout & structure
---

# IContainer

A centred, max-width wrapper with the page's horizontal gutter. Use one per page region instead of repeating `mx-auto max-w-… px-…` by hand.

```vue
<IContainer size="lg">
  <IPageHeader title="Invoices" />
  <ITable :columns="columns" :rows="rows" />
</IContainer>
```

## Sizes

Every size is wider than this column, so the five are drawn to scale against `xl`:

<Demo stack>
<template #demo>
<div class="flex w-full flex-col gap-2 text-xs">
<div v-for="s in [
  { name: 'sm', cap: 'max-w-3xl', px: 768 },
  { name: 'md', cap: 'max-w-5xl', px: 1024 },
  { name: 'lg', cap: 'max-w-6xl', px: 1152 },
  { name: 'xl', cap: 'max-w-7xl', px: 1280 },
]" :key="s.name" class="flex items-center gap-3">
<span class="w-8 shrink-0 font-mono text-muted-foreground">{{ s.name }}</span>
<span class="h-6 rounded border border-border bg-muted" :style="{ width: `${(s.px / 1280) * 100}%` }" />
<span class="shrink-0 font-mono text-muted-foreground">{{ s.px }}px</span>
</div>
<div class="flex items-center gap-3">
<span class="w-8 shrink-0 font-mono text-muted-foreground">full</span>
<span class="h-6 w-full rounded border border-dashed border-border" />
<span class="shrink-0 font-mono text-muted-foreground">no cap</span>
</div>
</div>
</template>

```vue
<IContainer size="sm">…</IContainer>
<IContainer size="xl">…</IContainer>
```
</Demo>

| `size` | Max width |
| --- | --- |
| `sm` | `max-w-3xl` — 768px |
| `md` | `max-w-5xl` — 1024px |
| `lg` | `max-w-6xl` — 1152px |
| `xl` | `max-w-7xl` — 1280px (default) |
| `full` | No maximum; still centres and still takes the gutter |

A container caps a whole page. For a readable line length, constrain the text itself inside one.

## Gutter

The gutter is the horizontal padding that keeps content off the window edge on small screens. `none` is for when the child draws its own — a full-bleed image, or a table that should touch the edges on a phone.

<Demo stack>
<template #demo>
<div class="w-full space-y-2">
<IContainer size="sm" gutter="none" class="border border-dashed border-border py-2"><span class="bg-muted text-xs text-muted-foreground">gutter none</span></IContainer>
<IContainer size="sm" gutter="sm" class="border border-dashed border-border py-2"><span class="bg-muted text-xs text-muted-foreground">gutter sm</span></IContainer>
<IContainer size="sm" gutter="md" class="border border-dashed border-border py-2"><span class="bg-muted text-xs text-muted-foreground">gutter md</span></IContainer>
<IContainer size="sm" gutter="lg" class="border border-dashed border-border py-2"><span class="bg-muted text-xs text-muted-foreground">gutter lg</span></IContainer>
</div>
</template>

```vue
<IContainer gutter="none">
  <img src="/hero.jpg" alt="">
</IContainer>
```
</Demo>

## Inside the app shell

[`IAppShell`](/components/app-shell) sets no width of its own. Put a container inside its main region:

```vue
<IAppShell>
  <template #sidebar>
    <ISidebar :items="sections" />
  </template>

  <IContainer class="py-8">
    <IPageHeader title="Invoices" />
    <ITable :columns="columns" :rows="rows" />
  </IContainer>
</IAppShell>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'` | Maximum width |
| `gutter` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Horizontal padding |
| `as` | `string` | `'div'` | Element to render |
| `asChild` | `boolean` | `false` | Render the child instead, forwarding props |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged with the built-in classes |
| `ui` | `{ root? }` | — | Per-slot class overrides |

The widths come from Tailwind v4's width scale.
