import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Input, Label, Textarea } from '../src'

describe('input', () => {
  it('renders a text input with default size classes', () => {
    const wrapper = mount(Input)
    expect(wrapper.element.tagName).toBe('INPUT')
    expect(wrapper.attributes('type')).toBe('text')
    expect(wrapper.classes()).toContain('h-9')
  })

  it('supports v-model', async () => {
    const wrapper = mount(Input, { props: { 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    await wrapper.setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('applies size and invalid state', () => {
    const wrapper = mount(Input, { props: { size: 'lg', invalid: true } })
    expect(wrapper.classes()).toContain('h-10')
    expect(wrapper.classes()).toContain('border-red-500')
    expect(wrapper.attributes('aria-invalid')).toBe('true')
  })

  it('renders no built-in classes when unstyled', () => {
    const wrapper = mount(Input, { props: { unstyled: true, class: 'my-input' } })
    expect(wrapper.attributes('class')).toBe('my-input')
  })
})

describe('textarea', () => {
  it('renders a textarea and forwards rows', () => {
    const wrapper = mount(Textarea, { props: { rows: 5 } })
    expect(wrapper.element.tagName).toBe('TEXTAREA')
    expect(wrapper.attributes('rows')).toBe('5')
    expect(wrapper.classes()).toContain('min-h-20')
  })

  it('supports v-model', async () => {
    const wrapper = mount(Textarea, { props: { 'modelValue': '', 'onUpdate:modelValue': () => {} } })
    await wrapper.setValue('note')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['note'])
  })
})

describe('label', () => {
  it('renders its content and links to a field', () => {
    const wrapper = mount(Label, { props: { for: 'email' }, slots: { default: 'Email' } })
    expect(wrapper.element.tagName).toBe('LABEL')
    expect(wrapper.text()).toBe('Email')
    expect(wrapper.attributes('for')).toBe('email')
  })

  it('marks required fields', () => {
    const wrapper = mount(Label, { props: { required: true }, slots: { default: 'Name' } })
    expect(wrapper.classes().join(' ')).toContain('after:content-[\'*\']')
  })
})
