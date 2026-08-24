# Dashboard example

An admin dashboard built entirely from Iryx UI — a shell with navigation, a
table with sorting, selection and row actions, charts, and a validated
settings form. Meant to be read and copied, not installed.

```bash
corepack pnpm --filter @iryx-ui/example-dashboard dev
```

## What it covers

| Page | Components |
| --- | --- |
| Overview | `IStat`, `ILineChart`, `IBarChart`, `ITable`, `ITimeline`, `ICard` |
| Invoices | `ITable` with sorting, selection, row actions and pagination, `IInput`, `ISelect`, `IBadge`, `useConfirm`, `useToast` |
| Customers | `IAvatar`, `ICard`, `IBadge`, `ISeparator` |
| Settings | `IForm`, `IFormField`, `INumberInput`, `ISwitch`, `IRadioGroup`, `useAppearance` |

The shell itself — `IApp`, `IAppShell`, `ISidebar`, `IDropdownMenu`,
`IToaster`, `IConfirmDialog` — lives in `src/App.vue`.

## Copying it out

Two lines exist only because this runs inside the library's own repo:

- the `iryx-ui` alias in `vite.config.ts`, which points at the library source
  so a component change shows up without a rebuild
- the `@source` line in `src/style.css`, which scans that same source for
  utility classes

Delete both and `iryx-ui` resolves to the published package, which is what you
want outside this repo. Everything else is ordinary application code.

## Things worth knowing

**There is no router.** Navigation is a `ref` and a component lookup, because
the example is about the components rather than about routing. `ISidebar`
takes `onSelect` and `active` precisely so it can be driven either way — swap
them for router links and nothing else changes.

**Money is a string, never a number.** `0.1 + 0.2` is `0.30000000000000004`,
and a column of invoices adds that error up until the figure on screen
disagrees with the ledger. Totals here are summed as integer cents.

**All the data is fictional** and inline in `src/data.ts`. A real app fetches
it; the components above it do not change either way.
