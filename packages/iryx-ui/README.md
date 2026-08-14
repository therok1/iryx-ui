# iryx-ui

A Vue 3 component library built on [Reka UI](https://reka-ui.com) and [Tailwind CSS v4](https://tailwindcss.com). Styled by default, headless when you need it, with a Vue plugin and a Nuxt module in one package.

[![npm version](https://img.shields.io/npm/v/iryx-ui.svg)](https://www.npmjs.com/package/iryx-ui)
[![license](https://img.shields.io/npm/l/iryx-ui.svg)](https://github.com/therok1/iryx-ui/blob/main/LICENSE)

## Installation

```bash
pnpm add iryx-ui
```

### Vue 3 (Vite)

```ts
import { IryxUi } from 'iryx-ui'
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(IryxUi).mount('#app')
```

```css
/* main.css */
@import "tailwindcss";
@import "iryx-ui/theme.css";
```

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['iryx-ui/nuxt'],
})
```

```css
/* assets/css/main.css */
@import "tailwindcss";
@import "iryx-ui/theme.css";
```

Components are auto-imported with the `I` prefix (configurable via the `iryxUi.prefix` option).

## Usage

```vue
<template>
  <IButton variant="outline" size="lg">
    Click me
  </IButton>
  <ISwitch v-model="enabled" />
</template>
```

### Icons

Put an icon in the default slot, leading or trailing. Icons are sized to match the button, and any SVG icon set works. Iryx's own icons come from [Hugeicons](https://hugeicons.com), which ships icons as data rather than components:

```vue
<script setup lang="ts">
import { ArrowRight01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
</script>

<template>
  <IButton>
    <HugeiconsIcon :icon="Search01Icon" data-icon="inline-start" /> Search
  </IButton>
  <IButton variant="outline">
    Next <HugeiconsIcon :icon="ArrowRight01Icon" data-icon="inline-end" />
  </IButton>
  <IButton square aria-label="Search">
    <HugeiconsIcon :icon="Search01Icon" />
  </IButton>
</template>
```

Mark the icon with `data-icon="inline-start"` or `"inline-end"` and the padding tightens on the side it sits on. For an icon with no label, add `square`.

Props that take an icon — `IAlert`'s `icon`, and the `icon` on `IDropdownMenu`, `IBreadcrumb`, `ITabs` and `IEmptyState` items — accept **either** a Hugeicons icon or any component that renders an SVG, so an icon set like Lucide still works:

```ts
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Bell } from 'lucide-vue-next'

// Both are valid.
const a = { label: 'Alerts', icon: Alert02Icon }
const b = { label: 'Alerts', icon: Bell }
```

The marker is needed because a label is a bare text node: CSS's `:first-child` and `:last-child` count element children, so an icon beside text matches both. An unmarked icon still renders, it just keeps the full padding.

`IBadge` follows the same convention. When `loading` is set on a button, a spinner takes the leading position automatically.

## The `IApp` wrapper

Wrap your app once to configure everything below it. Unlike the plugin options
(which are read at install time), `IApp`'s props are **reactive** — change them
and every component updates.

```vue
<template>
  <IApp theme="rose" appearance="system" dir="ltr">
    <RouterView />
  </IApp>
</template>
```

It renders **no wrapper element** by default. Pass `as` (plus `class`) if you'd
rather it own your page shell:

```vue
<IApp as="div" class="min-h-screen bg-background text-foreground">
  <RouterView />
</IApp>
```

| Prop | What it does |
| --- | --- |
| `theme` | Applies a preset or custom theme, reactively. Removing it restores the defaults. |
| `appearance` | Startup `light` / `dark` / `system`. A stored user preference wins. Omit it and `IApp` won't touch dark mode at all. |
| `unstyled` | Strips built-in classes from every descendant. |
| `dir` / `locale` / `scrollBody` / `nonce` | Forwarded to Reka UI's `ConfigProvider`, so RTL and locale-aware primitives work. |

Per-component props still win over the app config, so `<IButton :unstyled="false">`
stays styled inside an `<IApp unstyled>`.

`IApp` is optional — the plugin options and `applyTheme()` / `useAppearance()`
still work on their own.

## Appearance (light / dark)

Dark mode is class-based: the `.dark` class on `<html>` flips every token.
The `useAppearance()` composable manages it for you — it persists the choice
and follows the OS preference in `system` mode:

```vue
<script setup>
import { useAppearance } from 'iryx-ui'

const { appearance, isDark, setAppearance, toggleAppearance } = useAppearance()
</script>

<template>
  <IButton variant="ghost" @click="toggleAppearance()">
    {{ isDark ? '🌙' : '☀️' }}
  </IButton>
</template>
```

You can set the startup default via the plugin or Nuxt module (a stored user
preference always wins):

```ts
app.use(createIryxUi({ appearance: 'system' }))
// nuxt.config.ts → iryxUi: { appearance: 'system' }
```

`theme.css` also registers the class-based `dark:` variant for your own
utilities (shadcn-style `@custom-variant dark`).

## Theming

Pick a built-in color preset — `violet` (default) or `rose` — at startup or at
runtime:

```ts
import { applyTheme } from 'iryx-ui'

app.use(createIryxUi({ theme: 'rose' }))
// nuxt.config.ts → iryxUi: { theme: 'rose' }

applyTheme('rose') // runtime, e.g. from a theme picker
```

Or bring your own theme — every token can differ between light and dark:

```ts
applyTheme({
  light: { primary: 'oklch(0.55 0.2 250)', primaryForeground: 'white' },
  dark: { primary: 'oklch(0.68 0.17 250)', primaryForeground: 'oklch(0.15 0.04 250)' },
})
```

For a static re-brand, plain CSS works too — tokens are just variables:

```css
:root {
  --iryx-primary: oklch(0.65 0.2 145); /* make it green */
}
.dark {
  --iryx-primary: oklch(0.75 0.18 145);
}
```

### Typeface

The library ships **no webfont** — that would put font files, a licence and a
network request into every app whether it wanted them or not. It reads one
variable, defaulting to the system stack. Point it at your own family and
everything follows, including Tailwind's `font-sans`:

```css
@import "@fontsource-variable/instrument-sans"; /* or a <link>, or self-hosted */

:root {
  --iryx-font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
}
```

Unlike the colour tokens, this one is not mode-specific — there is no `.dark`
counterpart to keep in sync.

Available tokens, each usable as a Tailwind color (`bg-primary`,
`text-muted-foreground`, …):

| Group | Tokens |
| --- | --- |
| Surfaces | `background`, `foreground`, `accent`, `accent-foreground`, `muted`, `muted-foreground`, `border`, `input` |
| Brand | `primary`, `primary-foreground`, `primary-from`, `primary-to` |
| Status | `success`, `warning`, `danger`, `info` — each with `-foreground`, `-muted`, `-muted-foreground` and `-border` |

`input` is the fill behind the fields — `IInput`, `ITextarea`, `INumberInput`,
the `ISelect` trigger, the `ICombobox` anchor — and behind `IButton`'s
`outline` variant, so the two read as the same kind of surface. It's a token
of its own rather than a reused `muted`, so how raised a control looks can be
tuned without moving every muted surface with it. It matches the page
background in light mode and lifts off it in dark, where the difference is
legible; that split lives in the token values, so no component needs a `dark:`
class for it.

`primary-from` / `primary-to` are the stops of the solid button's vertical
gradient. The status tokens carry their own dark-mode values, so components
never need a `dark:` class for them: `success` is the solid fill,
`success-foreground` the text on it, `success-muted` a tinted surface,
`success-muted-foreground` the text on that, and `success-border` the edge.

The built-in presets swap only the brand colors — red should mean danger in
every theme — but `applyTheme()` accepts the status tokens too:

```ts
applyTheme({
  light: { success: 'oklch(0.6 0.15 150)', successMuted: 'oklch(0.97 0.02 150)' },
  dark: { success: 'oklch(0.7 0.15 150)', successMuted: 'oklch(0.26 0.05 150)' },
})
```

Tweak a single instance with `class` (conflicts are merged smartly) or per-slot with `ui`:

```vue
<IButton class="rounded-full">
Pill button
</IButton>

<ISwitch :ui="{ thumb: 'bg-zinc-900' }" />
```

Or drop all built-in styles and take over completely:

```vue
<IButton unstyled class="my-own-button">
Headless
</IButton>
```

```ts
// …or globally:
app.use(createIryxUi({ unstyled: true }))
```

## Components

**Layout & structure**

| Component | Description |
| --- | --- |
| `IApp` | Root wrapper — reactive global config, theme, appearance, RTL/locale |
| `ICard` | Panel with `outline`/`soft` variants, four paddings, header and footer slots |
| `ISeparator` | Horizontal or vertical rule, optionally with a centred label |

**Forms**

| Component | Description |
| --- | --- |
| `IForm` | Validating form wrapper — any Standard Schema validator, or your own function |
| `IFormField` | Label, description, hint, help and error text around a control |
| `IInput` | Text field with `sm`/`md`/`lg` sizes, `invalid` state, `v-model` |
| `INumberInput` | Decimal-safe numeric field — the model is a **string**, with `min`/`max`/`step`, `precision` and locale-aware display |
| `ITextarea` | Multi-line field with matching sizes and `invalid` state |
| `ILabel` | Field label with optional `required` asterisk |
| `ICheckbox` | Tri-state checkbox (`true` / `false` / `'indeterminate'`), optional `label` + `description` |
| `ISelect` | Listbox with keyboard nav and typeahead, driven by an `items` array, with optional groups |
| `ICombobox` | Searchable select — filters as you type, with optional groups, virtualized rows and a "create from query" row |
| `IRadioGroup` | Radio list with labels wired up automatically; items take a `description` |
| `ISwitch` | Accessible toggle, optional `label` + `description` |

**Actions**

| Component | Description |
| --- | --- |
| `IButton` | Variants (`solid`, `outline`, `ghost`, `link`), five sizes, `loading`, `block` and `square` states, polymorphic via `as` / `asChild` |
| `IButtonGroup` | Joins any children into a segmented control — split buttons, toolbars, pagers |
| `IDropdownMenu` | Menu driven by an `items` array, with separators, group labels, danger items and nested submenus |

**Feedback**

| Component | Description |
| --- | --- |
| `IAlert` | Inline, contextual message in four variants — variant icon, `actions` slot, optional dismiss |
| `IBanner` | Page-level announcement — full-bleed, six variants, sticky top or fixed bottom |
| `IBadge` | Status pill — five variants × three sizes; `dot` moves the colour onto a leading dot |
| `IToaster` | Host for `useToast()`; six viewport positions, stacking, action buttons |
| `IDialog` | Modal with header/body/footer slots, `dismissible` and `showClose` |
| `IConfirmDialog` | Host for `useConfirm()` — renders the promise-based confirmation |
| `IProgress` | Determinate or `indeterminate` bar, five variants, `formatValue` |
| `ISkeleton` | Loading placeholder — `text`/`rect`/`circle`, stackable with `lines` |
| `IEmptyState` | Icon, title, description and an `actions` slot for empty lists |
| `ITooltip` | Hover/focus tooltip with side, align, delay and optional arrow |

**Navigation & data display**

| Component | Description |
| --- | --- |
| `ITabs` | `solid` or `line` variants with an animated indicator, horizontal or vertical |
| `IBreadcrumb` | Trail from an `items` array; the last crumb is marked as the current page |
| `IPagination` | Page list with ellipsis, edge pages and prev/next controls; `align` places it, `size` sets the button scale |
| `IStepper` | Multi-step progress, horizontal or vertical, optional `linear` ordering |
| `IStat` | KPI tile — label, value, signed delta with trend colour, and a hint |
| `ITable` | Data table — sorting, selection, expansion and per-cell slots, client- or server-driven |

Every component supports `unstyled` and a `class` override; multi-part ones take a `ui` prop for per-slot classes.

### Button groups

`IButtonGroup` joins whatever you put inside it — buttons, a menu trigger, a link — squaring the inner edges and collapsing the shared borders. Set `size` once on the group and the buttons inherit it:

```vue
<template>
  <IButtonGroup>
    <IButton @click="save">
      Save
    </IButton>
    <IDropdownMenu :items="saveActions" align="end">
      <template #trigger>
        <IButton square aria-label="More options">
          <ChevronDown />
        </IButton>
      </template>
    </IDropdownMenu>
  </IButtonGroup>
</template>
```

### Menus

`IDropdownMenu` takes entries as data. A `'-'` is a separator, an entry without `onSelect` is a group label, and one with its own `items` opens a submenu — to any depth:

```ts
const items = [
  { label: 'Invoice' },
  { label: 'Open', icon: Search, onSelect: () => open() },
  { label: 'Export as', icon: Download, items: [
    { label: 'PDF', onSelect: () => exportPdf() },
    { label: 'CSV', onSelect: () => exportCsv() },
  ] },
  '-',
  { label: 'Delete', icon: Trash2, danger: true, onSelect: () => remove() },
]
```

### Toasts and confirmations

Both are imperative, so they can be called from anywhere — including plain functions outside a component. Mount each host once, typically just inside `<IApp>`:

```vue
<template>
  <IApp>
    <!-- your app -->
    <IConfirmDialog />
    <IToaster />
  </IApp>
</template>
```

```ts
const toast = useToast()
toast.success('Saved')
toast.danger({ title: 'Failed to send', description: 'Check the address.' })
toast.toast({ title: 'Note deleted', action: { label: 'Undo', onClick: restore } })

const { confirm } = useConfirm()
if (await confirm({ title: 'Delete this draft?', danger: true }))
  await remove()
```

`confirm()` resolves `true` on confirmation and `false` on cancel or dismissal.

### Internationalisation

No English string is baked in without an escape hatch. `IAlert`, `IDialog` and `IToaster` take a `closeLabel`, `IPagination` takes `prevLabel` / `nextLabel` / `label`, `IBreadcrumb` and `ISkeleton` take a `label`, and `IProgress` and `IStat` take `formatValue` / `formatDelta` for locale-aware numbers.

### Forms

```vue
<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const plan = ref('pro')
const framework = ref('vue')
</script>

<template>
  <ILabel for="email" required>
    Email
  </ILabel>
  <IInput id="email" v-model="email" type="email" placeholder="you@example.com" />

  <ILabel class="gap-2">
    <ICheckbox v-model="accepted" /> Accept terms
  </ILabel>

  <ISelect
    v-model="framework"
    placeholder="Pick one"
    :items="['Vue', 'React', { label: 'Angular', value: 'ng', disabled: true }]"
  />

  <IRadioGroup v-model="plan" :items="['free', 'pro']" />
</template>
```

`ISelect` and `IRadioGroup` accept plain strings or `{ label, value, disabled }` objects. Both also take a default slot if you'd rather compose the Reka primitives yourself.

`ISelect` also takes groups — an entry with its own `items` becomes a labelled
heading, the same shape `ICombobox` uses:

```vue
<ISelect
  v-model="framework"
  :items="[
    { label: 'Virtual DOM', items: ['Vue', 'React'] },
    { label: 'Compiled', items: [{ label: 'Svelte', value: 'svelte' }] },
  ]"
/>
```

### Searchable selects

`ICombobox` takes the same `items` as `ISelect` and filters them against what
the user types, which is what you want once a list runs to hundreds of entries.
The field shows the selected option's **label** while the model holds its value.

```vue
<ICombobox
  v-model="clientId"
  :items="clients"
  placeholder="Search clients"
  empty-text="No clients found."
/>
```

Set `create` to offer a row for whatever the user typed when nothing matches.
Choosing it emits `create` with the query and does **not** change the model —
the option doesn't exist yet, so you add it and select it yourself:

```vue
<ICombobox
  v-model="clientId"
  :items="clients"
  create
  :create-label="query => `Add ${query}`"
  @create="query => clients.push({ label: query, value: addClient(query) })"
/>
```

Both `empty-text` and `create-label` are props precisely so a non-English app
never inherits an English string; `empty` and `create` slots take over the
markup entirely if you need more than text.

An entry with its own `items` becomes a labelled group. A group disappears on
its own once nothing inside it matches:

```vue
<ICombobox
  v-model="clientId"
  :items="[
    { label: 'Recent', items: ['Acme Industries', 'Bolt Logistics'] },
    { label: 'Archived', items: [{ label: 'Cirrus Systems', value: 'cirrus' }] },
  ]"
/>
```

For lists in the thousands, `virtual` renders only the rows on screen:

```vue
<ICombobox v-model="sku" virtual :items="fiveThousandItems" :estimate-size="32" />
```

`virtual` and grouped items are **mutually exclusive** — the underlying
virtualizer is a flat window with no notion of group headings, so groups are
flattened and their labels dropped (with a warning in dev). `estimate-size` is
the assumed row height in px, used to size the scrollbar before rows are
measured; set it if you have restyled rows to a different height.

### Numbers and money

`INumberInput` never turns your value into a `number`. The model is a decimal
**string**, because binary floating point cannot represent decimal money —
`0.1 + 0.2` is `0.30000000000000004`, and `10.00` becomes `10`. Values are
added, compared and rounded with `BigInt` internally, so precision survives
regardless of magnitude.

```vue
<script setup lang="ts">
import { ref } from 'vue'

// A string, and it stays one.
const amount = ref('1234.56')
</script>

<template>
  <INumberInput v-model="amount" locale="sl" :precision="2" step="0.01" min="0" />
</template>
```

`locale` affects the **display only** — `sl` shows `1.234,56` while the model
stays `"1234.56"`. Typing in the locale's own format works too. While the field
is focused it shows the canonical value so separators can't fight your typing.

`precision` fixes the number of decimal places, rounding half-up, and preserves
trailing zeros (`"10.00"` stays `"10.00"`). `min`, `max` and `step` are decimal
strings as well, and stepping is exact: `0.1 + 0.2` gives `"0.3"`.

The underlying helpers are exported if you need them elsewhere:

```ts
import { addDecimals, compareDecimals, roundDecimal } from 'iryx-ui'

addDecimals('0.1', '0.2') // '0.3'
roundDecimal('1.005', 2) // '1.01'
compareDecimals('1.10', '1.1') // 0
```

### Validated forms

`IForm` handles client-side validation. It accepts any [Standard Schema](https://standardschema.dev) validator — Zod 3.24+, Valibot, ArkType — so Iryx doesn't depend on a validation library. Wrap each control in an `IFormField` with a `name` matching the schema path and errors wire themselves up.

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email('That doesn\'t look like an email'),
  password: z.string().min(8, 'Use at least 8 characters'),
})

const state = reactive({ email: '', password: '' })

function onSubmit(event) {
  console.log(event.data) // only fires when valid
}
</script>

<template>
  <IForm :state="state" :schema="schema" @submit="onSubmit">
    <IFormField name="email" label="Email" required description="We'll never share it.">
      <IInput v-model="state.email" type="email" />
    </IFormField>
    <IFormField name="password" label="Password" help="At least 8 characters.">
      <IInput v-model="state.password" type="password" />
    </IFormField>
    <IButton type="submit">
      Create account
    </IButton>
  </IForm>
</template>
```

The control inside a field automatically inherits its `id`, invalid styling and `aria-describedby` — no wiring needed. On a failed submit, focus moves to the first invalid control.

**Validation timing** — `validate-on` defaults to `['blur', 'change']`; submit always validates everything.

**Custom rules** — pass `validate` for anything a schema can't express (it runs alongside the schema, and works without one):

```vue
<IForm
  :state="state"
  :validate="s => s.email.endsWith('@corp.com') ? [] : [{ name: 'email', message: 'Must be a work email' }]"
/>
```

**Server errors and manual control** — grab a template ref to the form and call `validate()`, `clear(name?)` or `setErrors()`. `IFormField` also takes a plain `error` prop that bypasses validation entirely.

### Labels and descriptions

`ICheckbox` and `ISwitch` render bare by default. Give them a `label` and/or `description` and they render a wired-up layout instead — the text is clickable, and the description is linked with `aria-describedby`. `IRadioGroup` items take a `description` too.

```vue
<template>
  <ICheckbox
    v-model="accepted"
    label="Accept terms"
    description="You agree to the terms of service and privacy policy."
  />

  <ISwitch
    v-model="notify"
    label="Push notifications"
    description="Send alerts to this device."
  />

  <IRadioGroup
    v-model="plan"
    :items="[
      { label: 'Free', value: 'free', description: 'Up to 3 projects.' },
      { label: 'Pro', value: 'pro', description: 'Unlimited projects.' },
    ]"
  />
</template>
```

Use the `#label` / `#description` slots instead of the props when you need markup (a link, a badge) inside the text.

### Alerts and banners

They look similar and do different jobs, so they're separate components.

**`IAlert` is contextual.** It sits in the flow next to the thing it's about —
a failed upload, a form that won't submit — boxed, with an icon and a title.
Danger and warning variants take `role="alert"` so a screen reader interrupts,
because the user caused it and needs to know now.

**`IBanner` is page-level.** It spans the full width and announces something
that isn't about any one element: a trial ending, scheduled maintenance. It's a
labelled `role="region"`, never an alert — it's ambient, so interrupting
someone mid-task would be wrong.

```vue
<IBanner
  v-model:open="showTrial"
  variant="primary"
  position="top"
  title="Trial ends in 3 days."
  description="Upgrade to keep your data."
  closable
  label="Trial notice"
>
  <template #actions>
    <IButton size="sm" variant="outline">Upgrade</IButton>
  </template>
</IBanner>
```

`position` is `static` (in flow), `top` (sticky) or `bottom` (fixed to the
viewport, with the rule moved to its top edge). `contained` keeps the text at a
readable measure while the fill still spans the window.

Both dismiss through `v-model:open`, so the usual case is one binding instead
of a `close` handler plus a `v-if`. `close` still fires if you need to persist
or confirm first:

```vue
<IAlert v-model:open="visible" variant="danger" title="Upload failed" closable>
  The file was larger than 10 MB.
  <template #actions>
    <IButton size="sm" @click="retry()">Retry</IButton>
  </template>
</IAlert>
```

### Tables

`ITable` takes `rows` and `columns` and renders a real `<table>`. Columns are
plain objects — no render functions — and anything beyond the raw value is a
slot:

```vue
<script setup>
const columns = [
  { key: 'number', label: 'Invoice', sortable: true },
  { key: 'customer.name', label: 'Customer', sortable: true, sortKey: 'customer_name' },
  { key: 'total', label: 'Total', sortable: true, numeric: true },
  { key: 'status', label: 'Status' },
]
</script>

<template>
  <ITable :rows="invoices" :columns="columns" label="Invoices">
    <template #cell-total="{ value }">
      {{ formatMoney(value) }}
    </template>
    <template #cell-status="{ row }">
      <IBadge :variant="row.paid ? 'success' : 'warning'">
        {{ row.paid ? 'Paid' : 'Due' }}
      </IBadge>
    </template>
  </ITable>
</template>
```

`key` doubles as the accessor (dot-notation reaches nested values) and the slot
suffix, so `#cell-customer.name` targets that column. `#header-<key>` replaces a
header the same way.

`numeric` gives a column tabular figures and end alignment, so amounts line up
digit-for-digit down the column instead of wandering with each glyph's width.
Set `align` alongside it to keep the figures but place the column differently.

#### Client or server

**The table never fetches.** It renders what you give it and emits what the
user did, so caching, cancellation and auth stay in your data layer.

Which mode it runs in is decided by one prop. Omit `total` and it sorts and
paginates `rows` itself. Provide `total` and it does neither — the rows you
passed are already the page the server returned, so it only reflects state and
emits changes:

```vue
<ITable
  v-model:sort="sort"
  v-model:page="page"
  :rows="data.rows"
  :columns="columns"
  :total="data.total"
  :loading="pending"
/>
```

Watch those models and refetch. Sorting a column resets `page` to 1, since the
old page number means nothing against a reordered list.

#### State ownership

Every model is optional. Bind one and you own that state — put it in the URL, a
store, or `useState`. Leave it unbound and the table keeps it internally, so the
simple case needs no wiring:

| Model | Type |
| --- | --- |
| `v-model:sort` | `{ key, order } \| null` — `null` is "unsorted", distinct from never-sorted |
| `v-model:page` | `number`, 1-indexed |
| `v-model:perPage` | `number` |
| `v-model:selection` | `(string \| number)[]` of row keys |
| `v-model:expanded` | `(string \| number)[]` of row keys |

#### Selection and expansion

`selectable` adds a checkbox column whose header is tri-state over the rows on
screen. Selection is held as **row keys** (`rowKey`, default `'id'`), and
select-all only touches the current page, so selections made on other pages
survive. `isRowSelectable` vetoes a row — its checkbox is hidden and the header
skips it.

`expandable` adds a disclosure column and renders the `#expanded` slot beneath
an open row; `canExpandRow` vetoes it per row.

```vue
<ITable
  v-model:selection="selected"
  :rows="rows"
  :columns="columns"
  selectable
  expandable
  :is-row-selectable="row => !row.locked"
>
  <template #expanded="{ row }">
    <div class="p-4">{{ row.notes }}</div>
  </template>
</ITable>
```

#### States and props

`loading` sets `aria-busy` and, when there is nothing to show yet, renders
`loadingRows` skeleton rows instead of the empty message. With rows already on
screen it leaves them in place, so a refetch doesn't blank the table. Otherwise
`emptyText` — or the `#empty` slot — takes over.

| Prop | What it does |
| --- | --- |
| `rowKey` | Field identifying a row. Default `'id'` |
| `clickableRows` | Emits `rowClick` and shows a pointer cursor |
| `striped` / `hoverable` / `stickyHeader` | Row and header treatment |
| `size` | `sm` / `md` / `lg` row density |
| `label` / `caption` | Accessible name, and an optional visible caption |

Headers are real `<button>`s, sorted columns carry `aria-sort`, and the table is
a plain `<table>`, so screen readers and keyboard users get the semantics for
free. Give it a `label` (or a `caption`) — a table with no accessible name is
hard to place when tabbing through a page.

#### Without the markup

`useDataTable()` holds the whole state machine — sorting, paging, selection,
expansion — and renders nothing, if you want the logic under your own markup:

```ts
const table = useDataTable({
  rows: () => rows.value,
  columns: () => columns,
})
// table.pageRows, table.toggleSort, table.headerSelection, …
```

## License

[MIT](https://github.com/therok1/iryx-ui/blob/main/LICENSE)
