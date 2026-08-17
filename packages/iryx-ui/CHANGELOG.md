# iryx-ui

## 0.12.0

### Minor Changes

- e935913: Add `IDrawer` — a panel or sheet attached to any viewport edge, built on Reka's drawer primitive.

  `side` picks the edge (`right`, `left`, `top`, `bottom`) and doubles as the direction you drag to dismiss; `size` reads as a width on a side drawer and a maximum height on a sheet. Sheets get a drag handle by default, and `snapPoints` with `v-model:snapPoint` gives a sheet that rests part-way and can be dragged to full. `modal` accepts `'trap-focus'` for a side panel that leaves the page interactive. Slots, `dismissible`, `showClose` and `closeLabel` match `IDialog`.

  This bumps `reka-ui` to `^2.10.3`, which moves the hidden form input in `Checkbox` and `Switch` from inside the control to a sibling of it, fixing a `nested-interactive` accessibility violation. Both components now bind `$attrs` explicitly so attributes still reach the control — and in the labelled layout they reach the control rather than the wrapper, which they did not before.

### Patch Changes

- dceecef: Attributes now reach the control they belong to in `INumberInput`, `ISelect`, `ICombobox` and `IProgress`. Each of these renders a wrapper — or, for `ISelect` and `ICombobox`, a renderless or `display: contents` root — and an attribute left to fall through landed there instead of on the field. An `aria-label` therefore never named anything, so a component with no visible label had no accessible name.

  `IProgress`'s `label` prop now also names the bar for assistive tech. It rendered visible text but was never associated with the `progressbar` element, so a labelled bar still announced as an unnamed one.

  Stop inlining declared dependencies into the bundle. `@hugeicons/core-free-icons`, `@hugeicons/vue` and `@internationalized/date` were listed as dependencies _and_ copied into `dist`, so consumers installed them and then received a second private copy — around 38 kB of duplicate code, and two module instances of `@internationalized/date`, which is enough to break an `instanceof CalendarDate` check across the boundary.

- 3e480ba: Fix `ITabs` throwing on the server. Its internal helper was named `valueOf`, and a template resolves an identifier against the render context — whose prototype chain includes `Object.prototype`. Under SSR the lookup found `Object.prototype.valueOf` rather than the component's own binding and called it with no receiver, so every tab list failed with "Cannot convert undefined or null to object" on the server while working perfectly in the browser.

  Narrow `reka-ui` to `~2.10.3`. `IDrawer` is built on Reka's drawer primitive, which is marked Alpha, so its API can still change in a minor release. A patch range keeps upstream fixes flowing without letting an Alpha API change reach consumers unannounced.

## 0.11.0

### Minor Changes

- 92ac0e9: `IBarChart` takes `stacked`, collapsing grouped series into one bar per category. The axis sizes against running totals, only the outermost segment is rounded so the cap still reads as the tip of the total, segments are separated by surface rather than a stroke, and the tooltip gains a `Total` row (`totalLabel` renames it).

  Negatives stack away from zero independently of positives, so a mixed stack shows both sides at full length instead of netting into a shorter bar. Stacking is ignored for a single series, and works in both orientations.

## 0.10.2

### Patch Changes

- c25a51e: `IDialog` really does stop warning about a missing description now. Reka renders `aria-describedby` unconditionally, pointing at an id that only exists when a description was rendered, and its check tests whether the attribute is _present_ — so the `aria-describedby="undefined"` its message suggests (React phrasing, where `undefined` omits the attribute) changed nothing. The attribute is now removed instead, and a dialog that does have a description keeps its wiring.

## 0.10.1

### Patch Changes

- 12741ac: `IDialog` stops warning about a missing description. Reka expects a dialog with no description to opt out explicitly via `aria-describedby="undefined"`; without it every description-less dialog logged a warning, which trains people to ignore the warnings that matter. Dialogs that do have a description are unaffected.

## 0.10.0

