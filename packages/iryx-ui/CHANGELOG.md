# iryx-ui

## 0.19.1

### Patch Changes

- 883f52d: Fix the global `unstyled` option being ignored by `IChartLegend`.
  
  It declared `unstyled` without `withDefaults`, so Vue cast the absent prop to
  `false` and `props.unstyled ?? config.unstyled` never reached the config. Setting
  `unstyled` on the plugin or the Nuxt module left the legend styled while every
  other component went bare. The `unstyled` prop on the component itself always
  worked.

## 0.19.0

### Minor Changes

- 3a111c2: Add blocks: whole page sections on their own import path, `iryx-ui/marketing`.

  `IHero` is the top of a marketing page — a masked, animated backdrop (`aurora` or
  `bloom`), an optional ruled grid, and regions for a badge, heading, description,
  actions, small print and a product shot. `ISection` is the band every other
  section sits in: tone, an optional top rule, vertical rhythm and a centred
  heading block. `IPricingTable` lays a row of plans out from data, each an `IPricingCard`.
  `IFeatureCard` and `ITestimonialCard` are the cards a features or customers
  section is a grid of. `IBrowserFrame` puts browser chrome around a screenshot.

  Blocks are not registered by the plugin unless asked for, and are not on the
  package root, so an app that never uses them carries none of them:

  ```ts
  import { createIryxUi } from "iryx-ui";
  import { marketingComponents } from "iryx-ui/marketing";

  app.use(createIryxUi({ components: marketingComponents }));
  ```

  The plugin's new `components` option takes any record of components, so a subset
  works too. The Nuxt module gains a matching `blocks` option, off by default,
  which auto-imports the blocks from the subpath under the same prefix. Importing the subpath declares the blocks on Vue's `GlobalComponents`;
  a project that never imports it keeps its declarations untouched.

  The hero's backdrop layers ship as plain classes in `theme.css`
  (`iryx-hero`, `iryx-hero-aurora`, `iryx-hero-bloom`, `iryx-hero-grid`), so a
  panel that is not a hero can reuse them.

### Patch Changes

- 4c73399: Animate the focus ring on every component, not just the four that happened to.

  The ring faded in on `IButton`, `IPagination`, `ISlider` and `IToggle` because
  their transition property lists included `box-shadow`; everywhere else it
  snapped on, since `transition-colors` excludes it. Every component that paints a
  focus ring now transitions it at the same 150ms, so tabbing through a form no
  longer mixes the two behaviours.

## 0.18.5

### Patch Changes

- a170a0b: Fix `IColorPicker` breaking after the selected swatch is picked a second time. Reka reports that as an empty selection, which the picker forwarded as the string `"undefined"`; the colour field then threw while parsing it, aborting the render and leaving the controls without their element references, so every later drag threw too. A deselection is now ignored, and any unparseable model falls back to the picker's own colour.

## 0.18.4

### Patch Changes

- b852997: An explicit `id` on a control inside a `FormField` is now what the field's label points at. Previously only `Select`, `PinInput`, `Checkbox` and `Switch` wrote their id back to the field, so `<IInput id="login-email">` left the label pointing at the field's generated id and the control unlabelled for screen readers. `Editable` also renders its id on the input element rather than only on the root.
- f6b74d9: `ITimeline` markers now centre on the first line of the item's title instead of sitting flush with the top of the row, where a dot or an icon read as a few pixels too high.

## 0.18.3

### Patch Changes

- 5bc882d: `ICommandPalette` no longer warns about a missing description. Reka renders
  `aria-describedby` on every dialog, pointing at an id that exists only when a
  description was rendered — a palette has none, so the attribute is removed, the
  same treatment `IDialog` already had.
- fa812c5: Controls inside an `IFormField` are wired to it properly.

  `ISelect`, `ICheckbox`, `ISwitch` and `IPinInput` now take the id the field's
  `<label for>` points at, so the label names the control instead of pointing at
  an element that does not exist. `IRadioGroup` and `ISlider` cannot be targeted
  by a `for` at all, so they take the field's label through `aria-labelledby` and
  release the id — the field then renders no `for` rather than a dangling one.
  `IFormField` publishes a `labelId` alongside `id` for that, and its `id` is now
  writable, so a control with its own `id` writes it back.

  `ISelect`, `ICheckbox`, `ISwitch` and `IRadioGroup` gain an `invalid` prop with
  the border and ring treatment the text inputs already had, and report
  `aria-invalid`. Like the other controls, they take the state from the enclosing
  `IFormField` when the prop is omitted, so a failing field now looks and reads as
  failing rather than only showing a message underneath.

## 0.18.2

### Patch Changes

