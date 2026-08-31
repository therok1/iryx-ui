import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Section } from '../src/marketing'

describe('section', () => {
  it('renders a section element and honours as', () => {
    expect(mount(Section).element.tagName).toBe('SECTION')
    expect(mount(Section, { props: { as: 'div' } }).element.tagName).toBe('DIV')
  })

  it('renders the heading as an h2 with the eyebrow and description', () => {
    const wrapper = mount(Section, {
      props: { eyebrow: 'Pricing', heading: 'One price', description: 'No percentage.' },
    })
    expect(wrapper.find('h2').text()).toBe('One price')
    expect(wrapper.text()).toContain('Pricing')
    expect(wrapper.text()).toContain('No percentage.')
  })

  it('omits the header entirely when nothing fills it', () => {
    const wrapper = mount(Section, { slots: { default: 'Body' } })
    expect(wrapper.find('h2').exists()).toBe(false)
    expect(wrapper.text()).toBe('Body')
  })

  it('spaces the body from the header only when a header exists', () => {
    const withHeader = mount(Section, { props: { heading: 'A' }, slots: { default: 'Body' } })
    const without = mount(Section, { slots: { default: 'Body' } })
    expect(withHeader.html()).toContain('mt-12')
    expect(without.html()).not.toContain('mt-12')
  })

  it('centres the header by default and starts it on request', () => {
    expect(mount(Section, { props: { heading: 'A' } }).html()).toContain('text-center')
    expect(mount(Section, { props: { heading: 'A', align: 'start' } }).html()).toContain('text-left')
  })

  it('tints the band when muted and rules the top edge when bordered', () => {
    expect(mount(Section, { props: { tone: 'muted' } }).attributes('class')).toContain('bg-muted/20')
    expect(mount(Section, { props: { bordered: true } }).attributes('class')).toContain('border-t')
  })

  it('drops the built-in classes when unstyled', () => {
    const wrapper = mount(Section, { props: { unstyled: true, heading: 'A', class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
