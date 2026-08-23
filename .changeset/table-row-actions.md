---
"iryx-ui": minor
---

Add a `row-actions` slot to `ITable`. Filling it adds a trailing column, sized to its content and pinned to the end, for a per-row menu; `actionsLabel` names the blank header for screen readers. A click inside the column does not reach the row, so it can be combined with `clickableRows`.
