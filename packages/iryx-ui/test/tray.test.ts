import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Tray } from '../src'

describe('tray', () => {
  it('renders label, actions and body', () => {
    const wrapper = mount(Tray, { props: { label: 'Invoices' }, slots: { default: 'Body', actions: 'Filter' } })
    expect(wrapper.get('header').text()).toContain('Invoices')
    expect(wrapper.get('header').text()).toContain('Filter')
    expect(wrapper.text()).toContain('Body')
  })

  it('skips the header with nothing to show', () => {
    expect(mount(Tray, { slots: { default: 'Body' } }).find('header').exists()).toBe(false)
  })

  it('drops built-in classes when unstyled', () => {
    expect(mount(Tray, { props: { unstyled: true } }).classes()).not.toContain('bg-muted/60')
  })
})
