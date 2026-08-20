---
"iryx-ui": patch
---

Rework `ISidebar`'s submenu collapse, and fix two defects in it.

The group chevron never rotated: `data-state` lives on the trigger, not on the icon inside it, so the `data-[state=open]:` selector on the chevron matched nothing. It now reads the trigger's group. The transition also has to name `rotate` rather than `transform`, since Tailwind v4's `rotate-*` sets the independent `rotate` property.

The panel also had no height animation at all — it faded while popping to full height, so every row below it jumped. It now animates height against the measurement Reka publishes as `--reka-collapsible-content-height`, with the rows lifting and fading in on their own curve. The animated element had to be stripped of its margin and padding for that to work, since margin is not part of an animated height and would survive the close as a gap under a shut panel; the spacing moved to an inner wrapper, reachable as `ui.groupInner`.

Nested rows are now aligned by arithmetic instead of a chosen padding: the rule sits on the centre of the parent's icon, and a child's label lands in the parent's label column. The previous value put child labels three pixels off their parent's, which read as a mistake rather than as either alignment.
