import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Alert, Badge, Button, Card, Checkbox, EmptyState, Input, iryxUiConfigKey, Label, Progress, RadioGroup, Select, Switch, Textarea } from '../src'

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
  ['Button', Button, 'button'],
  ['Card', Card, 'div'],
  ['EmptyState', EmptyState, 'div'],
  ['Progress', Progress, 'div'],
  ['Input', Input, 'input'],
  ['Textarea', Textarea, 'textarea'],
  ['Label', Label, 'label'],
  ['Checkbox', Checkbox, '[role="checkbox"]'],
  ['Switch', Switch, '[role="switch"]'],
  ['Select', Select, '[role="combobox"]'],
  ['RadioGroup', RadioGroup, '[role="radiogroup"]'],
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
    expect(wrapper.attributes('class')).toContain('rounded-lg')
  })
})
