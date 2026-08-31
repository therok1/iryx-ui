import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Hero } from '../src/marketing'

describe('hero', () => {
  it('renders the heading as an h1', () => {
    const wrapper = mount(Hero, { props: { heading: 'Get paid on time' } })
    expect(wrapper.find('h1').text()).toBe('Get paid on time')
  })

  it('renders the aurora backdrop by default and drops it on none', () => {
    expect(mount(Hero).html()).toContain('iryx-hero-aurora')
    expect(mount(Hero, { props: { backdrop: 'none' } }).html()).not.toContain('iryx-hero-')
  })

  it('swaps the backdrop layer for bloom', () => {
    const html = mount(Hero, { props: { backdrop: 'bloom' } }).html()
    expect(html).toContain('iryx-hero-bloom')
    expect(html).not.toContain('iryx-hero-aurora')
  })

  it('hides the decorative layers from assistive technology', () => {
    const backdrop = mount(Hero, { props: { grid: true } }).findAll('[aria-hidden="true"]')
    expect(backdrop).toHaveLength(2)
  })

  it('adds the grid only when asked', () => {
    expect(mount(Hero).html()).not.toContain('iryx-hero-grid')
    expect(mount(Hero, { props: { grid: true } }).html()).toContain('iryx-hero-grid')
  })

  it('renders optional regions only when filled', () => {
    const bare = mount(Hero)
    expect(bare.find('h1').exists()).toBe(false)
    expect(bare.find('p').exists()).toBe(false)

    const full = mount(Hero, {
      props: { heading: 'A', description: 'B', note: 'C' },
      slots: { actions: '<button>Go</button>', media: '<img alt="">' },
    })
    expect(full.text()).toContain('B')
    expect(full.text()).toContain('C')
    expect(full.find('button').exists()).toBe(true)
    expect(full.find('img').exists()).toBe(true)
  })

  it('drops the built-in classes and the backdrop when unstyled', () => {
    const wrapper = mount(Hero, { props: { unstyled: true, grid: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
    expect(wrapper.html()).not.toContain('iryx-hero-grid')
  })
})
