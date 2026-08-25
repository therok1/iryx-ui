---
eyebrow: Reference
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { theme } = useData()
</script>

# Components

{{ theme.componentCount }} components, all prefixed `I`. Every one supports `unstyled` and a `class` override; multi-part components take a `ui` prop for per-slot classes.

Anywhere a component takes an `icon`, it accepts either shape: a [Hugeicons](https://hugeicons.com) export, or any component that renders an SVG — [`IIcon`](/components/icon) is what resolves the difference, and you can use it directly.

## Layout & structure

| Component | Description |
| --- | --- |
| [`IApp`](/components/app) | Root wrapper — reactive global config, theme, appearance, RTL/locale |
| [`ICard`](/components/card) | Panel with `outline`/`soft` variants, four paddings, header and footer slots |
| [`IScrollFade`](/components/scroll-fade) | Scroll container whose edges fade while there is more to scroll |
| [`IScrollArea`](/components/scroll-area) | Scroll container with a thin themed scrollbar; scrolling stays native |
| [`ISplitter`](/components/splitter) | Resizable panes with a draggable handle, with saved layouts |
| [`ISeparator`](/components/separator) | Horizontal or vertical rule, optionally with a centred label |
| [`IAppShell`](/components/app-shell) | Page frame — header, sidebar, main and footer slots; scrolls the main column or the page |
| [`ISidebar`](/components/sidebar) | App sidebar — sections, collapsible groups, badges, and a collapse-to-icons mode |
| [`IPageHeader`](/components/page-header) | Page title, description, breadcrumb slot and a right-aligned action row |
| [`IContainer`](/components/container) | Centred max-width wrapper — five widths, four gutters |
| [`IAspectRatio`](/components/aspect-ratio) | Holds a box at a fixed ratio, so loading content cannot shift the page |

## Forms

| Component | Description |
| --- | --- |
| [`IForm`](/components/form) | Validating form wrapper — any Standard Schema validator, or your own function |
| [`IFormField`](/components/form-field) | Label, description, hint, help and error text around a control |
| [`ILabel`](/components/label) | Field label with optional `required` asterisk |
| [`IInput`](/components/input) | Text field with sizes, `invalid` state, affix slots, `clearable`, `loading`, `debounce` |
| [`ITextarea`](/components/textarea) | Multi-line field with matching sizes, `invalid` state and optional `autosize` |
| [`INumberInput`](/components/number-input) | Decimal-safe numeric field — the model is a **string** |
| [`IPasswordInput`](/components/password-input) | Masked field with a show/hide toggle and an optional strength meter |
| [`IPinInput`](/components/pin-input) | One cell per character for a short code — the model is a plain string |
| [`ITagsInput`](/components/tags-input) | Collects a list as removable tags — delimiter, `max`, paste splitting |
| [`IFileUpload`](/components/file-upload) | Drag-and-drop file field with `accept` / `maxSize` / `maxFiles` and thumbnails |
| [`ISignaturePad`](/components/signature-pad) | Drawn signature with undo and clear — the model is a PNG data URL |
| [`ICalendar`](/components/calendar) | Month grid that stays on the page — bounds, availability, several months |
| [`IDateField`](/components/date-field) | Segmented date entry — day, month, year, ordered by locale |
| [`IDatePicker`](/components/date-picker) | Calendar in a popover; the model is an ISO `YYYY-MM-DD` string |
| [`IDateRangePicker`](/components/date-range-picker) | Two-month range calendar; the model is `{ start, end }` ISO strings |
| [`ITimeField`](/components/time-field) | Segmented time entry — the model is a `HH:mm` string |
| [`ICheckbox`](/components/checkbox) | Tri-state checkbox, optional `label` + `description` |
| [`ISwitch`](/components/switch) | Accessible toggle, optional `label` + `description` |
| [`ISlider`](/components/slider) | One value or a range on a single track, with an optional label, live value and min/max scale |
| [`IToggle`](/components/toggle) | A button that stays pressed — one look, sizes and icon padding matching `IButton` |
| [`IToggleGroup`](/components/toggle-group) | A row of toggles sharing one Tab stop — `joined` or `plain`, single or multiple |
| [`IRadioGroup`](/components/radio-group) | Radio list with labels wired up automatically |
| [`ISelect`](/components/select) | Listbox with keyboard nav and typeahead, driven by an `items` array |
| [`ICombobox`](/components/combobox) | Searchable select — filters as you type, with virtualized rows |
| [`IColorPicker`](/components/color-picker) | Saturation plane, hue and opacity ramps, hex field and presets |

## Actions

| Component | Description |
| --- | --- |
| [`IButton`](/components/button) | Four variants, five sizes, `loading`, `block` and `square`, polymorphic via `as` |
| [`IButtonGroup`](/components/button-group) | Joins any children into a segmented control |
| [`IDropdownMenu`](/components/dropdown-menu) | Menu driven by an `items` array, with separators, group labels and submenus |

## Overlays

| Component | Description |
| --- | --- |
| [`ICommandPalette`](/components/command-palette) | Every command behind one shortcut — grouped, searchable, keyboard-driven |
| [`IDialog`](/components/dialog) | Modal with header/body/footer slots, `dismissible` and `showClose` |
| [`IDrawer`](/components/drawer) | Panel or sheet attached to any edge — swipe to dismiss, optional snap points |
| [`IConfirmDialog`](/components/confirm-dialog) | Host for `useConfirm()` — renders the promise-based confirmation |
| [`ITooltip`](/components/tooltip) | Hover/focus tooltip with side, align, delay and optional arrow |
| [`IPopover`](/components/popover) | Panel anchored to its trigger — sides, arrow, optional `modal` focus trap |
| [`IHoverCard`](/components/hover-card) | Hover-summoned preview of what a link points at — delays, sides, arrow |
| [`IContextMenu`](/components/context-menu) | Right-click menu sharing `IDropdownMenu`'s entries and theme |

## Feedback

| Component | Description |
| --- | --- |
| [`IAlert`](/components/alert) | Inline contextual message in four variants |
| [`IBanner`](/components/banner) | Page-level announcement — full-bleed, six variants, sticky or fixed |
| [`IBadge`](/components/badge) | Status pill — five variants × three sizes; `dot` moves the colour onto a dot |
| [`IToaster`](/components/toast) | Host for `useToast()`; six viewport positions, stacking, action buttons |
| [`IProgress`](/components/progress) | Determinate or `indeterminate` bar, six variants, `formatValue` |
| [`ISkeleton`](/components/skeleton) | Loading placeholder — `text`/`rect`/`circle`, stackable with `lines` |
| [`IEmptyState`](/components/empty-state) | Icon, title, description and an `actions` slot for empty lists |

## Navigation

| Component | Description |
| --- | --- |
| [`INavigationMenu`](/components/navigation-menu) | App nav bar with hover-opened panels sharing one animated viewport, horizontal or vertical |
| [`IMenubar`](/components/menubar) | Application menubar — File/Edit/View, hover to swap menus |
| [`IToolbar`](/components/toolbar) | Bar of controls sharing one Tab stop, with arrow-key navigation |
| [`IAccordion`](/components/accordion) | Disclosure list — one panel or several, plain or outline, animated height |
| [`ICollapsible`](/components/collapsible) | One region that opens and closes — the bare disclosure behind `IAccordion` |
| [`ITabs`](/components/tabs) | `solid` or `line` variants with an animated indicator |
| [`IBreadcrumb`](/components/breadcrumb) | Trail from an `items` array; the last crumb is the current page |
| [`IPagination`](/components/pagination) | Page list with ellipsis, edge pages and prev/next controls |
| [`IStepper`](/components/stepper) | Multi-step progress, horizontal or vertical, optional `linear` ordering |

## Data display

| Component | Description |
| --- | --- |
| [`ITable`](/components/table) | Sorting, selection, expansion and per-cell slots, client- or server-driven |
| [`IStat`](/components/stat) | KPI tile — label, value, signed delta with trend colour, and a hint |
| [`IKbd`](/components/kbd) | Keyboard shortcut as chips — `mod` renders ⌘ or Ctrl per platform |
| [`IIcon`](/components/icon) | The shared icon renderer — takes a Hugeicons array or any SVG component |
| [`ITimeline`](/components/timeline) | Ordered run of events — icons, status variants, machine-readable times |
| [`ITree`](/components/tree) | Expandable nested list — selection and expansion as arrays of values |
| [`IAvatar`](/components/avatar) | Person or organisation — initials fallback, five sizes, presence dot |
| [`IAvatarGroup`](/components/avatar-group) | Overlapped stack with a `max` and a "+n" chip |

## Charts

Plain SVG, no charting dependency. They inherit the theme like everything else, so they follow light and dark for free.

| Component | Description |
| --- | --- |
| [`ISparkline`](/components/sparkline) | Tiny inline trend line, sized to whatever box you put it in |
| [`IBarChart`](/components/bar-chart) | Vertical or horizontal, grouped or stacked, round-number axis, hover tooltip |
| [`ILineChart`](/components/line-chart) | Line or area, single or multi-series, with a crosshair and hover marker |
| [`IDonutChart`](/components/donut-chart) | Parts of one whole as a ring or a pie, with the total in the hole |
| [`IChartLegend`](/components/chart-legend) | Standalone legend; shown automatically from two series up |
