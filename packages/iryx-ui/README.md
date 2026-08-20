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

Set `--iryx-font-sans` and everything follows, including Tailwind's
`font-sans`. Load the family however you like — a package, a `<link>`, or
self-hosted:

```css
@import "@fontsource-variable/instrument-sans";

:root {
  --iryx-font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
}
```

Leave it unset to use the system stack. There is no `.dark` counterpart for
this one.

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
| `IAppShell` | Page frame — header, sidebar, main and footer slots; scrolls the main column or the page |
| `ISidebar` | App sidebar — sections, collapsible groups, badges, and a collapse-to-icons mode |
| `IPageHeader` | Page title, description, breadcrumb slot and a right-aligned action row |
| `IContainer` | Centred max-width wrapper — five widths, four gutters |
| `ISeparator` | Horizontal or vertical rule, optionally with a centred label |

**Forms**

| Component | Description |
| --- | --- |
| `IForm` | Validating form wrapper — any Standard Schema validator, or your own function |
| `IFormField` | Label, description, hint, help and error text around a control |
| `ILabel` | Field label with optional `required` asterisk |
| `IInput` | Text field with `sm`/`md`/`lg` sizes, `invalid` state, `v-model`, `leading`/`trailing` slots, `clearable`, `loading`, `debounce` |
| `ITextarea` | Multi-line field with matching sizes, `invalid` state and optional `autosize` |
| `INumberInput` | Decimal-safe numeric field — the model is a **string**, with `min`/`max`/`step`, `precision` and locale-aware display |
| `IPasswordInput` | Masked field with a show/hide toggle and an optional strength meter |
| `IFileUpload` | Drag-and-drop file field with `accept` / `maxSize` / `maxFiles`, thumbnails and a remove action |
| `IDatePicker` | Calendar in a popover; the model is an ISO `YYYY-MM-DD` **string** |
| `IDateRangePicker` | Two-month range calendar; the model is `{ start, end }` ISO strings |
| `ICheckbox` | Tri-state checkbox (`true` / `false` / `'indeterminate'`), optional `label` + `description` |
| `ISwitch` | Accessible toggle, optional `label` + `description` |
| `IRadioGroup` | Radio list with labels wired up automatically; items take a `description` |
| `ISelect` | Listbox with keyboard nav and typeahead, driven by an `items` array, with optional groups |
| `ICombobox` | Searchable select — filters as you type, with optional groups, virtualized rows and a "create from query" row |

**Actions**

| Component | Description |
| --- | --- |
| `IButton` | Variants (`solid`, `outline`, `ghost`, `link`), five sizes, `loading`, `block` and `square` states, polymorphic via `as` / `asChild` |
| `IButtonGroup` | Joins any children into a segmented control — split buttons, toolbars, pagers |
| `IDropdownMenu` | Menu driven by an `items` array, with separators, group labels, danger items and nested submenus |

**Overlays**

| Component | Description |
| --- | --- |
| `IDialog` | Modal with header/body/footer slots, `dismissible` and `showClose` |
| `IDrawer` | Panel or sheet attached to any edge — swipe to dismiss, optional snap points |
| `IConfirmDialog` | Host for `useConfirm()` — renders the promise-based confirmation |
| `ITooltip` | Hover/focus tooltip with side, align, delay and optional arrow |

**Feedback**

| Component | Description |
| --- | --- |
| `IAlert` | Inline, contextual message in four variants — variant icon, `actions` slot, optional dismiss |
| `IBanner` | Page-level announcement — full-bleed, six variants, sticky top or fixed bottom |
| `IBadge` | Status pill — five variants × three sizes; `dot` moves the colour onto a leading dot |
| `IToaster` | Host for `useToast()`; six viewport positions, stacking, action buttons |
| `IProgress` | Determinate or `indeterminate` bar, five variants, `formatValue` |
| `ISkeleton` | Loading placeholder — `text`/`rect`/`circle`, stackable with `lines` |
| `IEmptyState` | Icon, title, description and an `actions` slot for empty lists |

**Navigation**

| Component | Description |
| --- | --- |
| `INavigationMenu` | App nav bar with hover-opened panels sharing one animated viewport, horizontal or vertical |
| `ITabs` | `solid` or `line` variants with an animated indicator, horizontal or vertical |
| `IBreadcrumb` | Trail from an `items` array; the last crumb is marked as the current page |
| `IPagination` | Page list with ellipsis, edge pages and prev/next controls; `align` places it, `size` sets the button scale |
| `IStepper` | Multi-step progress, horizontal or vertical, optional `linear` ordering |

