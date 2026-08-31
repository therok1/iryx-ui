---
eyebrow: Overlays
description: Every command in the app behind one shortcut. It opens on mod+K, filters as you type, and is driven entirely by keyboard.
---

<script setup lang="ts">
import {
  Archive02Icon,
  ArrowRight01Icon,
  DashboardSquare01Icon,
  Invoice01Icon,
  Moon02Icon,
  PlusSignIcon,
  Settings01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { ref } from 'vue'

const open = ref(false)
const grouped = ref(false)
const chosen = ref('')

const flat = [
  { label: 'Go to overview', icon: DashboardSquare01Icon, onSelect: () => (chosen.value = 'Overview') },
  { label: 'Go to invoices', icon: Invoice01Icon, onSelect: () => (chosen.value = 'Invoices') },
  { label: 'Go to clients', icon: UserGroupIcon, onSelect: () => (chosen.value = 'Clients') },
  { label: 'Open settings', icon: Settings01Icon, onSelect: () => (chosen.value = 'Settings') },
]

const groups = [
  {
    label: 'Navigation',
    items: [
      { label: 'Overview', icon: DashboardSquare01Icon, shortcut: 'g o', keywords: ['home', 'dashboard'], onSelect: () => (chosen.value = 'Overview') },
      { label: 'Invoices', icon: Invoice01Icon, shortcut: 'g i', keywords: ['billing', 'receivables'], onSelect: () => (chosen.value = 'Invoices') },
      { label: 'Clients', icon: UserGroupIcon, shortcut: 'g c', keywords: ['customers', 'companies'], onSelect: () => (chosen.value = 'Clients') },
    ],
  },
  {
    label: 'Actions',
    items: [
      { label: 'Create invoice', icon: PlusSignIcon, shortcut: 'mod n', onSelect: () => (chosen.value = 'Create invoice') },
      { label: 'Toggle dark mode', icon: Moon02Icon, onSelect: () => (chosen.value = 'Toggle dark mode') },
      { label: 'Archive invoice', icon: Archive02Icon, disabled: true },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation', icon: ArrowRight01Icon, href: 'https://github.com/therok1/iryx-ui', onSelect: () => (chosen.value = 'Documentation') },
    ],
  },
]
</script>

# ICommandPalette

Every command in the app behind one shortcut. It opens on <IKbd keys="mod+k" size="xs" />, filters as you type, and is driven entirely by keyboard.

<Demo stack>
<template #demo>
<IButton variant="outline" @click="grouped = true">Open the palette</IButton>
<p v-if="chosen" class="text-sm text-muted-foreground">You chose: <strong class="text-foreground">{{ chosen }}</strong></p>
<ICommandPalette v-model:open="grouped" :items="groups" :hotkey="null" placeholder="Search commands…" />
</template>

```vue
<script setup lang="ts">
const open = ref(false)

const commands = [
  {
    label: 'Navigation',
    items: [
      { label: 'Invoices', icon: Invoice01Icon, shortcut: 'g i', keywords: ['billing'], onSelect: () => router.push('/invoices') },
      { label: 'Clients', icon: UserGroupIcon, shortcut: 'g c', onSelect: () => router.push('/clients') },
    ],
  },
  {
    label: 'Actions',
    items: [
      { label: 'Create invoice', icon: PlusSignIcon, shortcut: 'mod n', onSelect: create },
    ],
  },
]
</script>

<template>
  <IButton variant="outline" @click="open = true">
    Open the palette
  </IButton>

  <ICommandPalette
    v-model:open="open"
    :items="commands"
    placeholder="Search commands…"
  />
</template>
```
</Demo>

Type `bill` in the palette above and **Invoices** survives: `keywords` adds search terms that never appear on screen, such as synonyms or a page's former name.

## Flat commands

Groups are optional. A bare array is a single list, and entries written before or between groups keep their position.

<Demo stack>
<template #demo>
<IButton variant="outline" @click="open = true">Open a flat palette</IButton>
<ICommandPalette v-model:open="open" :items="flat" :hotkey="null" :footer="false" />
</template>

```vue
<ICommandPalette
  v-model:open="open"
  :footer="false"
  :items="[
    { label: 'Go to overview', onSelect: () => router.push('/') },
    { label: 'Go to invoices', onSelect: () => router.push('/invoices') },
    { label: 'Go to clients', onSelect: () => router.push('/clients') },
    { label: 'Open settings', onSelect: () => router.push('/settings') },
  ]"
/>
```
</Demo>

## The shortcut that opens it

`hotkey` defaults to `mod+k`, where `mod` is Command on Apple platforms and Control everywhere else. It is bound on the window, so it works wherever focus is.

```vue
<ICommandPalette v-model:open="open" :items="commands" hotkey="mod+shift+p" />

<!-- Bind nothing; drive `open` yourself -->
<ICommandPalette v-model:open="open" :items="commands" :hotkey="null" />
```

The demos on this page pass `:hotkey="null"` so they cannot fight the site's own palette. Press <IKbd keys="mod+k" size="xs" /> anywhere on these docs to see the real one.

## Shortcuts on a row

`shortcut` is display only — bind the chord yourself, where the command lives. Write it as spaced keys and each is rendered as its own `kbd`: `mod n`, `g i`, `⇧ ⌘ P`.

## Disabled commands

A command with `disabled` still appears, struck through and carrying `aria-disabled`, but cannot be chosen and is skipped by the arrow keys. That is **Archive invoice** in the first palette on this page.

## Links

Give a command an `href` and its row renders as an `<a>`, so middle-click, <IKbd keys="mod" size="xs" />-click and "open in new tab" all work. `onSelect` still fires for a plain click.

```ts
const command = { label: 'Documentation', href: '/docs', onSelect: () => track('help') }
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `(CommandItem \| CommandGroup)[]` | — | Commands, optionally grouped |
| `placeholder` | `string` | `'Search commands…'` | Text in the field |
| `emptyText` | `string` | `'No matching commands.'` | Shown when nothing matches |
| `label` | `string` | `'Command palette'` | Accessible name for the dialog |
| `hotkey` | `string \| null` | `'mod+k'` | Chord that opens it; `null` binds nothing |
| `closeOnSelect` | `boolean` | `true` | Close once a command is chosen |
| `footer` | `boolean` | `true` | The keyboard-hint row along the bottom |
| `unstyled` | `boolean` | — | Drop built-in classes |
| `class` | `string` | — | Merged onto the panel |
| `ui` | `{ overlay?, content?, header?, icon?, input?, viewport?, group?, groupLabel?, item?, itemIcon?, itemLabel?, shortcut?, key?, empty?, footer? }` | — | Per-element class overrides |

`v-model:open` controls it. Nothing is rendered while it is closed.

## Events and slots

| Event | Payload | When |
| --- | --- | --- |
| `select` | `CommandItem` | A command was chosen, alongside its own `onSelect` |

| Slot | Props | When to use it |
| --- | --- | --- |
| `item` | `{ item }` | Render a row yourself — a description line, a badge |
| `empty` | `{ query }` | Replace the no-results text |
| `footer` | — | Replace the hint row |

## Item shapes

```ts
interface CommandItem {
  label: string
  icon?: IconLike
  /** Display only, split on spaces into separate keys. */
  shortcut?: string
  /** Extra search terms that never appear on screen. */
  keywords?: string[]
  href?: string
  disabled?: boolean
  onSelect?: () => void
}

interface CommandGroup {
  label: string
  items: CommandItem[]
}
```

A group whose commands all fail the filter is dropped, heading included.

The panel sits at `12vh` rather than centred, so the field stays put as the list grows and shrinks.
