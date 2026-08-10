import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { EmptyState } from '../src'

/** Stand-in for a component icon, e.g. from Lucide. */
const Inbox = () => h('svg')

describe('emptyState', () => {
  it('renders title and description', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No invoices', description: 'Create one.' } })
    expect(wrapper.text()).toContain('No invoices')
    expect(wrapper.text()).toContain('Create one.')
  })

  it('renders no icon unless given one', () => {
    expect(mount(EmptyState).find('svg').exists()).toBe(false)
    expect(mount(EmptyState, { props: { icon: Inbox } }).find('svg').exists()).toBe(true)
  })

  /*
   * `icon` has `| false` in its type, which makes Vue infer a Boolean prop and
   * cast an absent value to `false`. Guarding the explicit-false path here.
   */
  it('treats an explicit false icon the same as none', () => {
    expect(mount(EmptyState, { props: { icon: false } }).find('svg').exists()).toBe(false)
  })

  it('renders the actions slot only when given', () => {
    expect(mount(EmptyState, { props: { title: 'T' } }).text()).toBe('T')
    const withActions = mount(EmptyState, { slots: { actions: '<button>New</button>' } })
    expect(withActions.find('button').exists()).toBe(true)
  })

  it('applies size classes', () => {
    expect(mount(EmptyState, { props: { size: 'sm' } }).attributes('class')).toContain('py-8')
    expect(mount(EmptyState, { props: { size: 'lg' } }).attributes('class')).toContain('py-16')
  })

  it('merges the class prop and per-slot ui overrides', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'T', class: 'border', ui: { title: 'text-xl' } },
    })
    expect(wrapper.attributes('class')).toContain('border')
    expect(wrapper.get('p').attributes('class')).toContain('text-xl')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(EmptyState, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
