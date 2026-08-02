import { mount } from '@vue/test-utils'
import { Bell } from 'lucide-vue-next'
import { describe, expect, it } from 'vitest'
import { Alert } from '../src'

describe('alert', () => {
  it('renders title and description', () => {
    const wrapper = mount(Alert, { props: { title: 'Saved', description: 'Invoice stored.' } })
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('Invoice stored.')
  })

  it('lets the default slot win over the description prop', () => {
    const wrapper = mount(Alert, {
      props: { description: 'Ignored' },
      slots: { default: 'Custom body' },
    })
    expect(wrapper.text()).toContain('Custom body')
    expect(wrapper.text()).not.toContain('Ignored')
  })

  it('shows a variant-appropriate icon by default', () => {
    expect(mount(Alert).find('svg').exists()).toBe(true)
    expect(mount(Alert, { props: { variant: 'danger' } }).find('svg').exists()).toBe(true)
  })

  it('accepts a custom icon and drops it entirely on false', () => {
    expect(mount(Alert, { props: { icon: Bell } }).find('svg').exists()).toBe(true)
    expect(mount(Alert, { props: { icon: false } }).find('svg').exists()).toBe(false)
  })

  it('announces urgent variants assertively and the rest politely', () => {
    expect(mount(Alert).attributes('role')).toBe('status')
    expect(mount(Alert, { props: { variant: 'success' } }).attributes('role')).toBe('status')
    expect(mount(Alert, { props: { variant: 'warning' } }).attributes('role')).toBe('alert')
    expect(mount(Alert, { props: { variant: 'danger' } }).attributes('role')).toBe('alert')
  })

  it('emits close only when closable', async () => {
    expect(mount(Alert).find('button').exists()).toBe(false)

    const wrapper = mount(Alert, { props: { closable: true } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('allows overriding the close label for non-English apps', () => {
    const wrapper = mount(Alert, { props: { closable: true, closeLabel: 'Zapri' } })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Zapri')
  })

  it('ships a dark class for every variant', () => {
    for (const variant of ['info', 'success', 'warning', 'danger'] as const)
      expect(mount(Alert, { props: { variant } }).attributes('class')).toContain('dark:')
  })

  it('merges the class prop and per-slot ui overrides', () => {
    const wrapper = mount(Alert, {
      props: { title: 'T', class: 'mb-4', ui: { title: 'text-base' } },
    })
    expect(wrapper.attributes('class')).toContain('mb-4')
    expect(wrapper.get('p').attributes('class')).toContain('text-base')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Alert, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
