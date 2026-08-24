---
eyebrow: Reference
description: Complete applications built from Iryx UI, kept in the repository so they are read, copied, and broken by the same changes as the library.
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { theme } = useData()
</script>

# Examples

Whole applications rather than single components. Each one lives in the repository, so it is built and type-checked alongside the library and breaks the moment a change breaks it.

## Dashboard

An admin dashboard for a billing product: a shell with navigation that becomes a drawer on a phone, a table with sorting, selection, row actions and pagination, charts, a create form in a drawer, and a settings page with validation.

| Page | What it uses |
| --- | --- |
| Overview | [`IStat`](/components/stat), [`ILineChart`](/components/line-chart), [`IBarChart`](/components/bar-chart), [`ITable`](/components/table), [`ITimeline`](/components/timeline) |
| Invoices | [`ITable`](/components/table) with row actions and [`IPagination`](/components/pagination), [`IDrawer`](/components/drawer), [`ICombobox`](/components/combobox), [`IDatePicker`](/components/date-picker), [`useConfirm`](/composables/use-confirm), [`useToast`](/composables/use-toast) |
| Customers | [`IAvatar`](/components/avatar), [`ICard`](/components/card), [`IBadge`](/components/badge) |
| Settings | [`IForm`](/components/form), [`IFormField`](/components/form-field), [`INumberInput`](/components/number-input), [`ISwitch`](/components/switch), [`IRadioGroup`](/components/radio-group), [`useAppearance`](/composables/use-appearance) |

The shell itself — [`IApp`](/components/app), [`IAppShell`](/components/app-shell), [`ISidebar`](/components/sidebar), [`IDropdownMenu`](/components/dropdown-menu) — is one file.

<div class="flex flex-wrap gap-3">
  <IButton as="a" :href="`${theme.repo}/tree/main/examples/dashboard`" target="_blank" rel="noreferrer">
    Read the source
  </IButton>
</div>

### Running it

```bash
git clone https://github.com/therok1/iryx-ui
cd iryx-ui
pnpm install
pnpm --filter @iryx-ui/example-dashboard dev
```

### Copying it out

Two lines exist only because it runs inside this repository: the `iryx-ui` alias in `vite.config.ts`, which points at the library source so a component change shows up without a rebuild, and the `@source` line in `src/style.css`, which scans that same source for utility classes. Delete both and `iryx-ui` resolves to the published package, which is what you want anywhere else.

## Why they live in the repository

An example that sits in its own repository rots quietly: it keeps building against a version you no longer ship, and nobody notices until someone copies it. This one is a workspace package, so it is built in CI and a breaking change breaks it in the same commit.

It earns its place as a test, too. Assembling the dashboard turned up seven bugs the component pages had never hit — among them a chart whose hidden data table added its own height to the page scroll, and a form field whose spacing collapsed for exactly one control.
