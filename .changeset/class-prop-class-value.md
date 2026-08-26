---
"iryx-ui": minor
---

Widen every `class` prop from `string` to the new exported `ClassValue`, so array syntax — `:class="[base, active && 'ring-2']"` — type-checks. Object syntax stays excluded, since `tailwind-merge` cannot merge it.