### Minor Changes

- d79dd6b: `IBarChart` and `ILineChart` take `#underlay` and `#overlay` scoped slots, both receiving the chart's `CartesianLayout` — `plot`, `value()`, `bandCentre()`, `bandWidth`, `ticks` and `orientation`. Reference lines, target bands and callouts are ordinary markup positioned by the chart's own scales.

  This is the answer to "does it have plugins": no registry. Chart.js needs one because canvas is opaque and an imperative draw hook is the only way in; SVG has no such constraint, so a scoped slot does the job declaratively, reactively and with type-checking. Both slots sit below the hit targets, so hovering keeps working through whatever is drawn.

- 185d276: Add eight categorical chart colours, `--iryx-chart-1` … `--iryx-chart-8`, exposed as Tailwind colours (`text-chart-3`, `fill-chart-5`). They encode series identity, never magnitude, and unblock multi-series charts.

  The steps are computed rather than eyeballed: each clears a lightness band, a chroma floor of 0.10, protanopia/deuteranopia separation and contrast against its own surface. Light and dark are validated separately against their own backgrounds — dark is not a flip. Status colours are deliberately excluded, so a series in slot 4 can never read as a warning.

  Documented caps: 8 series where only neighbours touch (bars, lines, stacks), 3 where any two marks can sit side by side (scatter, bubble, small multiples). Beyond those, fold into "Other" or facet — never generate a ninth hue.

- af8a1a0: `IBarChart` takes `orientation="horizontal"`, running the categories down the side.

  This is the answer to the limitation the vertical chart documents: colliding labels get thinned to every *n*th, which is fine for `Jan` / `Feb` and lossy for `Travel and accommodation`. Turned on its side, the names get real width and none are dropped. Grouped series, the tooltip and the zero-anchored axis all behave as before.

  The tooltip is placed past the bar's tip rather than over it, flipping inside when a long bar leaves no room — the end of the bar is the reading, so covering it defeats the purpose.

- fad185e: Add `ILineChart` — line and area charts sharing `IBarChart`'s axis layer, with a crosshair and a single hover marker rather than a dot on every point. `null` breaks the line instead of bridging it, so a missing reading never draws a slope that didn't happen.

  `zero` is off by default here and always on for bars: a bar is read by length and a truncated baseline lies about the comparison, while a line is read by its shape and a forced zero flattens a high, narrow series into a straight edge.

  The shared plot maths moves into `cartesianLayout` — axis, gutter, plot rectangle, band spacing and label thinning — so the two charts cannot drift apart. It is a pure function, exported and testable without mounting anything.

- 5055080: `IBarChart` and `ILineChart` take multiple series. Rows stay plain objects and a `series` descriptor names the measures, the same shape `ITable` uses; omit it and the single-series behaviour is unchanged.

  Bars group inside their category, lines draw one path each, and one hover reports every series for that category in a single tooltip rather than making the reader chase individual marks. `ChartLegend` is exported and rendered automatically — mandatory from two series up, because colour alone is not a dependable identity channel.

  `ChartSeries.slot` pins a series to a palette colour so filtering one out does not repaint the survivors: colour has to follow the entity, not its position. Past eight series the chart warns in development instead of silently reusing a hue.

  Fixes a tooltip that was positioned against the chart root, so it rode up over anything above the plot.

## 0.9.0

### Minor Changes

- 39fa4e9: Add `IBarChart` — a categorical bar chart in plain SVG, with the axis layer the rest of the charts will share.

  The axis picks the domain rather than the data: values snap outwards to a 1/2/5 step so ticks read `0 / 2,000 / 4,000` instead of `0 / 1,726.8`, and zero is always included because bars are compared by length. Bars cap at 24px with air between them, rounded at the data end and square at the baseline. Hovering dims the rest of the series and shows a tooltip clamped inside the chart; hit targets span the full band so short bars are no harder to hit than tall ones.

  The SVG is `aria-hidden` and the data is exposed as a visually-hidden table, which renders even before the container is measured. Long category labels thin to every *n*th rather than rotating.

  Adds `niceTicks` to the scale helpers and a `useElementSize` composable.

