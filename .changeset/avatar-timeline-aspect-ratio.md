---
"iryx-ui": minor
---

Add `IAvatar`, `IAvatarGroup`, `ITimeline` and `IAspectRatio`.

`IAvatar` treats initials as the normal state rather than a failure state — most people in most applications have never uploaded a photo. Initials come from the first and last words of a name, so "Ana María Ruiz Vega" gives AV rather than four unreadable letters, and the presence dot carries a name because a colour says nothing on its own. `IAvatarGroup` overlaps them into a stack with a `max` and a "+n" chip, ringing each avatar in the page background so the overlap reads as depth.

`ITimeline` is an ordered run of events — an audit trail, a delivery's progress. It is deliberately not `IStepper`: a stepper is a process you move through with steps still to come, a timeline is a record of what already happened. The connecting spine is drawn per item so the last one can omit it, rather than one line behind the column that would trail off past the final marker.

`IAspectRatio` holds a box at a fixed ratio so content that sizes itself cannot shift the page when it loads.

`IPopover` gains a `title` prop, and no longer reserves room for its close button by padding the whole panel — that indented every row, so a form inside could never reach the full width. Only the title makes way for the button now, because the top line is the only one it can collide with.
