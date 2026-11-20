---
name: iryx-tray-style
description: Build or restyle iryx-ui pages in the "tray" dashboard style (muted trays holding flat white cards, pill controls, rounded popups, top bar + breadcrumb strip, pill sidebar). Use when adding pages to examples/dashboard, restyling an app built on iryx-ui to match it, or when touching radius, trays, stats or the app shell in that style.
---

# Iryx tray style

Reference implementation: `examples/dashboard` (`App.vue`, `components/Tray.vue`, `pages/*.vue`).

## Layout

- **Shell:** `IAppShell` with `scroll="main"`.
  - `#topbar` (`max-md:hidden`): logo, search `IInput`, appearance `IToggleGroup` (plain, icon-only), primary action, account avatar `IDropdownMenu`.
  - `#header`: an `h-11` strip holding the sidebar collapse button and an `IBreadcrumb`, with a "…" button on the right. Keep top and bottom padding equal, and use no `border-b` (Tailwind v4 borders default to currentColor).
  - Shell `ui`: `{ navDrawerBody: 'pt-0', panel: 'md:mt-0' }`.
- **Trays:** `Tray.vue` is a muted panel: `rounded-2xl bg-muted/60 p-1`. Its header is a plain icon and title, `text-sm font-medium`, with no icon wrapper, an `#actions` slot, and `flex-wrap whitespace-nowrap`. The body is `flex gap-1`.
  - Every page section goes in a tray: Overview, Invoices table, Customers grid, Settings form groups.
  - Filters go in the tray's `#actions`, at `size="sm"`.
- **Cards inside trays:** `rounded-xl shadow-none`, with no muted card headers (grey on grey). Avatars on white use `bg-muted`.
- **Nested radius:** inner radius = outer radius − padding.
  - Tray 2xl (16px) with p-1 (4px) gives xl (12px) cards.
  - Popup 2xl with p-1 gives xl items.
- **KPI row:** `xl:grid-cols-[1.15fr_1fr_0.85fr]`.
  - Every card has the same structure: `IStat`, then a separator or bar, then a small `text-xs` list.
  - No footers and no "See details" buttons.
  - `IStat` gets `delta-placement="hint"`, so the trend sits beside the subtext.
- **Donut beside text:**
  - Text column: `min-w-0 flex-1 sm:flex-none sm:basis-3/5`.
  - Donut column: `flex min-w-28 flex-1 justify-center max-sm:hidden`.
  - Set `items-start` on the row, and `IStat :ui="{ row: 'flex-nowrap' }"`.

## Radius

There is one knob, `--iryx-radius`; the whole Tailwind scale derives from it, like shadcn's `--radius`. Do not add per-component radius tokens. We tried that and it broke popups, textareas and calendars.

Get pills per component. tailwind-merge makes the override replace the built-in radius:

- **Button, Input, Select, DatePicker, Combobox:** `class="rounded-full"`.
- **Input with a leading slot:** `:ui="{ root: 'rounded-full' }"`.
- **NumberInput:** `:ui="{ input: 'rounded-full', stepper: 'rounded-e-full' }"`.
- **Pagination and ToggleGroup:** `:ui="{ item: 'rounded-full' }"`.
- **Select and Combobox popups:** `:ui="{ content: 'rounded-2xl', item: 'rounded-xl' }"`.
- **DropdownMenu:** the same, plus `subTrigger: 'rounded-xl', subContent: 'rounded-2xl'`.
- **DatePicker popup:** `content: 'rounded-2xl', cellTrigger: 'rounded-full', nav: 'rounded-full', action: 'rounded-full'`. `action` is the Today button.
- **Sidebar menu for a collapsed group:** `ISidebar :ui="{ menu: { content: 'rounded-2xl', item: 'rounded-xl' } }"`.
- **Textarea and cards:** keep the scale. A textarea is not a pill.

When you add a control, check its popup, items, calendar cells and action buttons too, not just the trigger.

## Sidebar

- `ISidebar v-model:collapsed`, with the width class applied only when expanded (`w-60`). The collapsed width comes from the theme (`w-16`).
- `ui.link`: `rounded-full border border-transparent text-foreground data-[active]:border-border data-[active]:bg-background`, plus `px-3` only when expanded.
- `ui.linkBadge`: a dark circle (`size-5 rounded-full bg-foreground text-background text-[10px]`).
- Use groups with `defaultOpen` for sub-menus, for example Invoices → All / Overdue / Drafts. Sub-links set page state.
- Footer: a promo or statement card using `v-if="!collapsed"` (it hides instantly on collapse) with `min-w-52` so it doesn't squash while expanding. There is no account block; the account menu lives in the top bar.

## Tokens and controls

- `--iryx-border` is softened: light `oklch(0.94 0 0)`, dark `oklch(1 0 0 / 7%)`.
- `IToggleGroup` in single mode can't be deselected. Use `variant="plain"` for spaced pills.

## Checks

Run `pnpm lint` (use `--fix`), vitest, and `vue-tsc` for both the package and `examples/dashboard`. Check light, dark, collapsed and narrow widths in the browser at localhost:5175. Library changes need a changeset.
