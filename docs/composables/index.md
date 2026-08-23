---
eyebrow: Reference
---

# Composables

The logic behind the components, exported on its own — reach for one when you want the behaviour and none of the markup.

Most need nothing else on screen. Four do: `useToast` and `useConfirm` need a host to render into, and `useForm` and `useFormField` only answer inside the component that provides them. Both cases are covered below.

| Composable | What it gives you |
| --- | --- |
| [`useDataTable`](/composables/use-data-table) | Sorting, pagination, selection and expansion state, headless |
| [`useAppearance`](/composables/use-appearance) | Light / dark / system, persisted, following the OS |
| [`useElementSize`](/composables/use-element-size) | An element's rendered width and height, observed |
| [`useToast`](/composables/use-toast) | Raise a toast from anywhere. Needs one `IToaster` mounted |
| [`useConfirm`](/composables/use-confirm) | A promise-based confirmation. Needs one `IConfirmDialog` mounted |
| [`useForm` / `useFormField`](/composables/use-form) | What `IForm` and `IFormField` provide to the controls inside them |
| [Decimal helpers](/composables/decimals) | Add, compare, round and format decimal **strings** without floating point |
| [Date helpers](/composables/dates) | Convert between ISO `YYYY-MM-DD` strings and calendar dates |

## Imperative APIs

`useToast` and `useConfirm` are backed by a module-level store, so they can be called from a plain function with no component in scope — an interceptor, a store action, a route guard.

Each still needs its host mounted once:

- `useToast` → one [`IToaster`](/components/toast)
- `useConfirm` → one [`IConfirmDialog`](/components/confirm-dialog)

The composable creates the state; the host renders it.

## Form context

`useForm` and `useFormField` are the inject side of a pair. They read what [`IForm`](/components/form) and [`IFormField`](/components/form-field) provide, so they are useful only inside one.

That is what lets a control you wrote yourself pick up the generated id, the invalid state and the `aria-describedby` the field has already worked out, without a single prop passed down.
