# iryx-ui

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
