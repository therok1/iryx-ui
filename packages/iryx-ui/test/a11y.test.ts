import type { Component } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import axe from 'axe-core'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import {
  Alert,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Combobox,
  DatePicker,
  DateRangePicker,
  Dialog,
  Drawer,
  EmptyState,
  FileUpload,
  Input,
  Label,
  NumberInput,
  Pagination,
  PasswordInput,
  Progress,
  RadioGroup,
  Select,
  Separator,
  Skeleton,
  Stat,
  Stepper,
  Switch,
  Table,
  Tabs,
  Textarea,
} from '../src'

/**
 * An automated accessibility sweep. It is a floor, not a ceiling: axe catches
 * maybe a third of real barriers, and several of its rules need layout, which
 * happy-dom does not compute.
 *
 * The reason it exists: reka-ui 2.10 fixed a `nested-interactive` violation in
 * `CheckboxRoot` and `SwitchRoot` — a hidden form input rendered inside the
 * button. That was upstream's bug, but nothing here would have caught the same
 * mistake in our own compositions, which nest far more than the primitives do.
 */
enableAutoUnmount(afterEach)

/*
 * Rules that cannot produce a trustworthy result in this environment. Each is
 * disabled for a stated reason rather than because it was inconvenient.
 */
const disabledRules = {
  // Needs real layout and painted colours; happy-dom computes neither.
  'color-contrast': { enabled: false },
  // Fire against the surrounding document, which a mounted fragment is not.
  'region': { enabled: false },
  'page-has-heading-one': { enabled: false },
  'landmark-one-main': { enabled: false },
  'html-has-lang': { enabled: false },
} satisfies axe.RuleObject

/** Components that render standalone, with the props needed to be meaningful. */
const cases: [string, Component, Record<string, unknown>][] = [
  ['Alert', Alert, { title: 'Heads up', description: 'Something happened.' }],
  ['Badge', Badge, {}],
  ['Banner', Banner, { title: 'Scheduled maintenance' }],
  ['Breadcrumb', Breadcrumb, { items: [{ label: 'Home', to: '/' }, { label: 'Invoices' }] }],
  ['Button', Button, { 'aria-label': 'Save' }],
  ['Card', Card, {}],
  ['Checkbox', Checkbox, { label: 'Accept terms', description: 'The long version.' }],
  ['Combobox', Combobox, { 'items': [{ label: 'One', value: '1' }], 'aria-label': 'Pick one' }],
  ['DatePicker', DatePicker, {}],
  ['DateRangePicker', DateRangePicker, {}],
  ['EmptyState', EmptyState, { title: 'Nothing here', description: 'Add something.' }],
  ['FileUpload', FileUpload, {}],
  ['Input', Input, { 'aria-label': 'Search' }],
  ['Label', Label, { for: 'x' }],
  ['NumberInput', NumberInput, { 'aria-label': 'Amount' }],
  ['Pagination', Pagination, { total: 100, page: 2 }],
  ['PasswordInput', PasswordInput, { 'aria-label': 'Password' }],
  ['Progress', Progress, { modelValue: 40, label: 'Uploading' }],
  ['Progress (unlabelled)', Progress, { 'modelValue': 40, 'aria-label': 'Uploading' }],
  ['RadioGroup', RadioGroup, { items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] }],
  ['Select', Select, { 'items': [{ label: 'One', value: '1' }], 'aria-label': 'Pick one' }],
  ['Separator', Separator, {}],
  ['Skeleton', Skeleton, {}],
  ['Stat', Stat, { label: 'Revenue', value: '12,400' }],
  ['Stepper', Stepper, { items: [{ title: 'One' }, { title: 'Two' }] }],
  ['Switch', Switch, { label: 'Notifications' }],
  ['Table', Table, {
    columns: [{ key: 'name', label: 'Name' }],
    rows: [{ name: 'Row one' }],
  }],
  ['Tabs', Tabs, { items: [{ label: 'One', value: 'a' }, { label: 'Two', value: 'b' }] }],
  ['Textarea', Textarea, { 'aria-label': 'Notes' }],
]

/** Overlays render into the body, so they are mounted open and scanned there. */
const overlays: [string, Component, Record<string, unknown>][] = [
  ['Dialog', Dialog, { open: true, title: 'Edit invoice', description: 'Change the details.' }],
  ['Drawer', Drawer, { open: true, title: 'Filters', description: 'Narrow the list.' }],
]

async function violationsOf(target: Element) {
  const results = await axe.run(target, {
    rules: disabledRules,
    // `axe.run` resolves `undefined` for these unless asked.
    resultTypes: ['violations'],
  })
  return results.violations.map(v => `${v.id}: ${v.nodes.length} node(s) — ${v.help}`)
}

describe('accessibility', () => {
  it.each(cases)('%s has no axe violations', async (_name, component, props) => {
    const wrapper = mount(component, { props, attachTo: document.body })
    await nextTick()
    expect(await violationsOf(wrapper.element as Element)).toEqual([])
  })

  it.each(overlays)('%s has no axe violations', async (_name, component, props) => {
    mount(component, { props, attachTo: document.body })
    await nextTick()
    const panel = document.body.querySelector('[role="dialog"]')!
    expect(await violationsOf(panel)).toEqual([])
  })

  /*
   * Proof the sweep can actually fail — without it a broken axe integration
   * would read as a clean bill of health for every component above.
   */
  it('reports a violation when one is planted', async () => {
    const el = document.createElement('div')
    el.innerHTML = '<button><input type="checkbox" /></button>'
    document.body.append(el)
    const violations = await violationsOf(el)
    document.body.removeChild(el)
    expect(violations.join(' ')).toContain('nested-interactive')
  })
})
