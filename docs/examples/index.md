---
eyebrow: Reference
description: Complete applications built from Iryx UI, kept in the repository so they are read, copied, and broken by the same changes as the library.
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { theme } = useData()
</script>

# Examples

Whole applications rather than single components. Each one lives in the repository, so it is built and type-checked alongside the library and breaks the moment a change breaks it.

## Dashboard

An admin dashboard for a billing product: a shell with navigation that becomes a drawer on a phone, a table with sorting, selection, row actions and pagination, charts, a create form in a drawer, and a settings page with validation.

<div class="mt-6 flex flex-wrap gap-3">
  <IButton as="a" :href="`${theme.repo}/tree/main/examples/dashboard`" target="_blank" rel="noreferrer">
    Read the source
  </IButton>
</div>

### Running it

```bash
git clone https://github.com/therok1/iryx-ui
cd iryx-ui
pnpm install
pnpm --filter @iryx-ui/example-dashboard dev
```

### Copying it out

Two lines exist only because it runs inside this repository: the `iryx-ui` alias in `vite.config.ts`, which points at the library source so a component change shows up without a rebuild, and the `@source` line in `src/style.css`, which scans that same source for utility classes. Delete both and `iryx-ui` resolves to the published package, which is what you want anywhere else.

## Marketing

A product marketing site: a sticky header with a mobile drawer, a hero over an aurora and a ruled grid, feature and stats sections, pricing cards, customer logos, testimonials, an accordion of questions, and a split-screen sign-in page with third-party providers.

<div class="mt-6 flex flex-wrap gap-3">
  <IButton as="a" :href="`${theme.repo}/tree/main/examples/marketing`" target="_blank" rel="noreferrer">
    Read the source
  </IButton>
</div>

### Running it

```bash
git clone https://github.com/therok1/iryx-ui
cd iryx-ui
pnpm install
pnpm --filter @iryx-ui/example-marketing dev
```

### Copying it out

The same two lines are local to this repository: the `iryx-ui` alias in `vite.config.ts` and the `@source` line in `src/style.css`. Delete both and `iryx-ui` resolves to the published package.
