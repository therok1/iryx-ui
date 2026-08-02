# iryx-ui

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