**Data display**

| Component | Description |
| --- | --- |
| `ITable` | Data table — sorting, selection, expansion and per-cell slots, client- or server-driven |
| `IStat` | KPI tile — label, value, signed delta with trend colour, and a hint |

**Charts** — pure SVG, no charting dependency; see [Charts](#charts)

| Component | Description |
| --- | --- |
| `ISparkline` | Tiny inline trend line, sized to whatever box you put it in |
| `IBarChart` | Bar chart — vertical or horizontal, grouped or stacked, with a round-number axis and a hover tooltip |
| `ILineChart` | Line or area chart, single or multi-series, with a crosshair and hover marker |
| `IChartLegend` | Standalone legend; shown automatically from two series up |

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

### Page layout

`IAppShell` is a frame and nothing more: it owns the scroll and stacking behaviour, and every region is a slot, so the sidebar, top bar and footer stay yours.

```vue
<template>
  <IAppShell>
    <template #header>
      <header class="flex h-14 items-center border-b border-border px-4">
        <INavigationMenu :items="nav" />
      </header>
    </template>

    <template #sidebar>
      <ISidebar v-model:collapsed="collapsed" :items="sections" />
    </template>

    <IContainer class="py-8">
      <IPageHeader title="Invoices" description="Everything you have sent this year." bordered>
        <template #actions>
          <IButton>New invoice</IButton>
        </template>
      </IPageHeader>
    </IContainer>
  </IAppShell>
</template>
```

`scroll` picks between the two layouts, and they are genuinely different rather than cosmetic. The default, `"main"`, pins the shell to the viewport and scrolls only the content column — the header and sidebar never move, which is what a data-heavy app wants. `scroll="page"` scrolls the document instead, with a sticky header and sidebar; that is the one anchor links and the browser's own scroll restoration work with, so content and marketing pages want it. `sidebar-position="right"` flips the columns without touching the slot order.

`ISidebar` takes links, optionally grouped into sections. A section carries its heading under `section`; a link with its own `items` becomes a collapsible group:

```ts
const sections = [
  { section: 'Workspace', items: [
    { label: 'Overview', href: '/', icon: HomeIcon, active: true },
    { label: 'Inbox', href: '/inbox', icon: InboxIcon, badge: 12 },
  ] },
  { section: 'Billing', items: [
    { label: 'Invoices', icon: FileIcon, defaultOpen: true, items: [
      { label: 'Drafts', href: '/invoices/drafts' },
      { label: 'Sent', href: '/invoices/sent' },
    ] },
  ] },
]
```

The heading key is `section`, not `label`, because a collapsible group carries `items` too — sharing one key would mean guessing which of the two an entry is, and an icon-less group would quietly render as a heading.

A group animates open by height rather than fading in place, using the measurement Reka publishes as `--reka-collapsible-content-height` — `height: auto` cannot be tweened. The rows lift and fade in on their own, slightly slower curve, so they arrive under their own steam instead of being uncovered by a moving mask. Two consequences worth knowing before restyling it:

- The animated element carries **no margin or padding** — those live on an inner wrapper reached through `ui.groupInner`. Margin is not part of an animated height, so left on the outer it survives the close as a gap under a shut panel.
- Child rows are indented by arithmetic, not a chosen value: the rule sits on the centre of the parent's icon and a child's label lands in the parent's label column. Hand-picked padding lands a few pixels out, which reads as a mistake rather than as either alignment.

`v-model:collapsed` switches to icons only. It narrows rather than hides, because a sidebar that vanishes costs the reader their place in the hierarchy; on small screens the answer is `IDrawer`, not a narrower sidebar. Labels are `hidden` in that state rather than visually hidden, so they surrender their width and the icons actually centre — every link carries an `aria-label`, so nothing is lost to screen readers.

`IPageHeader` puts the title and the action row on one line from `sm` up and stacks them below it, and `IContainer` is the shared reading measure — `size` from `sm` to `full`, `gutter` for the horizontal padding.

### Navigation menus

`INavigationMenu` is the app's top-level nav bar. Entries are data, and the same rule `IDropdownMenu` uses decides the shape: an entry with its own `items` becomes a panel trigger, everything else is a plain link.

```vue
<script setup lang="ts">
const items = [
  { label: 'Overview', href: '/', active: true },
  {
    label: 'Product',
    columns: 2,
    items: [
      { label: 'Invoicing', href: '/invoicing', icon: FileIcon, description: 'Send and track invoices.' },
      { label: 'Reporting', href: '/reporting', icon: ChartIcon, description: 'Revenue over time.' },
    ],
  },
  { label: 'Docs', href: 'https://example.com/docs', target: '_blank' },
]
</script>

<template>
  <INavigationMenu :items="items" label="Main" />
</template>
```

Every panel shares one viewport, so moving between triggers resizes and slides a single surface rather than swapping popups. `columns` widens a panel's grid — set it on the menu for all panels, or on one entry to override it there.

An entry without `href` renders a `<button>` and calls `onSelect`, which is what a router link wants; `active` marks the current page for both styling and `aria-current`. Set `orientation="vertical"` to stack the entries and open panels to the side, and `disable-hover-trigger` to require a click on touch-first apps.

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

### Drawers and sheets

`IDrawer` is a panel attached to an edge of the viewport. It shares `IDialog`'s slots — `trigger`, `header` / `title` / `description`, the default body slot and `footer` (which receives `close`) — plus `dismissible`, `showClose` and `closeLabel`:

```vue
<IDrawer v-model:open="filtersOpen" title="Filters" description="Narrow the list down.">
  <IInput v-model="search" placeholder="Reference or name" clearable />
  <template #footer="{ close }">
    <IButton variant="outline" @click="close()">
      Reset
    </IButton>
    <IButton @click="close()">
      Apply
    </IButton>
  </template>
</IDrawer>
```

`side` picks the edge — `right` (default), `left`, `top` or `bottom` — and doubles as the direction you drag to dismiss. `size` means width on a `left`/`right` drawer and maximum height on a `top`/`bottom` sheet, so `sm`–`xl` and `full` read naturally either way. A sheet gets a drag handle by default and a side drawer does not; `handle` overrides that in both directions.

Add `snapPoints` for a sheet that rests part-way. Points are fractions of the viewport (`0.45`), pixel numbers, or CSS lengths (`'20rem'`), and `v-model:snapPoint` reads or sets the current one:

```vue
<IDrawer
  v-model:open="open"
  v-model:snap-point="snap"
  side="bottom"
  :snap-points="[0.45, 1]"
  title="Payment method"
/>
```

Snap points position the panel by translating it rather than resizing it, so `size` stops capping the height when they are set — otherwise the fully expanded state would be clipped instead of parked below the fold.

`modal` controls how much of the page the drawer takes over: `true` (default) traps focus and blocks everything behind it, `'trap-focus'` keeps the page interactive while still holding the Tab ring — what a persistent side panel wants — and `false` does neither.

Dragging is real pointer work, so it only happens in a browser. The panel follows the finger, snaps back when the drag is too short, and dismisses when it is not; `dismissible: false` refuses the swipe along with Escape and the overlay, while the corner button still closes.

### Internationalisation

No English string is baked in without an escape hatch. `IAlert`, `IDialog`, `IDrawer` and `IToaster` take a `closeLabel`, `IPagination` takes `prevLabel` / `nextLabel` / `label`, `IBreadcrumb` and `ISkeleton` take a `label`, and `IProgress` and `IStat` take `formatValue` / `formatDelta` for locale-aware numbers.

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

#### Input affixes, clearing, loading and debounce

`IInput` renders its chrome on a wrapper element, so `leading` and `trailing`
slot content sits *inside* the field and takes real space — a long value is
truncated by the affix rather than sliding underneath it.

```vue
<IInput v-model="search" clearable placeholder="Search invoices…">
  <template #leading>
    <HugeiconsIcon :icon="Search01Icon" />
  </template>
</IInput>

<IInput v-model="team" placeholder="your-team">
  <template #trailing>
    <span class="text-sm">.example.com</span>
  </template>
</IInput>

<!-- Spinner in the trailing area; the field stays editable. -->
<IInput v-model="slug" :loading="checking" />

<!-- The model updates 500ms after the last keystroke. -->
<IInput v-model="query" :debounce="500" clearable />
```

| Prop | Effect |
| --- | --- |
| `clearable` | Clear button in the trailing area whenever the field is non-empty |
| `loading` | Spinner in the trailing area. Does **not** disable the field |
| `debounce` | Milliseconds to wait after the last keystroke before the model updates. `0` (default) updates on every keystroke |
| `clearLabel` | Accessible name for the clear button, for non-English apps |

The displayed text always updates on the keystroke — only the model lags. Blur
and Enter flush a pending update immediately, so a submit never reads a stale
value, and an external write (a reset or prefill) cancels whatever is queued.

`class` lands on the wrapper, since that is the element carrying the field
chrome; use `ui` to reach the parts (`root`, `input`, `leading`, `trailing`,
`clear`). Stray attributes like `name`, `autocomplete` and `maxlength` are
forwarded to the `<input>` itself. `ref` exposes the element as `.input` for
focus management.

#### Files

```vue
<script setup lang="ts">
import { ref } from 'vue'

const logo = ref<File[]>([])
</script>

<template>
  <IFileUpload
    v-model="logo"
    accept="image/*"
    :max-size="2 * 1024 * 1024"
    label="Drag your logo here"
    browse-label="Browse images"
    hint="PNG, JPG or SVG up to 2 MB"
    @reject="onReject"
  />
</template>
```

The model is **always a `File[]`**, even without `multiple` — a `File | File[]`
union would make every caller narrow the type before touching it, and the
single case is just an array holding at most one. Without `multiple`, picking
again replaces rather than appends.

| Prop | Effect |
| --- | --- |
| `multiple` | Accept more than one file |
| `accept` | Native syntax: `image/*`, `.pdf`, `image/png` |
| `maxSize` | Largest accepted size, in bytes |
| `maxFiles` | Cap on how many files may be held at once |
| `label` | Prompt in the zone, above the hint |
| `browseLabel` | Text on the browse button |
| `hint` | Fine print under the prompt — the accepted types belong here |

Every string is a prop, including `removeLabel` and the three rejection
messages, so nothing bakes in English.

`accept` is enforced in the component as well as on the input, because a
dragged-in file bypasses the native filter entirely. Refused files raise
`@reject` with `{ file, reason }` — `'type'`, `'size'` or `'count'` — so you
can word your own message; the built-in text is available through the
`tooLargeText`, `wrongTypeText` and `tooManyText` props.

Image files get a thumbnail, anything else a placeholder of the same size so
rows stay aligned. The object URLs behind those thumbnails are revoked as soon
as a file leaves the list or the component unmounts.

#### Dates

The model is an ISO `YYYY-MM-DD` **string**, never a `Date`.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const issuedOn = ref<string | null>('2026-08-15')
const period = ref({ start: '2026-08-01', end: '2026-08-31' })
</script>

<template>
  <IDatePicker v-model="issuedOn" clearable />
  <IDateRangePicker v-model="period" clearable />
</template>
```

A `Date` is a timestamp, so it always carries a time zone. `new Date('2026-08-15')`
parses as UTC midnight, and a user west of Greenwich formatting it locally sees
the 14th — which silently moves a record into the wrong reporting period. A
calendar date has no zone, so it stays the day you picked. Internally the
components use `@internationalized/date`; that never reaches your model, so
formatting the string with `dayjs` or anything else on the way out is fine.

| Prop | Effect |
| --- | --- |
| `min` / `max` | Selectable bounds, as ISO strings |
| `locale` | Month names, weekday initials, and the trigger's text |
| `format` | `Intl.DateTimeFormatOptions` for the trigger, e.g. `{ dateStyle: 'full' }` |
| `weekStartsOn` | `0` is Sunday. Defaults to the locale's convention |
| `clearable` | Adds a clear action to the footer |
| `months` | Range picker only — months side by side, default `2` |
| `separator` | Range picker only — text between the two dates |

Navigation and footer labels (`todayLabel`, `clearLabel`, `previousLabel`,
`nextLabel`) are all props, so nothing bakes in English.

Both render their calendar at a fixed six weeks, so a short month cannot stretch
its rows to match a taller neighbour and the popover does not resize as you page
through it. The range picker draws only the committed range — the days between
the endpoints take a flat tint while the two ends take the solid fill, so a long
span still shows where it begins and ends.

The helpers behind them are exported, for formatting the same values elsewhere:

```ts
import { formatIsoDate, isoToday, toCalendarDate, toIsoDate } from 'iryx-ui'

formatIsoDate('2026-08-15', 'en-GB', { dateStyle: 'long' }) // '15 August 2026'
formatIsoDate('nonsense') // '' — malformed input is "no selection", not a crash
```

#### Passwords

`IPasswordInput` is `IInput` with a reveal toggle in the trailing area, plus an
optional four-segment strength meter.

```vue
<IPasswordInput v-model="password" strength />

<!-- Toggle only, no meter -->
<IPasswordInput v-model="password" />

<!-- No toggle either -->
<IPasswordInput v-model="password" :toggle="false" />
```

The score counts length (8 and 12 characters), mixed case, a digit and a
symbol, capped at four. It is a deliberately transparent nudge toward better
passwords, **not** a security control — enforce real policy in the `IForm`
validator, where it can actually reject a value.

Every string is overridable, since components must not bake in English:

```vue
<IPasswordInput
  v-model="password"
  strength
  show-label="Afficher le mot de passe"
  hide-label="Masquer le mot de passe"
  :strength-labels="['Faible', 'Moyen', 'Bon', 'Fort']"
/>
```

`class` lands on the wrapper that stacks the field above the meter; `ui` reaches
`root`, `input`, `toggle`, `meter`, `track`, `segment` and `label`.

#### Autosizing textareas

```vue
<!-- Grows without limit -->
<ITextarea v-model="note" autosize />

<!-- Between 2 and 8 rows, then scrolls -->
<ITextarea v-model="note" :autosize="{ min: 2, max: 8 }" />
```

`autosize` overrides `rows` and drops the drag handle, since the measured
height is the point. The field shrinks as well as grows, and re-measures when
the model changes from outside — a reset or a prefill resizes correctly.

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

Where a component has no visible label — a search field, a bare select — put `aria-label` on it directly. Attributes always land on the control the label belongs to, not on whatever wrapper the component happens to render around it:

```vue
<template>
  <IInput v-model="q" aria-label="Search invoices" />
  <ISelect v-model="status" :items="statuses" aria-label="Filter by status" />
  <INumberInput v-model="amount" aria-label="Amount" />
</template>
```

The same holds for `name`, `autocomplete`, `maxlength` and `data-*`. `IProgress` is the one that needs saying twice: its `label` prop renders visible text *and* names the bar for assistive tech, so pass `aria-label` only when there is no visible label to use.

An automated axe sweep runs over every component on each commit. It is a floor rather than a guarantee — it catches roughly a third of real barriers, and contrast rules need a real browser — but nothing ships with an unlabelled control or a nested interactive element.

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

### Charts

A small set of chart types done properly, in plain SVG — no charting
dependency, nothing to register, and no canvas. They inherit the theme the
same way every other component does, so they follow light/dark and any token
override for free. For the exotic five percent, reach for Chart.js; that is
the intended escape hatch, not a gap.

Every chart is `aria-hidden` with a screen-reader table carrying the numbers,
and that table renders before measurement — the data is never gated behind
layout.

#### Sparklines

A trend at a glance, for a stat tile or a table cell.

```vue
<ISparkline
  :data="[4200, 4600, 4100, 5200, 5800, 6300]"
  variant="area"
  end-dot
  label="Revenue over six months, trending up"
/>
```

Because it is SVG, colour comes from `currentColor`: recolour it with a text
utility, and it follows your theme preset and light/dark automatically with no
JavaScript. A canvas chart cannot read CSS variables, so it would need a
re-render on every theme change.

| Prop | Effect |
| --- | --- |
| `data` | Values, oldest first. `null` is a **gap**, not a zero — the line breaks |
| `variant` | `line` (default) or `area`, which adds a wash beneath the line |
| `endDot` | Marks the most recent point |
| `baseline` | Lower edge of the `area` wash: `min` (default) or `zero` |
| `min` / `max` | Pin the domain — set both to put several sparklines on one scale |
| `muted` | Draw in muted ink, for a de-emphasised trend |
| `height` | Rendered height in px (default 32). Width always fills the container |

Width is fluid and the stroke never distorts: the drawing stretches via
`preserveAspectRatio="none"`, while every stroke carries
`vector-effect="non-scaling-stroke"`, so a 2px line stays 2px and the end dot
stays circular at any aspect ratio.

`label` sets an accessible description. **Without one the sparkline is hidden
from assistive tech as decorative** — which is correct when it sits beside a
value that already states the number, and wrong if it is the only thing
carrying the information.

Edge cases behave: an empty series draws nothing, a flat series draws through
the middle rather than collapsing to an edge, and a single reading is a dot.

The scale helpers are exported for building your own marks:

```ts
import { extent, linearScale } from 'iryx-ui'

extent([3, null, 9, 1]) // [1, 9] — gaps ignored
linearScale([0, 10], [100, 0])(10) // 0 — ranges may be inverted for SVG's y-axis
```

#### Line charts

```vue
<ILineChart
  :data="[
    { label: 'Jan', value: 4200 },
    { label: 'Feb', value: null },
    { label: 'Mar', value: 5600 },
  ]"
  variant="area"
  label="Revenue by month"
