---
'iryx-ui': minor
---

`IInput` gains `leading` and `trailing` slots, plus `clearable`, `loading` and `debounce` props.

**Breaking:** `IInput` now renders its chrome on a wrapper element rather than on the `<input>` itself, so affix content can take real space in the field instead of hiding long values under absolutely positioned padding. `class` lands on that wrapper; reach the inner control with `ui.input`. Stray attributes (`name`, `autocomplete`, `maxlength`) still forward to the `<input>`. Styling that targeted the input element directly needs moving to the wrapper.
