# iryx-ui

A Vue 3 component library built on [Reka UI](https://reka-ui.com) and [Tailwind CSS v4](https://tailwindcss.com). Styled by default, headless when you need it, with a Vue plugin and a Nuxt module in one package.

[![npm version](https://img.shields.io/npm/v/iryx-ui.svg)](https://www.npmjs.com/package/iryx-ui)
[![license](https://img.shields.io/npm/l/iryx-ui.svg)](LICENSE)

**31 components** — forms, overlays, navigation and feedback — on accessible Reka UI primitives, themed with CSS variables so light, dark and your brand colour all come from one token set.

## Installation

```bash
pnpm add iryx-ui
```

```ts
import { IryxUi } from 'iryx-ui'
// main.ts
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

## Usage

```vue
<template>
  <IApp appearance="system">
    <ICard>
      <IFormField label="Email" description="We'll never share it.">
        <IInput v-model="email" type="email" placeholder="you@example.com" />
      </IFormField>
      <IButton :loading="saving" @click="save">
        Save
      </IButton>
    </ICard>
  </IApp>
</template>
```

Every component is `I`-prefixed and works unprefixed via the Nuxt module's auto-imports.

## Highlights

- **Accessible by default** — keyboard nav, focus management and ARIA come from Reka UI.
- **Themeable** — `violet` and `rose` presets, or supply your own token values per appearance mode.
- **Dark mode built in** — class-based, with a `useAppearance()` composable that persists the choice and follows the OS.
- **Unstyled escape hatch** — `unstyled` on any component (or app-wide on `IApp`) strips built-in classes and leaves the behaviour.
- **SSR-safe** and shipped as ESM with full type definitions.

## Documentation

Full API docs — every component, prop, slot and composable — live in the
[package README](packages/iryx-ui/README.md).

## Repository

| Path | What |
| --- | --- |
| `packages/iryx-ui` | The published library: components, themes, Vue plugin, Nuxt module |
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

Changes to components need a matching entry in the package README and a demo in
the playground. Add a [changeset](https://github.com/changesets/changesets)
describing the change:

```bash
pnpm changeset
```

<details>
<summary>Releasing (maintainers)</summary>

Publishing is currently manual — the release workflow is `workflow_dispatch`
only, because it needs an `NPM_TOKEN` repo secret that isn't set. From a clean
`main`:

```bash
pnpm changeset version   # applies changesets, bumps version, writes CHANGELOG
git commit -am "chore: release vX.Y.Z"
pnpm release             # builds, then changeset publish
git push --follow-tags
```

`pnpm release` runs `changeset publish`, which needs npm auth (2FA prompts in
the browser). A missing `iryx-ui@X.Y.Z` git tag afterwards means the publish
failed.

To restore automatic publishing with provenance, add the `NPM_TOKEN` secret and
uncomment the `push` trigger documented at the top of
[`.github/workflows/release.yml`](.github/workflows/release.yml).

</details>

## License

[MIT](LICENSE)