/>
```

Same `data`, `height`, `ticks`, `axis`, `locale`, `format` and `label` props as
`IBarChart`, plus:

| Prop | Effect |
| --- | --- |
| `variant` | `line` (default) or `area`, which adds a wash beneath the line |
| `zero` | Force zero onto the axis. **Off by default** |

**`zero` is off here and always on for bars, deliberately.** A bar is read by
length, so a truncated baseline lies about the comparison. A line is read by
its *shape*, and a series hovering around 8,000 flattens into a straight edge
once the axis starts at nothing. Turn it on when the distance from zero is the
point.

`null` breaks the line rather than bridging it, so a missing reading never
draws a slope that didn't happen.

Hovering shows a crosshair and a single ringed marker on the reading under the
cursor — not a dot on every point, which is noise the axis and tooltip already
cover.

#### Bar charts

```vue
<IBarChart
  :data="[
    { label: 'Jan', value: 4200 },
    { label: 'Feb', value: 5600 },
    { label: 'Mar', value: null },
  ]"
  label="Revenue by month"
  locale="de-DE"
  :format="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
/>
```

| Prop | Effect |
| --- | --- |
| `data` | `{ label, value }[]`. `value: null` is a **missing reading** — no bar, which is not a zero |
| `height` | Rendered height in px (default 240). Width fills the container |
| `ticks` | Target tick count. A hint — the axis lands on round numbers first |
| `axis` | Set `false` to drop the value axis and gridlines |
| `locale` / `format` | `Intl.NumberFormat` settings, applied to ticks and tooltip alike |
| `label` | Accessible name for the figure |

**The axis picks the domain, not the data.** Values are snapped outwards to a
1/2/5 step, so an axis reads `0 / 2,000 / 4,000` rather than `0 / 1,726.8`.
Zero is always included, because bars are compared by length and a truncated
baseline makes that comparison a lie.

Bars are capped at 24px and never fill their slot — the gap between them is
what separates them. They're rounded at the data end and square at the
baseline, so the rounding reads as the tip of the value.

Hovering a bar dims the rest and shows a tooltip; hit targets span the full
band and plot height, so a short bar is no harder to hit than a tall one.

**Accessibility:** the SVG is `aria-hidden` and the data is exposed as a
visually-hidden table instead, so a screen reader gets the actual numbers
rather than a blank graphic. That table renders even before the container has
been measured — the data is never gated behind layout.

**`stacked`** turns grouped series into one bar per category:

```vue
<IBarChart :data="cashflow" :series="series" stacked label="Cashflow" />
```

Stacking answers *"what makes up the total"*; grouping answers *"how do these
compare"*. Only the bottom segment shares a baseline, so segments above it are
hard to compare across categories — stay with grouped bars when the comparison
matters more than the total.

The axis is sized against the running totals, only the outermost segment is
rounded, and the tooltip adds a **Total** row (`totalLabel` to rename it).
Negative values stack downward from zero rather than cancelling positives out,
so a mixed stack shows both sides at full length. Stacking is ignored for a
single series, and works horizontally too.

**`orientation="horizontal"`** runs the categories down the side:

```vue
<IBarChart :data="spend" orientation="horizontal" label="Spend by category" />
```

Vertical charts thin colliding labels to every *n*th, which is fine for `Jan`
/ `Feb` and lossy for `Travel and accommodation`. Turn the chart and the names
get real width, so nothing is dropped — that's the case horizontal is for.
Everything else behaves the same: grouped series, the tooltip, the round-number
axis anchored at zero.

#### Multiple series

Both charts take plain rows plus a `series` descriptor — the same shape
`ITable` uses. Omit `series` for the single-measure case.

```vue
<IBarChart
  :data="[
    { label: 'Jan', revenue: 4200, expenses: 3100 },
    { label: 'Feb', revenue: 5600, expenses: 3400 },
  ]"
  :series="[
    { key: 'revenue', name: 'Revenue', slot: 0 },
    { key: 'expenses', name: 'Expenses', slot: 1 },
  ]"
  label="Cashflow by month"
