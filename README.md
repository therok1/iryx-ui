# iryx-ui

A Vue 3 component library built on [Reka UI](https://reka-ui.com) and [Tailwind CSS v4](https://tailwindcss.com). Accessible by default, yours to restyle.

[![npm version](https://img.shields.io/npm/v/iryx-ui.svg)](https://www.npmjs.com/package/iryx-ui)
[![license](https://img.shields.io/npm/l/iryx-ui.svg)](LICENSE)

**[Documentation →](https://iryx-ui.com)**

Every component arrives with keyboard navigation, focus management and ARIA already working, then hands you a `class`, a per-slot `ui`, or `unstyled` when the defaults are not what you want.

## Installation

```bash
pnpm add iryx-ui
```

```ts
// main.ts
import { IryxUi } from 'iryx-ui'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(IryxUi).mount('#app')
```

```css
/* main.css */
@import "tailwindcss";
@import "iryx-ui/theme.css";
```

On Nuxt, add `'iryx-ui/nuxt'` to `modules` instead — components are auto-imported.

Full setup, including the Nuxt module and the theme tokens, is in the
[installation guide](https://iryx-ui.com/guide/installation).

## Usage

```vue
<template>
  <IApp appearance="system">
    <ICard>
      <IFormField label="Email" description="We'll never share it.">
        <IInput v-model="email" type="email" placeholder="you@example.com" />
      </IFormField>

      <template #footer>
        <IButton @click="save">Save</IButton>
      </template>
    </ICard>
  </IApp>
</template>
```

## Highlights

- **Accessible by default** — keyboard nav, focus management and ARIA come from Reka UI.
- **Themeable** — `violet` and `rose` presets, or your own token values per appearance mode.
- **Dark mode built in** — class-based, with a `useAppearance()` composable that persists the choice and follows the OS.
- **Unstyled escape hatch** — `unstyled` on any component (or app-wide on `IApp`) strips built-in classes and leaves the behaviour.
- **SSR-safe**, shipped as ESM with full type definitions.

## Repository

| Path | What |
| --- | --- |
| `packages/iryx-ui` | The published library: components, themes, Vue plugin, Nuxt module |
| `docs` | The documentation site (VitePress, custom theme) |
| `playground` | Vite + Vue dev app, hot-reloads against the library source |

## Contributing

```bash
pnpm install
pnpm dev          # start the playground
pnpm test         # unit tests
pnpm lint         # eslint
pnpm typecheck    # vue-tsc
pnpm build        # build the library
```

A change to a component needs its docs page updated in the same commit, and a
[changeset](https://github.com/changesets/changesets) describing the change:

```bash
pnpm changeset
```

<details>
<summary>Releasing (maintainers)</summary>

Releases are automatic. A push to `main` does not publish on its own: while
changesets are pending, [`release.yml`](.github/workflows/release.yml) opens or
updates a **Version Packages** PR holding the version bump and the changelog.
Merging that PR leaves no changesets, so the next run publishes.

**Merging the Version Packages PR is the release button.** Nothing is run by
hand.

Publishing goes through npm Trusted Publishing: npmjs.com trusts this
repository and this workflow filename, GitHub mints a short-lived OIDC token at
publish time, and no long-lived npm credential exists anywhere. Provenance is
attached automatically.

Two repository settings this depends on:

- **Settings → Actions → General** — "Allow GitHub Actions to create and
  approve pull requests", or opening the version PR fails.
- The npm Trusted Publisher entry must name this repo *and* `release.yml`;
  renaming the workflow breaks publishing.

</details>

## License

[MIT](LICENSE)
