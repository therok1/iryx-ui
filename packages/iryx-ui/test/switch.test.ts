import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Switch } from '../src'

describe('switch', () => {
  it('renders unchecked by default', () => {
    const wrapper = mount(Switch)
    expect(wrapper.attributes('data-state')).toBe('unchecked')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('reflects modelValue changes from the parent', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    expect(wrapper.attributes('data-state')).toBe('unchecked')
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.attributes('data-state')).toBe('checked')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(Switch, { props: { ui: { root: 'h-8' } } })
    expect(wrapper.classes()).toContain('h-8')
    expect(wrapper.classes()).not.toContain('h-5')
  })

  it('stays bare when no label or description is given', () => {
    const wrapper = mount(Switch)
    expect(wrapper.element.getAttribute('role')).toBe('switch')
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders a label wired to the control', () => {
    const wrapper = mount(Switch, { props: { label: 'Notifications' } })
    const control = wrapper.get('[role="switch"]')
    const label = wrapper.get('label')
    expect(label.text()).toBe('Notifications')
    expect(label.attributes('for')).toBe(control.attributes('id'))
  })

  it('renders a description and links it via aria-describedby', () => {
    const wrapper = mount(Switch, {
      props: { label: 'Notifications', description: 'Push alerts to your phone.' },
    })
    const describedBy = wrapper.get('[role="switch"]').attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.get(`#${describedBy}`).text()).toBe('Push alerts to your phone.')
  })

  it('still toggles when labelled', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, label: 'Wifi' } })
    await wrapper.get('[role="switch"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })
})
