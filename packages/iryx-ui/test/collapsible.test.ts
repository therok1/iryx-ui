import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Collapsible } from '../src'

const slots = { default: 'Hidden content' }

describe('collapsible', () => {
  it('starts closed', () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details' }, slots })
    expect(wrapper.get('button').attributes('data-state')).toBe('closed')
  })

  it('takes a default open state', () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details', defaultOpen: true }, slots })
    expect(wrapper.get('button').attributes('data-state')).toBe('open')
  })

  it('opens on click', async () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details' }, slots })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('follows a controlled open prop', async () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details', open: false }, slots })
    await wrapper.setProps({ open: true })
    expect(wrapper.get('button').attributes('data-state')).toBe('open')
  })

  it('renders the label on the trigger', () => {
    expect(mount(Collapsible, { props: { label: 'Details' }, slots }).get('button').text()).toContain('Details')
  })

  /*
   * Content stays mounted while closed so the height animation has something
   * to animate; `unmountOnHide` trades that away.
   */
  it('keeps the content mounted while closed', () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details' }, slots })
    expect(wrapper.html()).toContain('Hidden content')
  })

  it('unmounts the content when asked', () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details', unmountOnHide: true }, slots })
    expect(wrapper.html()).not.toContain('Hidden content')
  })

  it('animates height on the content', () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details', defaultOpen: true }, slots })
    // The content region carries no `data-state`, only Reka's generated id.
    const content = wrapper.get('[id^="reka-collapsible-content"]')
    expect(content.classes()).toContain('overflow-hidden')
    expect(content.classes()).toContain('data-[state=open]:animate-collapsible-down')
  })

  // Rotated rather than swapped, so both states read as one control.
  it('rotates the chevron when open', () => {
    const shut = mount(Collapsible, { props: { label: 'Details' }, slots })
    const open = mount(Collapsible, { props: { label: 'Details', defaultOpen: true }, slots })
    expect(shut.get('svg').classes()).not.toContain('rotate-180')
    expect(open.get('svg').classes()).toContain('rotate-180')
  })

  it('drops the chevron when asked', () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details', hideIcon: true }, slots })
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('puts the chevron on the leading edge when asked', () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details', iconPosition: 'start' }, slots })
    expect(wrapper.get('svg').classes()).toContain('order-first')
  })

  it('does not open while disabled', async () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details', disabled: true }, slots })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(Collapsible, { props: { label: 'Details', unstyled: true }, slots })
    expect(wrapper.classes()).toHaveLength(0)
    expect(wrapper.get('button').classes()).toHaveLength(0)
  })
})
