---
"iryx-ui": patch
---

Attributes now reach the control they belong to in `INumberInput`, `ISelect`, `ICombobox` and `IProgress`. Each of these renders a wrapper — or, for `ISelect` and `ICombobox`, a renderless or `display: contents` root — and an attribute left to fall through landed there instead of on the field. An `aria-label` therefore never named anything, so a component with no visible label had no accessible name.

`IProgress`'s `label` prop now also names the bar for assistive tech. It rendered visible text but was never associated with the `progressbar` element, so a labelled bar still announced as an unnamed one.

Stop inlining declared dependencies into the bundle. `@hugeicons/core-free-icons`, `@hugeicons/vue` and `@internationalized/date` were listed as dependencies *and* copied into `dist`, so consumers installed them and then received a second private copy — around 38 kB of duplicate code, and two module instances of `@internationalized/date`, which is enough to break an `instanceof CalendarDate` check across the boundary.