- f19ac38: `ISelect` takes an `id`, which lands on the trigger so a `<label for>` names the
  control. It worked through attribute fallthrough before, but was neither typed
  nor documented.

  `ISelect`'s trigger truncates a value too long to fit instead of wrapping it out
  of the control's fixed height.

- 4653503: Requires `tailwind-variants` `^3.3.1`. In 3.3.0 a slot `tv()` call reused one
  shared slots object, so interleaved calls cross-contaminated: a card asking for
  `padding="sm"` could resolve with the variants of whichever call came last and
  render `p-6`. The published range allowed 3.3.0, so consumers hit this while the
  repository itself resolved 3.2.2 and never reproduced it. Upstream fixed it in
  3.3.1 (heroui-inc/tailwind-variants#305); this raises the floor above the broken
  release and adds a test that fails on 3.3.0.

## 0.18.1

### Patch Changes

- 50ee7a3: Accessibility and interaction fixes from a Web Interface Guidelines pass:

  - `theme.css` now declares `color-scheme` on `:root` and `.dark`, so native
    scrollbars, `<select>` popups and date pickers follow the active theme
    instead of always rendering light.
  - Dialog and Drawer content scroll with `overscroll-contain`, so scrolling
    past the end of a modal no longer scrolls the page behind it.
  - Buttons set `touch-manipulation`, removing the ~300ms double-tap zoom delay
    on touch devices.
  - `IFormField` marks its error message as `role="alert" aria-live="polite"`,
    so screen readers announce validation failures.
  - Checkbox, Switch, RadioGroup and the DateField/TimeField segments ring on
    `focus-visible` rather than `focus`, so a mouse click no longer leaves a
    focus ring behind.
  - Input drops spellcheck for `email`, `url`, `tel` and `password` types, and
    PasswordInput and PinInput disable it outright.

## 0.18.0

### Minor Changes

- d1defc7: Add `IAuthProviders`, the third-party sign-in row: the marks pin to the left edge while the labels centre across the full width, so rows with labels of different lengths still line up. Brand marks stay the caller's — the sign-in branding of Google, Apple and the rest comes with rules the application has to meet.
- 3a41866: Widen every `class` prop from `string` to the new exported `ClassValue`, so array syntax — `:class="[base, active && 'ring-2']"` — type-checks. Object syntax stays excluded, since `tailwind-merge` cannot merge it.
- 3a41866: Declare every component on Vue's `GlobalComponents`, so globally registered `I`-prefixed components are type-checked in templates. `IryxUiGlobalComponents` is exported for projects that register under a different prefix.

### Patch Changes

- 8596f8d: `IAppShell` now passes `inDrawer: false` to the `sidebar` slot in the rail. It previously passed nothing there, which left the slot prop typed as `{}` and unusable.
- ba509ef: `IAppShell` in `scroll="page"` mode now gives its sidebar the full height below the header instead of a maximum. `self-start` — which is what makes the sticky offset work — also collapsed the rail to the height of its own items, so a short navigation left the panel, its border and its background floating mid-page.
- be74257: A swiped toast now follows the pointer. The gesture already dismissed it, but nothing consumed the offsets Reka writes during a swipe, so the card stayed put until it vanished.

## 0.17.1

### Patch Changes

- 1e09b16: `IAccordion` closes at the speed it opens

  Its panels move in pairs — one shutting while its sibling unrolls — and the close was 60ms quicker than the open, so the shrinking panel finished first. For those 60ms the page was shorter than either end state, and everything below the accordion rode up a few pixels and dropped back.

  `ICollapsible` keeps the quicker close, where nothing is opening into the space it leaves.

## 0.17.0

### Minor Changes

- 3604415: Add `ICalendar`, the month grid on its own

  The grid `IDatePicker` puts behind a field, available inline for the cases a popover is the wrong shape — a booking page, an availability view. ISO `YYYY-MM-DD` model like the pickers, plus `min` / `max`, an `isUnavailable` predicate taking ISO strings, `months`, `pagedNavigation`, `weekdayFormat`, `preventDeselect` and `readonly`.

  With nothing selected it opens inside `min` / `max` rather than on today, so a calendar for a future window no longer opens on a month where every day is disabled.

  Both pickers now render the same theme rather than a second copy of it: the grid's classes moved to `calendarTheme`, and `IDatePicker` renders `ICalendar` internally. `IDatePicker` also gained `isUnavailable` as a result.

- 53d320f: Add `IDateField`, segmented date entry

  Day, month and year as three arrow-key controls, ordered by the locale, with the same chrome and sizes as `ITimeField`. ISO `YYYY-MM-DD` model, `minValue` / `maxValue`, and an `isUnavailable` predicate taking ISO strings. The one to reach for when the reader already knows the date — a birthday, an invoice date — where hunting through a month grid is slower than typing.

- 0b8c007: `IDropdownMenu` takes a `header` slot

  A block above the items — an account's name and address, a workspace, a plan. It renders outside the item list, so it takes no stop in the arrow-key order and typeahead ignores it. An entry with no `onSelect` was the only way to do this before, and a group label is the wrong thing for an identity: it is neither a heading for the items below nor something to act on.

- ffb21f4: Add `IEditable`, text that becomes a field in place

  For changing one value where it sits — a title, a table cell, a note — without a form or a dialog for a single line. Both states are plain text: no border, no box, just a caret, with a hover tint as the only chrome. `controls` adds edit, save and cancel buttons; `submitMode` decides what commits (`both` by default, so `Enter` works); `preview` re-renders the value however you like.

- 9d4cef0: Add `IHoverCard`, a preview summoned by hovering a link

  The popover's chrome with the tooltip's trigger: `openDelay` and `closeDelay`, `side` / `align` / `sideOffset`, an optional `arrow`, and the same `width` and `padding` scales as `IPopover`. `enableTouch` is off by default — a tap has no hover before it, so nothing inside a hover card may be the only route to an action.

### Patch Changes

- b111957: `ICombobox`'s chips are Reka's `TagsInput`

  The chips were hand-built markup, so the keyboard had only what was written for it: Backspace removed the last chip outright and nothing else worked. They are `TagsInput` items now, composed inside the anchor as Reka's own docs do — arrow keys move between chips, the first Backspace marks the last one and the next removes it, matching `ITagsInput`.

  A multiple field also keeps its size's height as a floor. One chip is shorter than a line of text, so it used to sit 2px below every other field in its row.

- 34d59c0: `IContainer`'s gutters now respond to the viewport

  Each gutter was a single value at every width — `md` was `px-6` on a 360px phone and on a 2560px monitor alike. A fixed gutter has to pick a side, and the middle is wrong at both ends: too much of a narrow screen spent on margins, too little breathing room on a wide one.

  `sm` is now `px-3 sm:px-4`, `md` is `px-4 sm:px-6 lg:px-8`, and `lg` is `px-6 sm:px-8 lg:px-12`. `gutter="none"` is unchanged, and remains the way to set one fixed value of your own.

- 53d320f: `ITimeField` now honours `minValue` and `maxValue`

  They were decorative. Reka computes the out-of-range state and exposes it as `data-invalid`, but nothing styled that attribute and nothing set `aria-invalid`, so a time outside the range was accepted in silence. It now marks the field invalid the same way the `invalid` prop and `IFormField` do — and a caller's `invalid: false` cannot suppress it, since being out of range is a fact about the value.

- 197bfa2: `IStat`'s delta sits beside the value

  It had a line of its own, which left every tile taller than its content. The two are one reading — a figure and how it moved — so they now share a baseline, wrapping only when a long value leaves no room.

## 0.16.0

### Minor Changes

- 2fd9ff0: Charts now reveal themselves on their first paint

  `IBarChart`, `ILineChart` and `IDonutChart` animate in by default; `ISparkline` can, and does not by default — it usually sits in a stat tile or a table row, where a page of them moving at once is a distraction. Every one of them takes `animate`: `false` to switch it off, or `{ duration, easing }` to tune it, with `easing` one of `ease-out` (the default), `ease-in`, `ease-in-out` or `linear`.

  The reveal plays once per instance, never again when the data changes underneath it, and is skipped entirely for a reader who has asked for reduced motion.

  `ISparkline`'s `area` wash is now the same downward-fading gradient `ILineChart` draws, rather than a flat tint.

- 2db3cf9: Add `IDonutChart`, for parts of one whole

  A ring of slices with a hover tooltip carrying the value and its share, a `center` slot given the total, and the same accessible data table and eight-slot palette as the other charts. `pie` fills the middle in, `thickness` sets the ring's width, and `gap` sets the space between neighbouring slices — held to an even width across the ring rather than trimmed by a fixed angle, so the divider reads as a line rather than a wedge.

## 0.15.0

### Minor Changes

- 29c9ad7: `IAppShell` turns its sidebar into a drawer on small screens. Below `md` the sidebar column is hidden and the same `#sidebar` slot renders inside a left drawer, with a trigger the shell puts in the header itself — so an app gets usable navigation on a phone without wiring anything up. `mobileNav` turns it off, `navLabel` names the trigger, and the `#sidebar` slot receives `inDrawer` so a brand or footer can differ between the two. The `#header` slot now also receives `navOpen` and `toggleNav` for apps that would rather place the trigger themselves.

  The breakpoint is CSS, not a media query read in script, so server-rendered markup and the first client frame agree.

  **Note for custom themes:** the header slot is now wrapped in a row (`ui.headerRow`, `ui.headerContent`) to make room for that trigger, so the bar is one level deeper in the DOM than before.

- 29c9ad7: `ILineChart` takes a `tension` from `0` to `1`, curving the line between readings. It stays `0` by default: a curve claims the readings run continuously into each other, which is true of a temperature trace and false of six monthly totals.

  Control points are clamped to the pair of readings they sit between. An unclamped spline overshoots — between a low reading and a high one it swings past both, drawing values below the smallest number in the data and above the largest.

  `flush` carries the line and its fill flat out to the left and right edges of the plot, while the readings, markers and labels stay put — so the chart fills its box without pretending to know a value it was never given.

  Line charts also now span the plot rather than sitting half a category clear of each edge, keeping a quarter-category inset so the end markers have somewhere to sit.

### Patch Changes

- 43a842e: `IButton` no longer picks up an underline from the prose around it. A button rendered `as="a"` lands in whatever link styles its page defines, and inside documentation or article markup that usually means an underline on hover — which made a solid button read as a link. The `link` variant still underlines on hover, as it always did.
- bfff36e: `ILineChart` and `IBarChart` no longer add their own height to the page's scroll area. The accessible data table carried `sr-only` directly, but a table treats a specified width as a _minimum_ and refuses to shrink below its content — so the table stayed at full size, absolutely positioned and still measured. A page with two charts grew a second scrollbar behind the app. The class moves to a wrapping `div`, which honours the 1px box and clips the table inside it.
- 9a1c603: `IFormField` spaces its parts with a flex gap instead of `space-y`. Margin-based spacing puts the margin on the control element itself, and `ICombobox` renders its root as `display: contents` — a box margins do not apply to — so a combobox sat tight against its label while every other control cleared it by 8px.
- bfff36e: `ILineChart`'s `area` variant fills with a downward gradient rather than one flat tint, so the line stays the strongest thing in the plot and the wash reads as depth under it. The gradient id comes from `useId`, so two charts on a page cannot share one.
- 7cb6ea2: `ISidebar`'s nav had `px-2 py-1`, so a link sat 8px from the side edges but only 4px from the top — the first link read as crowded against the header. It is now an even `p-2`.
- 7cb6ea2: `IStat`'s `trend` no longer turns the arrow around. It is documented as a colour override — for the case where down is the good direction, like a falling overdue total — but it also flipped the arrow, so `:delta="-14" trend="up"` rendered "↑ -14%", an arrow contradicting the signed number printed beside it.

  The arrow now follows the sign of `delta` and `trend` colours it, which is what the prop always said it did.

## 0.14.0

### Minor Changes

- 13d157c: `ICombobox` gains `clearable`. Once a value is set, the dropdown arrow becomes a clear button — clearing empties the query, returns focus to the input, and sets the model to `null`, or to `[]` when `multiple`. `clearLabel` renames it for non-English apps, and `ui.clear` styles it.

  Multiple selection is now documented and covered by tests. It always worked, since `multiple` forwards to `ComboboxRoot` and the field already joined the chosen labels — but nothing said so, which made it invisible.

- 13d157c: A `multiple` `ICombobox` now draws each chosen value as a removable chip inside the field instead of joining the labels into one comma-separated string. The input stays a query box and shares the chips’ line whenever there is room for it, chips are removed with their cross or with Backspace while the query is empty, and the field wraps and grows rather than clipping — matching `ITagsInput`, whose chip styling it shares.

  A `tag` slot replaces a chip's contents, `removeLabel` names the remove button for non-English apps, and `ui.tag` / `ui.tagText` / `ui.tagDelete` style the parts.

- 1e3cc45: Export `IIcon` and the `IconLike` type. It is the icon renderer every other component already used internally — it takes both shapes an icon comes in, a Hugeicons data array or any component that renders an SVG, so your own controls can accept an `icon` prop on the same terms the library does.

  Icons stay decorative by default (`aria-hidden`). A new `label` prop swaps that for `role="img"` and an `aria-label`, for the case where the icon is the only thing naming a control.

## 0.13.0

### Minor Changes

- d709dd2: New component: `IAccordion` — a disclosure list on Reka's Accordion, driven by the same `items` rule as the rest of the library. `type="multiple"` lets several panels stand open and turns the model into an array; `collapsible` lets the open panel close again in `single` mode; `variant` is `plain` (rules between rows) or `outline` (a panel each).

  This finally exposes the collapsible behaviour that has been buried inside `ISidebar` since the navigation work, with the two lessons that came out of it baked in: the animated element carries no padding, because margin is not part of an animated height and survives the close as a gap under a shut panel; and the chevron reads `data-state` from the trigger through a group, because `data-state` sits on the trigger and a bare `data-[state=open]:` on the icon inside it matches nothing at all.

- d709dd2: Add `IAvatar`, `IAvatarGroup`, `ITimeline` and `IAspectRatio`.

  `IAvatar` treats initials as the normal state rather than a failure state — most people in most applications have never uploaded a photo. Initials come from the first and last words of a name, so "Ana María Ruiz Vega" gives AV rather than four unreadable letters, and the presence dot carries a name because a colour says nothing on its own. `IAvatarGroup` overlaps them into a stack with a `max` and a "+n" chip, ringing each avatar in the page background so the overlap reads as depth.

  `ITimeline` is an ordered run of events — an audit trail, a delivery's progress. It is deliberately not `IStepper`: a stepper is a process you move through with steps still to come, a timeline is a record of what already happened. The connecting spine is drawn per item so the last one can omit it, rather than one line behind the column that would trail off past the final marker.

  `IAspectRatio` holds a box at a fixed ratio so content that sizes itself cannot shift the page when it loads.

  `IPopover` gains a `title` prop, and no longer reserves room for its close button by padding the whole panel — that indented every row, so a form inside could never reach the full width. Only the title makes way for the button now, because the top line is the only one it can collide with.

- d709dd2: Add `ICollapsible` and `IColorPicker`, and give `ITree` counts.

  `ICollapsible` is the bare disclosure behind `IAccordion` — one region that opens and closes, for when there are no siblings to coordinate with. It shares the accordion's height animation, so the two can never open at different speeds.

  `IColorPicker` gives a saturation plane, a hue ramp, an optional opacity ramp, a hex field and optional presets. The model is a hex **string**, because a string is what goes into a stylesheet, a database column and a design token. The opacity ramp sits on a chequerboard, since transparent at one end is otherwise indistinguishable from white, and the thumbs are white rings rather than filled dots so the colour underneath stays visible.

  `ITree` items take a `count`, shown against the row's trailing edge so the numbers line up in a column instead of stepping inward with every level. Rows also keep a small base inset, so a top-level chevron no longer sits flush against the tree's leading edge.

- d709dd2: New component: `ICommandPalette` — every command in the app behind one shortcut, grouped, filtered as you type, and driven entirely by keyboard.

  It opens on `mod+k` by default, where `mod` is Command on Apple platforms and Control everywhere else. The listener sits on the window rather than on the palette, because the palette is not in the DOM until it opens — a listener on it could never be what opens it.

  Commands carry `keywords`, which are search terms that never appear on screen: synonyms, the old name of a renamed page, the word a reader would guess before learning yours. A `shortcut` is display only — the palette never binds it, because a shortcut belongs to the command and has to work whether or not the palette is open. An `href` renders the row as an `<a>`, so middle-click and open-in-new-tab behave.

  Built on Reka's `Listbox` primitives inside a dialog, so arrow keys, typeahead, focus return and `Escape` come from the same place every other overlay gets them.

- d709dd2: Add `IKbd` — a keyboard shortcut drawn as one chip per key.

  `mod` renders as ⌘ on Apple platforms and Ctrl everywhere else, using the same vocabulary `matchesHotkey` reads, so the shortcut you bind and the shortcut you show cannot drift apart. The platform is resolved after mount rather than during render: there is no `navigator` on the server, so deciding earlier would print "Ctrl" into server markup and "⌘" on the client and mismatch hydration on every page carrying a shortcut.

  The glyphs are hidden from assistive technology and the group carries the spoken form instead — `mod+shift+k` announces as "Command Shift K" — because ⌘ on its own announces as nothing useful.

  `ICommandPalette` now renders its items' shortcuts with this component instead of its own inline markup, and `matchesHotkey` shares the platform check, so there is one answer to "which key is `mod`" in the library.

- 8f6eb28: Add `INavigationMenu`, the app-level navigation bar built on Reka's `NavigationMenu`.

  Entries are data, following the same rule `IDropdownMenu` uses: an entry with its own `items` becomes a panel trigger, everything else is a plain link. Every panel shares one viewport, so moving between triggers resizes and slides a single surface rather than swapping popups. `columns` widens a panel's grid, per menu or per entry; `orientation="vertical"` stacks the entries and opens panels to the side; an entry without `href` renders a `<button>` and calls `onSelect`, which is what a router link wants.

- d709dd2: **Breaking (small):** `INumberInput`'s `class` now lands on the root rather than on the `<input>`.

  The stepper is positioned against the root and the input fills it, so a width written through `class` narrowed the field while leaving the arrows pinned to the root's far edge — floating in space beside the control. Sizing the box that defines the field is the only placement where the two cannot come apart, and it matches `IInput`, whose `class` already goes to the element carrying the field chrome.

  Reach the input itself with `ui.input`. Attributes are unaffected: they still go to the `<input>`, so `aria-label` continues to name the control. If you were working around the old behaviour with `:ui="{ root: 'max-w-xs' }"`, that still works — `class` now does the same thing.

- d709dd2: Add `IPopover`, `IContextMenu`, `IMenubar` and `IToolbar`.

  `IPopover` anchors a panel to its trigger, for content too big for a tooltip and too small for a dialog — with `modal` to trap focus when it holds a form, an optional close button the panel reserves room for, and a `close` function handed to the default slot. A width is part of the default on purpose: an unconstrained popover lets a paragraph stretch across the viewport.

  `IContextMenu` and `IMenubar` share `IDropdownMenu`'s entry shape, renderer and theme rather than duplicating them — Reka's context, menubar and dropdown parts are all thin wrappers over the same `Menu` primitives, so there is one menu in this library wearing three ways of being opened. `IContextMenu` reports opening through `update:open` rather than taking a `v-model:open`: a context menu appears where the pointer is, so opening one from code would have nowhere to put it.

  `IToolbar` gives a row of controls a single Tab stop with arrow keys moving between them. Its buttons are `IButton`s in ghost form, so a toolbar button and a button elsewhere cannot drift apart, and anything beyond buttons, links and separators goes in the default slot — `IToggleGroup` nests inside without fighting it for the same keys.

- 39de323: Add the page layout set: `IAppShell`, `ISidebar`, `IPageHeader` and `IContainer`.

  `IAppShell` is a frame and nothing more — every region is a slot, so the top bar, sidebar and footer stay yours. Its `scroll` prop picks between two genuinely different layouts: `"main"` pins the shell to the viewport and scrolls only the content column, while `"page"` scrolls the document with a sticky header and sidebar, which is the one anchor links and scroll restoration work with. In `page` mode the shell measures its own header and publishes the height as `--iryx-shell-header-height`, because a sticky sidebar would otherwise park behind a sticky header and CSS has no way to say "below the header" on its own.

  `ISidebar` takes links, optionally grouped into sections, with collapsible groups, badges and a `v-model:collapsed` icons-only mode. Section headings live under a `section` key rather than `label`: a collapsible group carries `items` too, so one shared key would mean guessing which of the two an entry is, and an icon-less group would quietly render as a heading.

  `IPageHeader` puts the title and action row on one line from `sm` up and stacks them below it, and `IContainer` is the shared reading measure.

- d709dd2: Add `IPinInput` and `ITagsInput`, completing the form set.

  `IPinInput` gives one cell per character for a short code, with `group-size` to break a long one into readable chunks, `mask` for a PIN, and `otp` so a phone can offer the code straight from the SMS that carried it. Its model is a plain **string** rather than Reka's array of single characters — a code is a string in the request body, the validator and the email it arrived in.

  `ITagsInput` collects a list as removable tags, with a configurable delimiter, `max`, duplicate control, and paste splitting. The field grows as tags wrap rather than scrolling them out of sight, the name lands on the `<input>` rather than the box around it, and each delete control is named after the tag it removes instead of being one of a row of identical crosses. Inside an `IFormField` it inherits the id, invalid state and error's `aria-describedby`.

- d709dd2: `IProgress` now takes `segments` — runs that share one track, for storage by file type, a budget by category, a release by status. Each carries its own value and variant; `modelValue` is ignored and the accessible value becomes their sum.

  A run with a `label` gets a legend row beneath the track. That legend is text rather than a tooltip on purpose: the runs are hidden from assistive technology through the track, so it is the only place the breakdown can be read. A run with no `variant` takes the new `neutral` fill, which reads the same as the unclaimed remainder.

  Segments can sum past `max` — a disk that grew, a budget overspent — so runs are clamped cumulatively rather than scaled. The bar fills and stops instead of painting outside the track, the last run to reach the end keeps the rounded corner, and the legend still reports what each run asked for.

- d709dd2: Every animation and transition now honours `prefers-reduced-motion`. The guard ships in `theme.css`, so importing it is all it takes.

  Durations drop to `0.01ms` rather than the animation being removed: Reka unmounts a dialog, drawer, popover or toast when its exit animation raises `animationend`, and `animation: none` means that event never fires and the overlay stays mounted forever. The two looping indicators are handled separately, because running them once would leave them wherever their last keyframe lands — the indeterminate `IProgress` bar parks at the start of its track instead of sliding past the end of it, and `ITable`'s loading bar becomes a steady rule.

  Also fixes the appearance-switch guard, which suppressed transitions during a light/dark switch and removed itself on the next animation frame. A background tab has no next frame — and a system appearance change fires there regardless — so the guard could outlive the switch and leave every transition and animation on the page dead until reload. It now clears on a timer as well, and shortens durations rather than setting `animation: none`.

- d709dd2: Add `IScrollArea` and `ISplitter`.

  `IScrollArea` replaces the platform's scrollbar with a thin themed one — but only the _bar_. The viewport still scrolls natively, so wheel, trackpad, keyboard and touch behave exactly as the platform intends and none of the usual costs of hijacking scrolling apply. It is a different job from `IScrollFade`, which leaves the native bar alone and fades the content edges instead.

  `ISplitter` divides resizable panes with a draggable handle, horizontally or vertically, with per-panel minimum and maximum sizes, collapsing, and an `auto-save-id` that remembers a reader's arrangement across reloads. The handle keeps a padded hit area larger than its visible rule, because a 1px target is unusable with a mouse and impossible on a trackpad.

- d709dd2: New component: `IScrollFade` — a scroll container whose edges fade while there is more to scroll, on either axis. It answers the question a cropped list always raises without waiting for a scrollbar to appear and say so.

  The fade is a **mask**, not an overlaid gradient. An overlay has to be painted in the container's own background colour, which is a guess: on a card, a muted panel or an image the guess is visibly wrong. A mask removes pixels instead, so whatever is behind shows through and it is correct on every surface. The trade-off is that a mask applies to everything the element paints: a border on the component, its scrollbar and any `position: sticky` child fade with the content. Put the frame on a wrapper and keep sticky headers outside.

  Edges are measured rather than assumed: `scroll` for position, a `ResizeObserver` on both the container and its children for extent, and a `MutationObserver` for rows added or removed, which changes the scroll extent without resizing anything already observed. There is a pixel of slack at both ends, because fractional layout leaves `scrollTop` a hair short of its maximum and an exact comparison paints a trailing fade on a list already scrolled to the bottom.

  `fadeStart` / `fadeEnd` switch an edge off, `size` sets the length, and the default slot receives `{ atStart, atEnd, overflowing }` — also exposed on the root as `data-at-start`, `data-at-end` and `data-overflowing` so a "more below" hint can be pure CSS.

- d709dd2: Add `ISignaturePad` — a signature drawn with a pointer, or typed by anyone who cannot.

  The first component here that is not a Reka wrapper: canvas and pointer events all the way down. The pen thins as the hand speeds up, because a constant width reads as a traced outline rather than handwriting; the canvas is backed at the device's pixel ratio, so a signature is not soft on a modern screen; and the surface sets `touch-action: none`, without which a finger signature scrolls the page instead of drawing.

  The typed field is on by default and is not a nicety — a canvas cannot be drawn on with a keyboard, so without it the control is unusable for anyone who does not point. The typed name is rendered onto the same canvas in a script face, so the model is a PNG data URL either way and nothing downstream has to know which route was taken. `null` when unsigned, so `required` works in an `IForm` without a special case, and a one-point stroke does not count as a signature.

- d709dd2: **Breaking:** `ITable`'s `loadingRows` prop is now `skeletonRows`. It only ever controlled the skeleton placeholders, and now that `loading` also drives a refresh bar the old name read as though it governed both. Rename the prop at call sites; nothing else about it changed.
- d709dd2: Add `ISlider` — a value or a range on one track, with an optional label, live value and min/max scale.

  The model keeps whatever shape you give it: a plain number stays a number, an array stays an array, so a slider drops into an existing form without reshaping the model around it. `formatValue` drives the readout, the scale captions and each thumb's accessible label together, and `valueCommit` fires once when the drag ends for the value worth saving.

- d709dd2: `ISwitch` now takes a `size` prop (`sm` / `md` / `lg`), matching `ICheckbox`. The track, thumb and travel scale together, so the thumb rests the same 2px inside the track edge at every size, and the small track is nudged to centre against a label first line.
- d709dd2: `ITable` now shows an indeterminate bar on the rule between the header and the first row while a refresh is in flight. `loading` previously only did something when the table had no rows to show, so a page change or re-sort in server mode gave no sign that anything was happening. Skeletons still cover the first load; the two indicators are alternatives and never appear together.
- d709dd2: Add a `row-actions` slot to `ITable`. Filling it adds a trailing column, sized to its content and pinned to the end, for a per-row menu; `actionsLabel` names the blank header for screen readers. A click inside the column does not reach the row, so it can be combined with `clickableRows`.
- d709dd2: Add `IToggle` and `IToggleGroup` — a button that stays pressed, and a row of them sharing one Tab stop.

  `IToggle` borrows `IButton`'s geometry exactly: the same five heights, so the two line up in a toolbar, and the same `data-icon="inline-start"` / `"inline-end"` markers, so the padding tightens on the side an icon sits on. There is one look on purpose — a toggle has to read as a button whether or not it is pressed.

  `IToggleGroup` is items-driven like `ITabs` and works in `single` or `multiple` mode. Its `joined` and `plain` variants decide only how the items are spaced, since an item is exactly the button `IToggle` renders. With `icon-only`, each item's hidden label becomes its accessible name rather than being thrown away.

- d709dd2: Add `ITree` and `ITimeField`.

  `ITree` is an expandable nested list — a file browser, a category hierarchy. Both models are arrays of **values**: `v-model` for what is selected, `v-model:expanded` for what is open. Reka tracks the selection as item objects; that stays inside the component, because a list of strings is what survives a round trip through a URL, a store or a request body. Depth is padding on the row rather than a nested container, so a row's hover and selection background still spans the full width of the tree.

  `ITimeField` enters a time one segment at a time, each its own arrow-key control. The model is a zero-padded `HH:mm` (or `HH:mm:ss`) **string** on a 24-hour clock, never a `Date` — a `Date` carries a date and a time zone nobody asked for, and padding means the value sorts and compares as a plain string. `hourCycle` is a display choice only; the model stays 24-hour either way. `toTime()` and `toIsoTime()` are exported alongside the existing date helpers.

### Patch Changes

- d709dd2: Give `ICard`'s title a real line box. It was set in `leading-none`, which clamps the line to the cap height and left the description crowding it; the header now uses `leading-snug` with a slightly wider gap.
- d709dd2: `IDatePicker` and `IDateRangePicker` now render calendar day numbers with `tabular-nums`. A proportional `1` is narrower than a `0`, so days sat off-centre in their pill and the week columns visibly wobbled down the month.
- 11eddbf: Stop importing `node:process` in the charting code. `cartesian.ts` used it for a dev-only `NODE_ENV` check, which put a Node builtin into a browser bundle — every browser bundler externalises it, so `process` was undefined at runtime and any chart with more than eight series threw instead of warning. It now reads `process.env.NODE_ENV` as a bare global, which bundlers replace statically and can drop entirely from a production build.
- d709dd2: `IRadioGroup`'s `orientation` now changes the layout as well as the keyboard direction. It was forwarded to Reka, so the arrow keys already followed it, but the root stayed a single-column grid — `horizontal` now wraps the options into a row.
- 3c3de7b: Rework `ISidebar`'s submenu collapse, and fix two defects in it.

  The group chevron never rotated: `data-state` lives on the trigger, not on the icon inside it, so the `data-[state=open]:` selector on the chevron matched nothing. It now reads the trigger's group. The transition also has to name `rotate` rather than `transform`, since Tailwind v4's `rotate-*` sets the independent `rotate` property.

  The panel also had no height animation at all — it faded while popping to full height, so every row below it jumped. It now animates height against the measurement Reka publishes as `--reka-collapsible-content-height`, with the rows lifting and fading in on their own curve. The animated element had to be stripped of its margin and padding for that to work, since margin is not part of an animated height and would survive the close as a gap under a shut panel; the spacing moved to an inner wrapper, reachable as `ui.groupInner`.

  Nested rows are now aligned by arithmetic instead of a chosen padding: the rule sits on the centre of the parent's icon, and a child's label lands in the parent's label column. The previous value put child labels three pixels off their parent's, which read as a mistake rather than as either alignment.

- d709dd2: `ISkeleton` now merges `class` onto its root. With `lines` above 1 the class landed on every line instead of the wrapper, so a width cap sized each line rather than the stack and the block could not be centred by its container.
- d709dd2: `IStepper` layout fixes. Vertical steps laid the separator out beside the trigger instead of below it, because the item stayed a flex row — the rule now runs down between the steps, aligned to the centre of the indicator. In horizontal steppers the last item no longer claims an equal share of the row: it has no separator to fill, so the track used to end in a step-wide gap that read as the whole stepper being shifted left.
- d709dd2: Fix the case of sortable column headers in `ITable`. The header cell is uppercase, but its sort button did not inherit `text-transform`, so sortable columns rendered in sentence case beside their uppercase neighbours.

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
