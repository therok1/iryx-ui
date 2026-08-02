/**
 * Names of every component exported from the package root.
 * Consumed by the Vue plugin (global registration) and the Nuxt module
 * (auto-imports). Keep in sync with `src/components/index.ts`.
 */
export const componentNames = [
  'App',
  'Badge',
  'Button',
  'Card',
  'Checkbox',
  'Form',
  'FormField',
  'Input',
  'Label',
  'RadioGroup',
  'Select',
  'Switch',
  'Textarea',
] as const

export type ComponentName = (typeof componentNames)[number]