/>
```

Bars group inside their category; lines draw one path each. One hover reports
**every** series for that category in a single tooltip, so the reader compares
in one place instead of chasing marks.

**`slot` pins a series to a palette colour.** Without it, colour follows array
position — so filtering a series out repaints the survivors and the reader has
to relearn the chart. Pin the slots whenever series can be toggled.

**The legend is mandatory from two series up.** `legend: false` only silences
the single-series case, where the title already names what is plotted. Colour
alone is never a dependable identity channel, so this is not configurable.

Past eight series the colours stop identifying anything; the chart warns in
development and you should fold the tail into "Other" or switch to small
multiples.

`variant="area"` is ignored for multiple series — overlapping washes muddy into
a colour that belongs to neither.

#### Chart colours

Eight categorical slots, `--iryx-chart-1` … `--iryx-chart-8`, usable as Tailwind
colours (`text-chart-3`, `fill-chart-5`). They encode **identity** — which
series a mark belongs to — never magnitude.

```vue
<!-- One series per slot, assigned in order. -->
<ISparkline :data="revenue" class="text-chart-1" />

<ISparkline :data="expenses" class="text-chart-2" />
```

Three rules, and they are not stylistic:

- **Assign in order, never cycle.** A ninth series is not a generated ninth
  hue — fold it into "Other", or switch to small multiples. A generated colour
  hasn't been checked for separation against its neighbours.
- **Status colours are never series colours.** A series that happens to land in
  slot 4 must not read as a warning. `success`/`warning`/`danger`/`info` stay
  reserved.
- **Colour follows the entity, not its rank.** If a filter removes a series,
  the survivors keep their slots rather than shifting up.

Tailwind scans source text, so a class name assembled at runtime is never
generated — write the slots out, or reach for the variable:

```vue
<!-- Silently unstyled: Tailwind never sees this string -->
<ISparkline :class="`text-chart-${index + 1}`" />

