---
"iryx-ui": minor
---

`IDropdownMenu` takes a `header` slot

A block above the items — an account's name and address, a workspace, a plan. It renders outside the item list, so it takes no stop in the arrow-key order and typeahead ignores it. An entry with no `onSelect` was the only way to do this before, and a group label is the wrong thing for an identity: it is neither a heading for the items below nor something to act on.
