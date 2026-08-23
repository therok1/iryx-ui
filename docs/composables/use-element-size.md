---
eyebrow: Composables
---

<script setup lang="ts">
import { useElementSize } from 'iryx-ui'
import { ref } from 'vue'

const box = ref<HTMLElement>()
const { width, height } = useElementSize(box)
</script>

# useElementSize

An element's rendered width and height, kept up to date with a `ResizeObserver`. The charts use it to draw in real pixels.

<Demo stack>
<template #demo>
<div ref="box" class="flex min-h-24 w-full max-w-lg resize items-center justify-center overflow-auto rounded-lg border border-border p-4">
<span class="font-mono text-sm text-muted-foreground">{{ Math.round(width) }} × {{ Math.round(height) }}</span>
</div>
<p class="text-xs text-muted-foreground">Drag the bottom-right corner in either direction, or resize the window.</p>
</template>

```vue
<script setup lang="ts">
import { useElementSize } from 'iryx-ui'
import { ref } from 'vue'

const box = ref<HTMLElement>()
const { width, height } = useElementSize(box)
</script>

<template>
  <div ref="box">
    {{ width }} × {{ height }}
  </div>
</template>
```
</Demo>

| Argument | Type | |
| --- | --- | --- |
| `target` | `Ref<HTMLElement \| undefined>` | The element to watch. A template ref |

| Returned | Type | |
| --- | --- | --- |
| `width` | `Ref<number>` | Client width in px |
| `height` | `Ref<number>` | Client height in px |

## Notes

The size is seeded from layout before the observer first fires, so the first frame draws at the real width rather than at zero — and where `ResizeObserver` is missing, that seed is the measurement.

One observer is kept per element, disconnected when the target changes or the component unmounts.
