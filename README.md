# iryx-ui monorepo

A Vue 3 component library built on [Reka UI](https://reka-ui.com) and Tailwind CSS v4.

The published package lives in [`packages/iryx-ui`](packages/iryx-ui) — see its [README](packages/iryx-ui/README.md) for usage docs.

## Structure

| Path | What |
| --- | --- |
| `packages/iryx-ui` | The library: components, themes, Vue plugin, Nuxt module |
| `playground` | Vite + Vue dev app, hot-reloads against the library source |

## Development

```bash
pnpm install
pnpm dev          # start the playground
pnpm test         # run unit tests
pnpm lint         # eslint
pnpm typecheck    # vue-tsc
pnpm build        # build the library
```

## Releasing

Releases are automated with [changesets](https://github.com/changesets/changesets):

1. With your changes, run `pnpm changeset` and describe the change (patch/minor/major).
2. Merge to `main`. The release workflow opens a "Version Packages" PR.
3. Merge that PR — the package is published to npm with provenance.

## License

[MIT](LICENSE)