- 474610a: Add `ISparkline` — a tiny inline trend chart, and the first piece of charting in the library. Plain SVG with no charting dependency: colour comes from `currentColor`, so it follows the theme preset and light/dark with no JavaScript, which a canvas chart cannot do.

  `line` and `area` variants, an optional end dot, `min`/`max` to put several sparklines on one scale, and `null` for a genuine gap rather than a zero. Width is fluid without distorting the ink — the drawing stretches via `preserveAspectRatio="none"` while strokes use `vector-effect="non-scaling-stroke"`. Empty, flat and single-reading series all render sensibly.

  Exports the scale helpers behind it (`extent`, `finiteValues`, `linearScale`) for building your own marks.

### Patch Changes

- 9642a8b: `IBarChart` sizes bars as a share of their band instead of the band minus a fixed gap. Subtracting a constant collapsed at narrow bands — 26 categories in a phone-width card left 2px hairlines. The bar and the space beside it now shrink together, as they do in every charting library, with the 24px cap unchanged.
- 69dff93: `ISparkline` keeps its marks inside its own box. Marks are centred on their data point, so the end dot sat exactly on the corner of the drawing and half its 12px ring painted outside the component — invisible inside a padded card, bleeding into the neighbour in a table cell. The plot is now inset by the mark's radius, taken out of the drawing rather than added around it, so the height a caller reserves is still the height the sparkline occupies.

## 0.8.0

### Minor Changes

- 54650a4: Add `IFileUpload` — a drag-and-drop dropzone with `accept`, `maxSize` and `maxFiles`, image thumbnails, a browse button and a remove action.

  The model is always a `File[]`, even without `multiple`; without it, picking again replaces rather than appends. `accept` is enforced in the component as well as on the input, since a dragged-in file bypasses the native filter. Refused files raise `@reject` with `{ file, reason }` (`'type'`, `'size'` or `'count'`), and every string — `label`, `browseLabel`, `hint`, `removeLabel` and the three rejection messages — is a prop. Thumbnail object URLs are revoked when a file leaves the list or the component unmounts.

### Patch Changes

- dacd57c: `IPasswordInput` hides Edge's native reveal and clear controls. Edge draws its own eye on `input[type=password]`, and its own clear cross once the field is revealed, so the field showed two of each in that browser.

## 0.7.0

### Minor Changes

- 0e01c7f: Add `IDatePicker` and `IDateRangePicker`, built on Reka's calendar primitives.

  The model is an ISO `YYYY-MM-DD` string (`{ start, end }` for the range), never a `Date`: a `Date` is a timestamp carrying a time zone, so it can render as the previous day west of Greenwich and move a record into the wrong period. Malformed input resolves to "no selection" rather than throwing, since the value often arrives from a URL or a stale draft.

  Both take `min` / `max` / `locale` / `format` / `weekStartsOn` / `clearable`, and every navigation and footer label is a prop. The conversion helpers (`toCalendarDate`, `toIsoDate`, `formatIsoDate`, `isoToday`) are exported too.

  Adds `@internationalized/date` as a direct dependency — it already came in transitively with `reka-ui`, whose calendars require its `DateValue` type.

- 07821f7: `IInput` gains `leading` and `trailing` slots, plus `clearable`, `loading` and `debounce` props.

  **Breaking:** `IInput` now renders its chrome on a wrapper element rather than on the `<input>` itself, so affix content can take real space in the field instead of hiding long values under absolutely positioned padding. `class` lands on that wrapper; reach the inner control with `ui.input`. Stray attributes (`name`, `autocomplete`, `maxlength`) still forward to the `<input>`. Styling that targeted the input element directly needs moving to the wrapper.

