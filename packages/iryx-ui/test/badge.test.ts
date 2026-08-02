import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Badge } from '../src'

describe('badge', () => {
  it('renders the label prop', () => {
    expect(mount(Badge, { props: { label: 'Paid' } }).text()).toBe('Paid')
  })

  it('lets the default slot win over the label prop', () => {
    const wrapper = mount(Badge, { props: { label: 'Ignored' }, slots: { default: 'Draft' } })
    expect(wrapper.text()).toBe('Draft')
  })

  it('renders a span by default and honours as', () => {
    expect(mount(Badge).element.tagName).toBe('SPAN')
    expect(mount(Badge, { props: { as: 'div' } }).element.tagName).toBe('DIV')
  })

  it('defaults to the neutral soft variant', () => {
    expect(mount(Badge).attributes('class')).toContain('bg-muted')
  })

  it('pairs each variant with its tone', () => {
    expect(mount(Badge, { props: { variant: 'success' } }).attributes('class'))
      .toContain('bg-emerald-50')
    expect(mount(Badge, { props: { variant: 'success', tone: 'solid' } }).attributes('class'))
      .toContain('bg-emerald-600')
    expect(mount(Badge, { props: { variant: 'danger' } }).attributes('class'))
      .toContain('bg-red-50')
  })

  it('ships a dark class for every coloured variant', () => {
    for (const variant of ['success', 'warning', 'danger', 'info'] as const) {
      for (const tone of ['soft', 'solid'] as const)
        expect(mount(Badge, { props: { variant, tone } }).attributes('class')).toContain('dark:')
    }
  })

  it('renders the dot only when asked, and hides it from a11y', () => {
    expect(mount(Badge).find('[aria-hidden="true"]').exists()).toBe(false)
    const dotted = mount(Badge, { props: { dot: true, label: 'Sent' } })
    expect(dotted.get('[aria-hidden="true"]').attributes('class')).toContain('rounded-full')
  })

  it('merges the class prop and per-slot ui overrides', () => {
    const wrapper = mount(Badge, {
      props: { dot: true, class: 'ml-2', ui: { dot: 'size-4' } },
    })
    expect(wrapper.attributes('class')).toContain('ml-2')
    expect(wrapper.get('[aria-hidden="true"]').attributes('class')).toContain('size-4')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Badge, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
