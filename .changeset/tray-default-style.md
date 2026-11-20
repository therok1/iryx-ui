---
"iryx-ui": major
---

New default look. Buttons, fields, toggles and pagination items are pills. Textareas and signature pads keep `rounded-xl`; tags inputs are `rounded-2xl` with pill tags. Popups (select, combobox, dropdown menu, date picker, popover, hover card) are `rounded-2xl`, with `rounded-xl` items inside. Calendar days, the calendar's month arrows and the date picker's presets and Today button are round. To get the old shape back on a component, use `class="rounded-xl"` or `ui`.

New `ITray`: a muted panel with a titled header and an `#actions` slot. Direct children get the tray's inner radius and no shadow.

Sidebar links are pills. Inside `IAppShell` they use foreground text, and the active link is a white pill with a border.

Vertical `IButtonGroup` rounds its outer corners `rounded-2xl` instead of pill ends.

`INumberInput` stepper is wider and its arrows sit inside the pill curve.

`IEditable` preview highlight and controls are pills.

`IMenubar` bar and triggers are pills.

`INavigationMenu` links are pills and its panel is `rounded-2xl`.

`IPinInput` cells are circles, and the `IPasswordInput` reveal button is round.

Segmented `ITabs` (track, indicator and triggers) are pills.

Vertical joined `IToggleGroup` rounds its outer corners `rounded-2xl`.

`IToolbar` is a pill (vertical: `rounded-2xl`).

`ITree` rows are pills, like sidebar links.

`ISiteHeader` links and menu rows, and the `IBrowserFrame` address bar, are pills.
