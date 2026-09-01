import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { SiteFooter, SiteHeader } from '../src/marketing'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing', current: true },
  { label: 'Docs', href: 'https://example.com/docs', external: true },
]

describe('siteHeader', () => {
  it('renders as a header with the brand and the links', () => {
    const wrapper = mount(SiteHeader, { props: { name: 'Iryx', links } })
    expect(wrapper.element.tagName).toBe('HEADER')
    expect(wrapper.get('nav a').text()).toBe('Features')
    expect(wrapper.text()).toContain('Iryx')
  })

  it('marks the current link and leaves the others alone', () => {
    const wrapper = mount(SiteHeader, { props: { links } })
    const current = wrapper.findAll('nav a').filter(a => a.attributes('aria-current') === 'page')
    expect(current).toHaveLength(1)
    expect(current[0]!.text()).toBe('Pricing')
  })

  it('gives an external link the rel it needs', () => {
    const wrapper = mount(SiteHeader, { props: { links } })
    const external = wrapper.findAll('nav a').find(a => a.text() === 'Docs')!
    expect(external.attributes('target')).toBe('_blank')
    expect(external.attributes('rel')).toBe('noreferrer')
  })

  /*
   * A menu button that opens an empty panel is worse than no button, so the
   * drawer is rendered only when the links or the slot give it something.
   */
  it('omits the menu button when there is nothing to put in it', () => {
    const wrapper = mount(SiteHeader, { props: { name: 'Iryx' } })
    expect(wrapper.find('button[aria-label="Open the menu"]').exists()).toBe(false)
  })

  it('renders the menu button once there are links', () => {
    const wrapper = mount(SiteHeader, { props: { links } })
    expect(wrapper.find('button[aria-label="Open the menu"]').exists()).toBe(true)
  })

  it('lets the mobile menu be turned off entirely', () => {
    const wrapper = mount(SiteHeader, { props: { links, mobileMenu: false } })
    expect(wrapper.find('button[aria-label="Open the menu"]').exists()).toBe(false)
  })

  it('drops the sticky classes when asked', () => {
    expect(mount(SiteHeader, { props: { sticky: false } }).classes()).not.toContain('sticky')
    expect(mount(SiteHeader, { props: {} }).classes()).toContain('sticky')
  })

  it('drops every built-in class under unstyled', () => {
    const wrapper = mount(SiteHeader, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.classes()).toEqual(['mine'])
  })
})

describe('siteFooter', () => {
  it('renders as a footer with the links and the note', () => {
    const wrapper = mount(SiteFooter, { props: { name: 'Iryx', links, note: '© 2026' } })
    expect(wrapper.element.tagName).toBe('FOOTER')
    expect(wrapper.findAll('nav a')).toHaveLength(3)
    expect(wrapper.text()).toContain('© 2026')
  })

  /* The page a footer sits on is often the one its brand would link to. */
  it('renders the brand as plain text without an href', () => {
    expect(mount(SiteFooter, { props: { name: 'Iryx' } }).find('a').exists()).toBe(false)
    expect(mount(SiteFooter, { props: { name: 'Iryx', href: '/' } }).find('a').exists()).toBe(true)
  })

  it('omits the regions it was given nothing for', () => {
    const wrapper = mount(SiteFooter, { props: { name: 'Iryx' } })
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.find('p').exists()).toBe(false)
  })
})
