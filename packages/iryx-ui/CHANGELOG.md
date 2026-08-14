# iryx-ui

## 0.5.0

### Minor Changes

- f47e510: Soften the shared corner radius. Buttons, fields, cards, alerts, dialogs, menus, tabs, toasts, tooltips and the rest move from `rounded-lg` to `rounded-xl`, so surfaces and the controls sitting on them agree. Purely visual — no API changes.

  The `outline` button now sits on `--iryx-input` rather than `--iryx-background`, joining the fields as a recessed control. That token is flat in light mode and lifted in dark, where the lift is legible, which keeps mode-specific classes out of components.

- be35646: **Breaking:** the `emerald`, `amber` and `sky` theme presets are gone. `themes` now exports only `violet` (the default) and `rose`, and `ThemePresetName` narrows to match — passing a removed name to `applyTheme()`, `IApp`'s `theme` prop, or the plugin and Nuxt module options is now a type error. Custom themes are unaffected: any palette can still be supplied as a `Theme` object with per-mode tokens.
- 0efd6b9: Add `ICombobox`, a searchable select for lists too long to scroll. It takes the same `items` as `ISelect`, filters them as you type, and shows the selected option's label while the model holds its value. Set `create` to offer a row for an unmatched query — choosing it emits `create` with the query rather than selecting it, so the caller decides what the new option's value is. `emptyText` and `createLabel` are props so no English string is baked in.

  An entry with its own `items` becomes a labelled group, which hides itself once nothing in it matches. `virtual` renders only the rows on screen for lists in the thousands; it flattens groups, since the underlying virtualizer is a flat window, and takes `estimateSize` and `overscan`.

  `ICheckbox`, `ISwitch` and `IRadioGroup` items now show the focus ring on any focus, not just keyboard focus, matching what `IInput` does when clicked. `ISwitch`'s offset outline is replaced by that same ring.

## 0.4.0

### Minor Changes

- Add `INumberInput`, and drop the label indent.

  **`INumberInput`** — a numeric field whose model is a decimal **string**, never a `number`. Binary floating point cannot represent decimal money (`0.1 + 0.2` is `0.30000000000000004`, and `10.00` collapses to `10`), so values are added, compared, clamped and rounded with `BigInt` internally and precision survives at any magnitude.

  - `min` / `max` / `step` are decimal strings; stepping is exact.
  - `precision` fixes the scale, rounding half-up and keeping trailing zeros.
  - `locale` changes the **display** only — `sl` renders `1.234,56` while the model stays `"1234.56"` — and typing in the locale's format is accepted. The field shows the canonical value while focused so separators don't fight typing.
  - Renders a text field with `inputmode="decimal"` and `role="spinbutton"` rather than `type="number"`, which would strip precision and reformat the value.

  The decimal helpers are exported too: `addDecimals`, `compareDecimals`, `roundDecimal`, `clampDecimal`, `parseDecimal`, `formatForLocale`, `parseFromLocale`.

  **Removed:** the label indent added in 0.3.0. `ILabel` and `IFormField` no longer inset their text, and the `indent` prop is gone — it read oddly next to the rest of the components.

## 0.3.0

### Minor Changes

- Add the remaining wishlist components, and fix three animation issues.

  **New components**

  - `IButtonGroup` — joins any children into a segmented control, squaring the inner edges and collapsing shared borders. Covers split buttons, toolbars and pagers; set `size` once and the buttons inherit it.
  - `IDropdownMenu` — driven by an `items` array, with separators, group labels, danger items and nested submenus to any depth.
  - `IEmptyState`, `IProgress`, `IDialog` + `useConfirm()`, `IToaster` + `useToast()`.
  - `ISeparator`, `ISkeleton`, `IStat`, `IBreadcrumb`, `ITooltip`, `ITabs`, `IPagination`, `IStepper`.

  **Buttons and badges**

  - Padding tightens on the side an icon sits on. Mark the icon with `data-icon="inline-start"` or `"inline-end"`; a loading spinner marks itself.
  - `square` prop for icon-only buttons.
  - Buttons nudge down on press, and every variant now carries a same-width border so swapping variants no longer flashes or shifts the layout by a pixel.

  **Icons**

  - Iryx's own icons now come from [Hugeicons](https://hugeicons.com) rather than Lucide. Hugeicons ships icons as data, so props that take an icon accept **either** a Hugeicons icon or any component that renders an SVG — an existing Lucide icon still works.

  **Labels**

  - `ILabel` and `IFormField` indent their text to line up with the control's text rather than its outer edge, so the label sits directly above the placeholder. The offset matches the input's horizontal padding per size; pass `indent="none"` for controls that draw their own label.

  **Stat**

  - Reworked as a KPI tile: uppercase label, larger value, the change as a coloured pill on its own line.

  **Fixes**

  - Buttons no longer animate their geometry. `transition-all` eased padding and width, so a button visibly stretched when its spinner appeared.
  - Switching light/dark no longer flashes a white border. The light and dark border tokens sit far apart, so the colour transition interpolated through a near-white edge; transitions are now suppressed for the frame the theme flips.
  - The stepper's previous step no longer flashes when moving on, and the tabs indicator animates between triggers in both variants.

## 0.2.0

### Minor Changes

- Add `Card`, `Badge` and `Alert`, and move status colours onto theme tokens.

  - **`Card`** — `variant` (outline/soft), `padding` (none/sm/md/lg), `title` and `description` props with `#header`, `#title`, `#description` and `#footer` slots. The header and footer are omitted from the DOM entirely when unused.
  - **`Badge`** — `variant` (neutral/success/warning/danger/info) × `tone` (soft/solid) × `size` (sm/md/lg), plus an optional leading `dot`.
  - **`Alert`** — `variant` (info/success/warning/danger) with a matching default icon (override with any component, or `:icon="false"`), optional `title`, and a `closable` dismiss button emitting `close`. `role` is `alert` for danger and warning, `status` otherwise, so informational messages don't interrupt a screen reader. The dismiss button's accessible name is overridable via `closeLabel`.

  Status colours are now driven by `--iryx-{success,warning,danger,info}-*` tokens in `theme.css`, each with a solid fill, its foreground, a tinted surface, its foreground and a border. They carry their own dark-mode values, and are exposed on `ThemeColors` so `applyTheme()` can override them.

## 0.1.0

### Minor Changes

- 775de29: First public release of Iryx — a Vue 3 component library built on Reka UI and Tailwind CSS v4.

  Includes App, Button, Checkbox, Form, FormField, Input, Label, RadioGroup, Select, Switch and Textarea components, a `theme.css` stylesheet, theme presets, an appearance composable, and a Nuxt module entry point at `iryx-ui/nuxt`.
