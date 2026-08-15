/**
 * Names of every component exported from the package root.
 * Consumed by the Vue plugin (global registration) and the Nuxt module
 * (auto-imports). Keep in sync with `src/components/index.ts`.
 */
export const componentNames = [
  'Alert',
  'App',
  'Badge',
  'Banner',
  'Breadcrumb',
  'Button',
  'ButtonGroup',
  'Card',
  'Checkbox',
  'Combobox',
  'ConfirmDialog',
  'DatePicker',
  'DateRangePicker',
  'Dialog',
  'DropdownMenu',
  'EmptyState',
  'FileUpload',
  'Form',
  'FormField',
  'Input',
  'Label',
  'NumberInput',
  'Pagination',
  'PasswordInput',
  'Progress',
  'RadioGroup',
  'Select',
  'Separator',
  'Skeleton',
  'Sparkline',
  'Stat',
  'Stepper',
  'Switch',
  'Table',
  'Tabs',
  'Textarea',
  'Toaster',
  'Tooltip',
] as const

export type ComponentName = (typeof componentNames)[number]
