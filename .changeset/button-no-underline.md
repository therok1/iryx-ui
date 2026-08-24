---
"iryx-ui": patch
---

`IButton` no longer picks up an underline from the prose around it. A button rendered `as="a"` lands in whatever link styles its page defines, and inside documentation or article markup that usually means an underline on hover — which made a solid button read as a link. The `link` variant still underlines on hover, as it always did.
