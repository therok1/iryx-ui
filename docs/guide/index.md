# Introduction

Iryx UI is a Vue 3 component library. Reka UI supplies the behaviour — focus management, keyboard interaction, ARIA — and Tailwind CSS v4 supplies the styling, through tokens you can replace.

It is not a design system you have to adopt wholesale. Three escape hatches exist at every level, and they are meant to be used:

- `class` on any component, merged intelligently so `class="rounded-full"` beats the built-in radius rather than fighting it.
- `ui` to reach individual slots of a multi-part component, like a dialog's overlay or a switch's thumb.
- `unstyled` to drop the built-in classes entirely and keep only the behaviour — per component, or globally.

## What's in it

42 components across forms, actions, overlays, feedback, navigation, data display and charts. The [component overview](/components/) lists them all.

Alongside them are the composables the components use themselves: `useForm`, `useDataTable`, `useToast`, `useConfirm`, `useAppearance`, and the scale and decimal helpers behind the charts and number fields.

## What it is not

There is no virtualized table, no drag-and-drop, no rich text editor, no date-time picker with time zones. Charts cover bar, line, area and sparkline, and stop there — for anything more exotic, Chart.js is the intended answer rather than a gap to be filled.

These are decisions rather than a roadmap. A small set done properly is the point.

## Requirements

- Vue 3.5 or newer
- Tailwind CSS v4

Nuxt 3 and 4 are supported through the module. Every component renders on the server.

Next: [installation](/guide/installation).
