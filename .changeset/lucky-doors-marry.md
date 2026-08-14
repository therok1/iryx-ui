---
"iryx-ui": minor
---

**Breaking:** the `emerald`, `amber` and `sky` theme presets are gone. `themes` now exports only `violet` (the default) and `rose`, and `ThemePresetName` narrows to match — passing a removed name to `applyTheme()`, `IApp`'s `theme` prop, or the plugin and Nuxt module options is now a type error. Custom themes are unaffected: any palette can still be supplied as a `Theme` object with per-mode tokens.
