/**
 * Names of every component exported from the package root.
 * Consumed by the Vue plugin (global registration) and the Nuxt module
 * (auto-imports). Keep in sync with `src/components/index.ts`.
 */
export const componentNames = [
  'Alert',
  'App',
  'Badge',
  'Breadcrumb',
  'Button',
  'ButtonGroup',
  'Card',
  'Checkbox',
  'ConfirmDialog',
  'Dialog',
  'DropdownMenu',
  'EmptyState',
  'Form',
  'FormField',
  'Input',
  'Label',
  'NumberInput',
  'Pagination',
  'Progress',
  'RadioGroup',
  'Select',
  'Separator',
  'Skeleton',
  'Stat',
  'Stepper',
  'Switch',
  'Tabs',
  'Textarea',
  'Toaster',
  'Tooltip',
] as const

export type ComponentName = (typeof componentNames)[number]
