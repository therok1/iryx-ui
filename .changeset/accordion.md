---
"iryx-ui": minor
---

New component: `IAccordion` — a disclosure list on Reka's Accordion, driven by the same `items` rule as the rest of the library. `type="multiple"` lets several panels stand open and turns the model into an array; `collapsible` lets the open panel close again in `single` mode; `variant` is `plain` (rules between rows) or `outline` (a panel each).

This finally exposes the collapsible behaviour that has been buried inside `ISidebar` since the navigation work, with the two lessons that came out of it baked in: the animated element carries no padding, because margin is not part of an animated height and survives the close as a gap under a shut panel; and the chevron reads `data-state` from the trigger through a group, because `data-state` sits on the trigger and a bare `data-[state=open]:` on the icon inside it matches nothing at all.
