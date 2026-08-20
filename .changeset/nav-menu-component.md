---
"iryx-ui": minor
---

Add `INavigationMenu`, the app-level navigation bar built on Reka's `NavigationMenu`.

Entries are data, following the same rule `IDropdownMenu` uses: an entry with its own `items` becomes a panel trigger, everything else is a plain link. Every panel shares one viewport, so moving between triggers resizes and slides a single surface rather than swapping popups. `columns` widens a panel's grid, per menu or per entry; `orientation="vertical"` stacks the entries and opens panels to the side; an entry without `href` renders a `<button>` and calls `onSelect`, which is what a router link wants.