<!-- Either of these works -->
<ISparkline :class="['text-chart-1', 'text-chart-2'][index]" />

<ISparkline :style="{ color: `var(--iryx-chart-${index + 1})` }" />
```

The steps are not eyeballed. Each clears a lightness band, a chroma floor, and
protanopia/deuteranopia separation against its own surface, checked with a
validator rather than by eye. **Dark has its own steps**, validated against the
dark background — not an automatic flip of the light ones.

Two caps worth knowing before you design around them:

| Chart form | Max series |
| --- | --- |
| Bars, lines, stacks — only neighbours touch | **8** |
| Scatter, bubble, small multiples — any two marks can sit side by side | **3** |

Past those, the answer is fewer series or facets, not more colours. If you
re-step any slot, re-run the validator for **both** modes.

#### Annotations, and why there is no plugin API

Chart.js has plugins because canvas is opaque — once painted you cannot select
or style anything, so the only way in is an imperative draw hook. SVG has no
such problem, so these charts hand you the layout and let you write ordinary
markup into it:

```vue
<ILineChart :data="revenue" label="Revenue against target">
  <template #overlay="{ plot, value }">
    <line
      :x1="plot.left" :y1="value(7000)"
      :x2="plot.left + plot.width" :y2="value(7000)"
      stroke="var(--iryx-warning)" stroke-width="2" stroke-dasharray="4 4"
    />
  </template>
</ILineChart>
```

`#underlay` renders behind the marks — target bands, shaded regions. `#overlay`
renders in front — reference lines, callouts. Both sit below the hit targets,
so hovering keeps working through whatever you draw.

Both receive the `CartesianLayout`:

| Prop | What it gives you |
| --- | --- |
| `plot` | `{ left, top, width, height }` of the plot rectangle, in px |
| `value(n)` | A data value to its pixel on the value axis |
| `bandCentre(i)` | The centre of category `i`, in px |
| `bandWidth` | Size of one category slot |
| `ticks` | The axis values actually drawn |
| `orientation` | `'vertical'` or `'horizontal'` |

That's strictly more capable than a draw hook: it's declarative, reactive, and
type-checked, with no lifecycle or registration order to learn.

For a chart type that doesn't exist here, the same primitives are exported —
`cartesianLayout`, `linearScale`, `niceTicks`, `seriesColor` — so you can build
one on the same spine rather than starting over.

## License

[MIT](https://github.com/therok1/iryx-ui/blob/main/LICENSE)
