/**
 * Names of every component exported from the package root.
 * Consumed by the Vue plugin (global registration) and the Nuxt module
 * (auto-imports). Keep in sync with `src/components/index.ts`.
 */
export const componentNames = [
  'Alert',
  'App',
  'Badge',
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
  'Progress',
  'RadioGroup',
  'Select',
  'Switch',
  'Textarea',
  'Toaster',
] as const

export type ComponentName = (typeof componentNames)[number]
