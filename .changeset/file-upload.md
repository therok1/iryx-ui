---
'iryx-ui': minor
---

Add `IFileUpload` — a drag-and-drop file field with `accept`, `maxSize` and `maxFiles`, image thumbnails and a remove action.

The model is always a `File[]`, even without `multiple`; without it, picking again replaces rather than appends. `accept` is enforced in the component as well as on the input, since a dragged-in file bypasses the native filter. Refused files raise `@reject` with `{ file, reason }` (`'type'`, `'size'` or `'count'`), and every built-in string is a prop. Thumbnail object URLs are revoked when a file leaves the list or the component unmounts.