- 6e50d4e: Add `IPasswordInput` — `IInput` with a reveal toggle and an optional four-segment strength meter. The score is a transparent nudge (length, mixed case, digit, symbol), not a security control; every user-facing string is overridable via `showLabel`, `hideLabel` and `strengthLabels`.

  `ITextarea` gains `autosize`: `true` grows without limit, `{ min, max }` bounds it in rows and scrolls past the cap. It shrinks as well as grows and re-measures on external model writes, so a reset or prefill resizes correctly.

## 0.6.0

### Minor Changes

- **Breaking:** status colour moves from the surface to the mark. `IAlert`, `IToaster` and `IBadge` no longer wash their whole background in the variant colour — the chrome is neutral and the colour sits where it carries meaning: the dot on a badge, the icon on an alert or toast. A saturated block shouts before it is read, and a stack of them turns a page into a traffic light.

  `IBadge` drops the `tone` prop. `soft` and `solid` become a single bordered look; setting `dot` switches the badge to neutral chrome with a coloured dot. Corners drop from a full pill to the shared radius, and the horizontal padding tightens one step at every size. Passing `tone` is now a type error.

  `IStat`'s delta is coloured text with its arrow rather than a filled pill, which competed with the value for attention. `IToaster`'s action is a real button rather than an underlined link.

  `IProgress` is deliberately unchanged: its coloured bar is the data, not decoration around a message.

- Add `IBanner` for page-level announcements. Where `IAlert` is contextual — it sits next to the thing it is about — a banner spans the full width and announces something tied to no single element: a trial ending, scheduled maintenance. It is a labelled `role="region"`, never an alert, because it is ambient and must not interrupt a screen reader mid-task. `position` puts it in the flow, sticky at the top, or fixed to the bottom; `contained` keeps the text at a readable measure while the fill still spans the window.

  `IAlert` gains `v-model:open`, so dismissing is one binding rather than a `close` handler plus a `v-if` — `close` still fires for callers that want to confirm or persist first. It also gains an `actions` slot, so "Retry" and "Undo" have somewhere to live other than the description.

- The typeface now comes from `--iryx-font-sans`, defaulting to the system stack and feeding Tailwind's `font-sans` so utilities follow too. The library still ships no webfont — that would put font files, a licence and a network request into every consuming app whether it wanted them or not. Point the variable at your own family and everything follows. Unlike the colour tokens it is deliberately not mode-specific, so there is no `.dark` counterpart to keep in sync.
- **Breaking:** `IPagination` buttons default to `sm` instead of `md`, and a new `align` prop (`start` / `center` / `end`) places the control, defaulting to `center`. Both change how an existing pagination looks without the caller touching anything — pass `size="md"` and `align="start"` to keep the old appearance. `md` and `lg` are otherwise unchanged.
- Add `ITable`, a data table that **never fetches**. It renders the rows you give it and emits what the user did, so caching, cancellation and auth stay in your data layer. Passing `total` switches it to server mode — it stops sorting and paginating locally, because those rows are already the page the server returned; omit it and it handles both itself.

  Every model (`sort`, `page`, `perPage`, `selection`, `expanded`) is optional. Bind one and you own that state — the URL, a store, `useState`, anything — leave it unbound and the table keeps it internally.

  Columns are plain objects rather than render functions: `key` is the dot-notation accessor and the slot suffix, so `#cell-customer.name` targets that column and `#header-<key>` replaces its header. `numeric` gives a column tabular figures and end alignment so amounts line up down the column. Selection is held as row keys with `rowKey`, and select-all covers only the current page, so selections made elsewhere survive.

  Sorting cycles ascending → descending → unsorted, with `null` distinct from never-sorted so a server-mode caller can fall back to its own ordering. Real `<table>` semantics throughout: `aria-sort` on headers, sortable headers as buttons, `aria-busy` while loading.

  `useDataTable()` is exported separately for the whole state machine without any markup.

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
