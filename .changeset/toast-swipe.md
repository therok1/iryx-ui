---
"iryx-ui": patch
---

A swiped toast now follows the pointer. The gesture already dismissed it, but nothing consumed the offsets Reka writes during a swipe, so the card stayed put until it vanished.
