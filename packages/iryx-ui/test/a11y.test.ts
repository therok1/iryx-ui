import type { Component } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import axe from 'axe-core'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import {
  Alert,
  AppShell,
  AspectRatio,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Checkbox,
  Collapsible,
  ColorPicker,
  Combobox,
  Container,
  DateField,
  DatePicker,
  DateRangePicker,
  Dialog,
  DonutChart,
  Drawer,
  EmptyState,
  FileUpload,
  HoverCard,
  Input,
  Kbd,
  Label,
  Menubar,
  NavigationMenu,
  NumberInput,
  PageHeader,
  Pagination,
  PasswordInput,
  PinInput,
  Popover,
  Progress,
  RadioGroup,
  ScrollArea,
  Select,
  Separator,
  Sidebar,
  SignaturePad,
  Skeleton,
  Slider,
  Splitter,
  Stat,
  Stepper,
  Switch,
  Table,
  Tabs,
  TagsInput,
  Textarea,
  TimeField,
  Timeline,
  Toggle,
  ToggleGroup,
  Toolbar,
  Tree,
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
  ['Avatar', Avatar, { name: 'Ana Ruiz', status: 'online' }],
  ['AvatarGroup', AvatarGroup, { items: [{ name: 'Ana Ruiz' }, { name: 'Bo Lindqvist' }], max: 1 }],
  ['AspectRatio', AspectRatio, { ratio: 1 }],
  ['Badge', Badge, {}],
  ['Banner', Banner, { title: 'Scheduled maintenance' }],
  ['Breadcrumb', Breadcrumb, { items: [{ label: 'Home', to: '/' }, { label: 'Invoices' }] }],
  ['Button', Button, { 'aria-label': 'Save' }],
  ['Card', Card, {}],
  ['Checkbox', Checkbox, { label: 'Accept terms', description: 'The long version.' }],
  ['Collapsible', Collapsible, { label: 'Details', defaultOpen: true }],
  ['ColorPicker', ColorPicker, { modelValue: '#16a372' }],
  ['Combobox', Combobox, { 'items': [{ label: 'One', value: '1' }], 'aria-label': 'Pick one' }],
  ['DatePicker', DatePicker, {}],
  ['DateRangePicker', DateRangePicker, {}],
  ['EmptyState', EmptyState, { title: 'Nothing here', description: 'Add something.' }],
  ['FileUpload', FileUpload, {}],
  ['Input', Input, { 'aria-label': 'Search' }],
  ['Kbd', Kbd, { keys: 'mod+k' }],
  ['Label', Label, { for: 'x' }],
  ['NavigationMenu', NavigationMenu, { items: [{ label: 'Overview', href: '/', active: true }, { label: 'Product', items: [{ label: 'Invoicing', href: '/invoicing', description: 'Send and track invoices.' }] }] }],
  ['NumberInput', NumberInput, { 'aria-label': 'Amount' }],
  ['AppShell', AppShell, {}],
  ['Container', Container, {}],
  ['PageHeader', PageHeader, { title: 'Invoices', description: 'Everything sent this year.' }],
  ['Sidebar', Sidebar, { items: [{ section: 'Workspace', items: [{ label: 'Overview', href: '/', active: true }, { label: 'Invoices', items: [{ label: 'Drafts', href: '/drafts' }], defaultOpen: true }] }] }],
  ['Pagination', Pagination, { total: 100, page: 2 }],
  ['PasswordInput', PasswordInput, { 'aria-label': 'Password' }],
  ['PinInput', PinInput, { 'length': 4, 'aria-label': 'Verification code' }],
  ['Progress', Progress, { modelValue: 40, label: 'Uploading' }],
  ['Progress (unlabelled)', Progress, { 'modelValue': 40, 'aria-label': 'Uploading' }],
  ['RadioGroup', RadioGroup, { items: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] }],
  ['Select', Select, { 'items': [{ label: 'One', value: '1' }], 'aria-label': 'Pick one' }],
  ['ScrollArea', ScrollArea, { type: 'always' }],
  ['Splitter', Splitter, { panels: [{ size: 50 }, { size: 50 }] }],
  ['Separator', Separator, {}],
  ['SignaturePad', SignaturePad, { ariaLabel: 'Signature' }],
  ['Skeleton', Skeleton, {}],
  ['Slider', Slider, { modelValue: 40, label: 'Opacity' }],
  ['Stat', Stat, { label: 'Revenue', value: '12,400' }],
  ['Stepper', Stepper, { items: [{ title: 'One' }, { title: 'Two' }] }],
  ['Switch', Switch, { label: 'Notifications' }],
  ['Table', Table, {
    columns: [{ key: 'name', label: 'Name' }],
    rows: [{ name: 'Row one' }],
  }],
  ['Tabs', Tabs, { items: [{ label: 'One', value: 'a' }, { label: 'Two', value: 'b' }] }],
  ['TagsInput', TagsInput, { 'modelValue': ['design'], 'aria-label': 'Tags' }],
  ['Textarea', Textarea, { 'aria-label': 'Notes' }],
  ['Toggle', Toggle, { 'aria-label': 'Bold' }],
  ['ToggleGroup', ToggleGroup, { 'items': ['List', 'Board'], 'aria-label': 'View' }],
  ['TimeField', TimeField, { 'modelValue': '09:30', 'aria-label': 'Start time' }],
  ['DateField', DateField, { 'modelValue': '2026-08-15', 'aria-label': 'Invoice date' }],
  ['Calendar', Calendar, { modelValue: '2026-08-15', label: 'Invoice date' }],
  ['DonutChart', DonutChart, { data: [{ label: 'A', value: 3 }, { label: 'B', value: 1 }], label: 'Split' }],
  ['Tree', Tree, { items: [{ label: 'src', children: [{ label: 'a' }] }], ariaLabel: 'Files' }],
  ['Timeline', Timeline, { items: [{ title: 'Created', time: '09:12' }, { title: 'Paid', time: '14:03' }] }],
  ['Toolbar', Toolbar, { items: [{ label: 'Undo' }, '-', { label: 'Redo' }], ariaLabel: 'History' }],
  ['Menubar', Menubar, { menus: [{ label: 'File', items: [{ label: 'New' }] }] }],
]

/** Overlays render into the body, so they are mounted open and scanned there. */
const overlays: [string, Component, Record<string, unknown>][] = [
  ['Dialog', Dialog, { open: true, title: 'Edit invoice', description: 'Change the details.' }],
  ['Drawer', Drawer, { open: true, title: 'Filters', description: 'Narrow the list.' }],
  ['Popover', Popover, { open: true, ariaLabel: 'Filters', showClose: true }],
  ['HoverCard', HoverCard, { open: true }],
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
    // A hover card is not a dialog — it is anchored content with no focus
    // trap — so the panel is found by either.
    const panel = document.body.querySelector('[role="dialog"], [data-side]')!
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
