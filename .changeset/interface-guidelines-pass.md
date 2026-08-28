---
"iryx-ui": patch
---

Accessibility and interaction fixes from a Web Interface Guidelines pass:

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
