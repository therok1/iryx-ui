import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Card } from '../src'

describe('card', () => {
  it('renders default slot content', () => {
    const wrapper = mount(Card, { slots: { default: 'Body' } })
    expect(wrapper.text()).toBe('Body')
  })

  it('omits the header entirely when there is nothing to put in it', () => {
    const wrapper = mount(Card, { slots: { default: 'Body' } })
    expect(wrapper.find('h3').exists()).toBe(false)
    // Body wrapper only — no header, no footer.
    expect(wrapper.element.children).toHaveLength(1)
  })

  it('renders title and description in the header', () => {
    const wrapper = mount(Card, { props: { title: 'Invoice', description: 'Draft' } })
    expect(wrapper.get('h3').text()).toBe('Invoice')
    expect(wrapper.get('p').text()).toBe('Draft')
  })

  it('renders the footer only when the slot is given', () => {
    // Root wraps the body only; a footer would add a second child.
    expect(mount(Card).element.children).toHaveLength(1)

    const withFooter = mount(Card, { slots: { footer: 'Actions' } })
    expect(withFooter.element.children).toHaveLength(2)
    expect(withFooter.text()).toContain('Actions')
  })

  it('lets the header slot replace title and description', () => {
    const wrapper = mount(Card, {
      props: { title: 'Ignored' },
      slots: { header: '<span>Custom</span>' },
    })
    expect(wrapper.text()).toBe('Custom')
    expect(wrapper.find('h3').exists()).toBe(false)
  })

  it('applies variant and padding classes', () => {
    expect(mount(Card).attributes('class')).toContain('border')
    const soft = mount(Card, { props: { variant: 'soft', padding: 'lg' } })
    expect(soft.attributes('class')).toContain('bg-muted')
    expect(soft.attributes('class')).toContain('p-8')
    expect(soft.attributes('class')).not.toContain('border-border')
  })

  it('merges the class prop and per-slot ui overrides', () => {
    const wrapper = mount(Card, {
      props: { title: 'T', class: 'w-64', ui: { title: 'text-red-500' } },
    })
    expect(wrapper.attributes('class')).toContain('w-64')
    expect(wrapper.get('h3').attributes('class')).toContain('text-red-500')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Card, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
