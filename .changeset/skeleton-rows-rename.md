---
"iryx-ui": minor
---

**Breaking:** `ITable`'s `loadingRows` prop is now `skeletonRows`. It only ever controlled the skeleton placeholders, and now that `loading` also drives a refresh bar the old name read as though it governed both. Rename the prop at call sites; nothing else about it changed.
