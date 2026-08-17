# Components

42 components, all prefixed `I`. Every one supports `unstyled` and a `class` override; multi-part components take a `ui` prop for per-slot classes.

Pages marked with a link are documented in full. The rest are listed here with their props and behaviour covered in the [README](https://github.com/therok1/iryx-ui/blob/main/packages/iryx-ui/README.md) until their page is written.

## Layout & structure

| Component | Description |
| --- | --- |
| `IApp` | Root wrapper — reactive global config, theme, appearance, RTL/locale |
| `ICard` | Panel with `outline`/`soft` variants, four paddings, header and footer slots |
| `ISeparator` | Horizontal or vertical rule, optionally with a centred label |

## Forms

| Component | Description |
| --- | --- |
| `IForm` | Validating form wrapper — any Standard Schema validator, or your own function |
| `IFormField` | Label, description, hint, help and error text around a control |
| `ILabel` | Field label with optional `required` asterisk |
| [`IInput`](/components/input) | Text field with sizes, `invalid` state, affix slots, `clearable`, `loading`, `debounce` |
| `ITextarea` | Multi-line field with matching sizes, `invalid` state and optional `autosize` |
| `INumberInput` | Decimal-safe numeric field — the model is a **string** |
| `IPasswordInput` | Masked field with a show/hide toggle and an optional strength meter |
| `IFileUpload` | Drag-and-drop file field with `accept` / `maxSize` / `maxFiles` and thumbnails |
| `IDatePicker` | Calendar in a popover; the model is an ISO `YYYY-MM-DD` string |
| `IDateRangePicker` | Two-month range calendar; the model is `{ start, end }` ISO strings |
| `ICheckbox` | Tri-state checkbox, optional `label` + `description` |
| `ISwitch` | Accessible toggle, optional `label` + `description` |
| `IRadioGroup` | Radio list with labels wired up automatically |
| `ISelect` | Listbox with keyboard nav and typeahead, driven by an `items` array |
| `ICombobox` | Searchable select — filters as you type, with virtualized rows |

## Actions

| Component | Description |
| --- | --- |
| [`IButton`](/components/button) | Four variants, five sizes, `loading`, `block` and `square`, polymorphic via `as` |
| `IButtonGroup` | Joins any children into a segmented control |
| `IDropdownMenu` | Menu driven by an `items` array, with separators, group labels and submenus |

## Overlays

| Component | Description |
| --- | --- |
| [`IDialog`](/components/dialog) | Modal with header/body/footer slots, `dismissible` and `showClose` |
| [`IDrawer`](/components/drawer) | Panel or sheet attached to any edge — swipe to dismiss, optional snap points |
| `IConfirmDialog` | Host for `useConfirm()` — renders the promise-based confirmation |
| `ITooltip` | Hover/focus tooltip with side, align, delay and optional arrow |

## Feedback

| Component | Description |
| --- | --- |
| `IAlert` | Inline contextual message in four variants |
| `IBanner` | Page-level announcement — full-bleed, six variants, sticky or fixed |
| `IBadge` | Status pill — five variants × three sizes; `dot` moves the colour onto a dot |
| `IToaster` | Host for `useToast()`; six viewport positions, stacking, action buttons |
| `IProgress` | Determinate or `indeterminate` bar, five variants, `formatValue` |
| `ISkeleton` | Loading placeholder — `text`/`rect`/`circle`, stackable with `lines` |
| `IEmptyState` | Icon, title, description and an `actions` slot for empty lists |

## Navigation

| Component | Description |
| --- | --- |
| `ITabs` | `solid` or `line` variants with an animated indicator |
| `IBreadcrumb` | Trail from an `items` array; the last crumb is the current page |
| `IPagination` | Page list with ellipsis, edge pages and prev/next controls |
| `IStepper` | Multi-step progress, horizontal or vertical, optional `linear` ordering |

## Data display

| Component | Description |
| --- | --- |
| [`ITable`](/components/table) | Sorting, selection, expansion and per-cell slots, client- or server-driven |
| `IStat` | KPI tile — label, value, signed delta with trend colour, and a hint |

## Charts

Plain SVG, no charting dependency. They inherit the theme like everything else, so they follow light and dark for free.

| Component | Description |
| --- | --- |
| `ISparkline` | Tiny inline trend line, sized to whatever box you put it in |
| `IBarChart` | Vertical or horizontal, grouped or stacked, round-number axis, hover tooltip |
| `ILineChart` | Line or area, single or multi-series, with a crosshair and hover marker |
| `IChartLegend` | Standalone legend; shown automatically from two series up |

<Demo title="A few of them together" stack>
<template #demo>
<div class="grid w-full gap-4 sm:grid-cols-3">
<IStat label="Revenue" value="€48,200" :delta="12.5" hint="vs. last quarter" />
<IStat label="Invoices" value="1,284" :delta="-3.1" hint="vs. last quarter" />
<IStat label="Overdue" value="€3,940" :delta="0" hint="vs. last quarter" />
</div>
</template>

```vue
<IStat label="Revenue" value="€48,200" :delta="12.5" hint="vs. last quarter" />
```
</Demo>
