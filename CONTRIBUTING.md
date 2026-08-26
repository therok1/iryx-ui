# Contributing to iryx-ui

Thanks for taking the time. Issues, bug reports and pull requests are all welcome.

## Getting set up

```bash
corepack pnpm install
corepack pnpm --filter iryx-ui dev
```

Run the checks from the repository root, never from inside a package:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

## Pull requests

- A change to a component's behaviour, props or tokens updates its docs page and
  `packages/iryx-ui/README.md` in the same commit.
- Add a changeset (`corepack pnpm changeset`) describing the change for the
  changelog. Releases happen by merging the "Version Packages" pull request.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org).

## Licensing of contributions

iryx-ui is released under the [MIT license](LICENSE), and some future components
may be released under a separate commercial license instead.

By submitting a pull request you confirm that the contribution is your own work
(or that you have the right to submit it), and you grant Rok Oblak a perpetual,
worldwide, irrevocable, royalty-free licence to use, modify, sublicense and
distribute it as part of iryx-ui — including under licence terms other than the
MIT license. You keep the copyright in your contribution and remain free to use
it however you like elsewhere.
