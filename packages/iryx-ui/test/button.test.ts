import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Button } from '../src'

describe('button press', () => {
  it('nudges down on press for surface variants', () => {
    for (const variant of ['solid', 'outline', 'ghost'] as const) {
      expect(mount(Button, { props: { variant } }).attributes('class'))
        .toContain('active:translate-y-px')
    }
  })

  it('leaves the link variant in place', () => {
    // The base class is still present, so the override must cancel it.
    expect(mount(Button, { props: { variant: 'link' } }).attributes('class'))
      .toContain('active:translate-y-0')
  })
})

describe('button', () => {
  it('renders a button with default variant classes', () => {
    const wrapper = mount(Button, { slots: { default: 'Click me' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('from-primary-from')
    expect(wrapper.classes()).toContain('to-primary-to')
  })

  it('applies variant and size', () => {
    const wrapper = mount(Button, { props: { variant: 'outline', size: 'lg' } })
    expect(wrapper.classes()).toContain('border-border')
    expect(wrapper.classes()).toContain('h-10')
  })

  it('merges a custom class over conflicting defaults', () => {
    const wrapper = mount(Button, { props: { class: 'rounded-full' } })
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).not.toContain('rounded-lg')
  })

  it('renders no built-in classes when unstyled', () => {
    const wrapper = mount(Button, { props: { unstyled: true, class: 'my-btn' } })
    expect(wrapper.attributes('class')).toBe('my-btn')
  })

  it('disables the button while loading and shows a spinner', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
