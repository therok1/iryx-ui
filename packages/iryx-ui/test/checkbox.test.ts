import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Checkbox } from '../src'

describe('checkbox', () => {
  it('renders unchecked by default', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.attributes('role')).toBe('checkbox')
    expect(wrapper.attributes('data-state')).toBe('unchecked')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('reflects modelValue changes from the parent', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.attributes('data-state')).toBe('checked')
  })

  it('renders the indeterminate state', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: 'indeterminate' } })
    expect(wrapper.attributes('data-state')).toBe('indeterminate')
  })

  it('applies size overrides', () => {
    const wrapper = mount(Checkbox, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('size-5')
  })

  it('stays bare when no label or description is given', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.element.getAttribute('role')).toBe('checkbox')
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders a label wired to the control', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Accept terms' } })
    const box = wrapper.get('[role="checkbox"]')
    const label = wrapper.get('label')
    expect(label.text()).toBe('Accept terms')
    expect(label.attributes('for')).toBe(box.attributes('id'))
  })

  it('renders a description and links it via aria-describedby', () => {
    const wrapper = mount(Checkbox, {
      props: { label: 'Emails', description: 'We only send receipts.' },
    })
    const box = wrapper.get('[role="checkbox"]')
    const describedBy = box.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.get(`#${describedBy}`).text()).toBe('We only send receipts.')
  })

  it('supports a description without a label', () => {
    const wrapper = mount(Checkbox, { props: { description: 'Standalone note' } })
    expect(wrapper.text()).toContain('Standalone note')
  })
})
