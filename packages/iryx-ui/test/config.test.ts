import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Alert, Badge, Banner, Button, Card, Checkbox, Combobox, DatePicker, DateRangePicker, EmptyState, FileUpload, Input, iryxUiConfigKey, Label, PasswordInput, Progress, RadioGroup, Select, Sparkline, Switch, Table, Textarea } from '../src'

/**
 * Regression guard: Vue casts absent boolean props to `false` rather than
 * `undefined`, which silently made `props.unstyled ?? config.unstyled` always
 * resolve to `false` — so the global `unstyled` option did nothing. Every
 * component needs an explicit `unstyled: undefined` default.
 *
 * The selector is the element that actually carries the theme classes; for
 * Select that's the trigger, since SelectRoot is renderless.
 */
const components: [string, Component, string][] = [
  ['Alert', Alert, '[role="status"]'],
  ['Badge', Badge, 'span'],
  ['Banner', Banner, 'div'],
  ['Button', Button, 'button'],
  ['Card', Card, 'div'],
  ['EmptyState', EmptyState, 'div'],
  ['Progress', Progress, 'div'],
  ['Sparkline', Sparkline, 'svg'],
  ['Input', Input, 'input'],
  ['Textarea', Textarea, 'textarea'],
  ['PasswordInput', PasswordInput, 'input'],
  ['FileUpload', FileUpload, 'label'],
  ['DatePicker', DatePicker, 'button'],
  ['DateRangePicker', DateRangePicker, 'button'],
  ['Label', Label, 'label'],
  ['Checkbox', Checkbox, '[role="checkbox"]'],
  ['Switch', Switch, '[role="switch"]'],
  ['Select', Select, '[role="combobox"]'],
  ['Combobox', Combobox, 'input'],
  ['RadioGroup', RadioGroup, '[role="radiogroup"]'],
  ['Table', Table, 'table'],
]

describe('global unstyled config', () => {
  it.each(components)('%s honours the global config', (_name, component, selector) => {
    const styled = mount(component, { attachTo: document.body })
    expect(styled.get(selector).attributes('class')).toBeTruthy()

    const unstyled = mount(component, {
      global: { provide: { [iryxUiConfigKey as symbol]: { unstyled: true } } },
      attachTo: document.body,
    })
    expect(unstyled.get(selector).attributes('class') ?? '').toBe('')
  })

  it('lets an explicit prop override the global config', () => {
    const wrapper = mount(Input, {
      props: { unstyled: false },
      global: { provide: { [iryxUiConfigKey as symbol]: { unstyled: true } } },
    })
    expect(wrapper.attributes('class')).toContain('rounded-xl')
  })
})
