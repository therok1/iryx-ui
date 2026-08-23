---
eyebrow: Layout & structure
---

# IApp

The root wrapper. It provides the reactive config every component reads, applies a theme, sets the starting appearance, and forwards Reka UI's `ConfigProvider` options for direction and locale.

```vue
<template>
  <IApp appearance="system" theme="violet">
    <RouterView />

    <IToaster />
    <IConfirmDialog />
  </IApp>
</template>
```

It renders no element of its own by default, so it can wrap an app without adding a box to the layout.

## What it is for

Nothing requires `IApp` — the plugin's install-time options cover the same ground. Reach for it when a setting has to change while the app is running, because the props are reactive and the plugin options are not:

```vue
<!-- A theme picker in the app's settings -->
<IApp :theme="chosenTheme">
  <RouterView />
</IApp>
```

It is also the natural place to mount the hosts [`useToast()`](/composables/use-toast) and [`useConfirm()`](/composables/use-confirm) need, since both want to exist exactly once.

## Theme

`theme` takes a preset name or a full theme object, and applies it the moment it changes. Clearing the prop restores the tokens from `theme.css`.

```vue
<IApp theme="rose">…</IApp>
<IApp :theme="{ light: { primary: 'oklch(0.62 0.15 155)' }, dark: { primary: 'oklch(0.72 0.14 155)' } }">…</IApp>
```

See [theming](/guide/theming) for the token list.

## Appearance

`appearance` is a *starting* value, not a controlled one: a preference the reader has already stored wins over it, so setting `system` does not overwrite someone who chose dark last week.

Change the prop later and it is treated as an instruction instead, and applied directly.

```vue
<IApp appearance="system">…</IApp>
```

Leave it off entirely and `IApp` stays out of appearance altogether, which is what you want if [`useAppearance()`](/composables/use-appearance) is driving it from somewhere else.

## Unstyled

`unstyled` strips the built-in classes from every component below it, leaving the behaviour. Unlike the plugin option, it is reactive.

```vue
<IApp unstyled>
  <!-- Reka primitives with your own classes -->
</IApp>
```

## Rendering an element

`as` defaults to `template`, meaning no wrapper element at all. Pass a tag when you want `IApp` to own the outer box:

```vue
<IApp as="div" class="min-h-svh bg-background text-foreground">
  <RouterView />
</IApp>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | `Theme \| 'violet' \| 'rose'` | — | Applied on change; cleared when unset |
| `appearance` | `'light' \| 'dark' \| 'system'` | — | Starting appearance; a stored preference wins |
| `unstyled` | `boolean` | — | Drop built-in classes for everything below |
| `as` | `string` | `'template'` | Element to render; `template` renders none |
| `class` | `string` | — | Applied when `as` renders an element |

Reka UI's `ConfigProvider` props are forwarded: `dir`, `locale`, `scrollBody`, `nonce` and `useId`.

```vue
<IApp dir="rtl" locale="ar">…</IApp>
```

## Slots

| Slot | When to use it |
| --- | --- |
| default | The application |

For the page frame — header, sidebar, main and footer — use [`IAppShell`](/components/app-shell), which is a separate component and works with or without this one.
