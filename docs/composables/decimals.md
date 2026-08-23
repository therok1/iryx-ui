---
eyebrow: Composables
---

<script setup lang="ts">
import { addDecimals, compareDecimals, formatForLocale, roundDecimal } from 'iryx-ui'
import { computed, ref } from 'vue'

const a = ref('0.10')
const b = ref('0.20')

const sum = computed(() => addDecimals(a.value, b.value) ?? '—')
const float = computed(() => String(Number(a.value) + Number(b.value)))
</script>

# Decimal helpers

Exact arithmetic on decimal strings. Values are scaled to integers and computed with `BigInt`, so nothing passes through `Number` unless you ask it to. [`INumberInput`](/components/number-input) is built on these.

<Demo stack>
<template #demo>
<div class="flex flex-col items-center gap-3 text-center">
<div class="flex items-center gap-2">
<INumberInput v-model="a" class="w-32" />
<span class="text-muted-foreground">+</span>
<INumberInput v-model="b" class="w-32" />
</div>
<p class="font-mono text-sm">addDecimals → <span class="text-success">{{ sum }}</span></p>
<p class="font-mono text-sm text-muted-foreground">Number + Number → {{ float }}</p>
</div>
</template>

```ts
import { addDecimals } from 'iryx-ui'

addDecimals('0.10', '0.20') // '0.30'
Number('0.10') + Number('0.20') // 0.30000000000000004
```
</Demo>

Binary floating point cannot represent most decimal fractions: `0.1 + 0.2` is not `0.3`, and `10.00` becomes `10` as soon as it is a `Number`, losing the cents column.

## The helpers

| Function | Signature | |
| --- | --- | --- |
| `addDecimals` | `(a: string, b: string) => string \| undefined` | Exact addition; `undefined` if either side is invalid |
| `compareDecimals` | `(a: string, b: string) => number` | `-1`, `0`, `1`, or `NaN` for invalid input |
| `roundDecimal` | `(value: string, precision: number) => string \| undefined` | Round to a number of places |
| `clampDecimal` | `(value: string, min?: string, max?: string) => string` | Constrain to a range |
| `isDecimal` | `(value: string) => boolean` | Whether the string is a canonical decimal |
| `formatForLocale` | `(value: string, locale: string, precision?: number) => string` | For display: grouping and the locale's separator |
| `parseFromLocale` | `(input: string, locale: string) => string \| undefined` | Back from what a reader typed |
| `toEditable` | `(value: string, locale?: string) => string` | The form a reader edits, without grouping |
| `localeSeparators` | `(locale: string) => { decimal, group }` | The separators a locale uses |

## Display and back

`formatForLocale` and `parseFromLocale` are a pair. The first is for showing a number — grouping separators, the locale's decimal mark. The second turns what someone typed back into a canonical decimal string, which is the only form the arithmetic accepts.

```ts
formatForLocale('1234.5', 'de-DE', 2) // '1.234,50'
parseFromLocale('1.234,50', 'de-DE') // '1234.5'
```

Keep the canonical form in your model and the locale form only on screen.
