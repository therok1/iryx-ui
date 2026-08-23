---
eyebrow: Guide
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { theme } = useData()
</script>

# Introduction

Iryx UI is a Vue 3 component library. Reka UI handles behaviour — focus management, keyboard interaction, ARIA — and Tailwind CSS v4 handles styling, through tokens you can replace.

Adopt as much of it as suits you. Every component offers three ways to take the styling back:

- `class` on any component, merged so `class="rounded-full"` replaces the built-in radius rather than sitting beside it.
- `ui` to reach individual slots of a multi-part component, like a dialog's overlay or a switch's thumb.
- `unstyled` to drop the built-in classes entirely and keep only the behaviour — per component, or globally.

## What's included

{{ theme.componentCount }} components across forms, actions, overlays, feedback, navigation, data display and charts. The [component overview](/components/) lists them all.

Alongside them are the composables the components use themselves: `useForm`, `useDataTable`, `useToast`, `useConfirm`, `useAppearance`, and the scale and decimal helpers behind the charts and number fields.

## Requirements

- Vue 3.5 or newer
- Tailwind CSS v4

Nuxt 3 and 4 are supported through the module. Every component renders on the server.

Next: [installation](/guide/installation).
