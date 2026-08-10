import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { Breadcrumb, Separator, Skeleton, Stat } from '../src'

/** Stand-in for a component icon, e.g. from Lucide. */
const Home = () => h('svg')

describe('separator', () => {
  it('is hidden from assistive tech by default', () => {
    // Decorative rules add nothing for a screen reader.
    expect(mount(Separator).attributes('role')).toBe('none')
  })

  it('becomes a real separator when not decorative', () => {
    const wrapper = mount(Separator, { props: { decorative: false } })
    expect(wrapper.attributes('role')).toBe('separator')
  })

  it('flips the axis when vertical', () => {
    expect(mount(Separator, { props: { orientation: 'vertical' } }).attributes('class'))
      .toContain('w-px')
    expect(mount(Separator).attributes('class')).toContain('h-px')
  })

  it('splits into two rules around a label', () => {
    const wrapper = mount(Separator, { props: { label: 'or' } })
    expect(wrapper.text()).toBe('or')
    expect(wrapper.findAll('[data-orientation]')).toHaveLength(2)
  })

  it('drops built-in classes when unstyled', () => {
    expect(mount(Separator, { props: { unstyled: true, class: 'mine' } }).attributes('class'))
      .toBe('mine')
  })
})

describe('skeleton', () => {
  it('announces itself as loading', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('allows overriding the label for non-English apps', () => {
    expect(mount(Skeleton, { props: { label: 'Nalaganje' } }).attributes('aria-label'))
      .toBe('Nalaganje')
  })

  it('renders stacked lines, announced once', () => {
    const wrapper = mount(Skeleton, { props: { lines: 3, variant: 'text' } })
    expect(wrapper.attributes('role')).toBe('status')
    const lines = wrapper.findAll('[aria-hidden="true"]')
    expect(lines).toHaveLength(3)
    // The individual lines must not each announce themselves.
    expect(lines.every(line => line.attributes('role') === undefined)).toBe(true)
  })

  it('treats a line count below one as a single line', () => {
    expect(mount(Skeleton, { props: { lines: 0 } }).attributes('role')).toBe('status')
  })

  it('applies the variant shape', () => {
    expect(mount(Skeleton, { props: { variant: 'circle' } }).attributes('class'))
      .toContain('rounded-full')
  })
})

describe('stat', () => {
  it('renders label, value and hint', () => {
    const wrapper = mount(Stat, { props: { label: 'Revenue', value: '€12,400', hint: 'vs last month' } })
    expect(wrapper.text()).toContain('Revenue')
    expect(wrapper.text()).toContain('€12,400')
    expect(wrapper.text()).toContain('vs last month')
  })

  it('derives the trend from the sign of the delta', () => {
    expect(mount(Stat, { props: { delta: 12 } }).text()).toContain('+12%')
    expect(mount(Stat, { props: { delta: 12 } }).html()).toContain('text-success')
    expect(mount(Stat, { props: { delta: -8 } }).text()).toContain('-8%')
    expect(mount(Stat, { props: { delta: -8 } }).html()).toContain('text-danger')
  })

  /* A flat result should read as neither good nor bad. */
  it('treats a zero delta as neutral', () => {
    const wrapper = mount(Stat, { props: { delta: 0 } })
    expect(wrapper.html()).toContain('text-muted-foreground')
    expect(wrapper.html()).not.toContain('text-success')
  })

  /* Falling costs are good, and the sign alone cannot express that. */
  it('lets an explicit trend override the sign', () => {
    const wrapper = mount(Stat, { props: { delta: -8, trend: 'up' } })
    expect(wrapper.html()).toContain('text-success')
  })

  it('omits the delta entirely when not given', () => {
    expect(mount(Stat, { props: { value: '3' } }).text()).toBe('3')
  })

  it('lets formatDelta override the display', () => {
    const wrapper = mount(Stat, {
      props: { delta: 1234.5, formatDelta: d => `${d} €` },
    })
    expect(wrapper.text()).toContain('1234.5 €')
  })
})

describe('breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Invoices', href: '/invoices' },
    { label: 'INV-001' },
  ]

  it('is a labelled navigation landmark', () => {
    const wrapper = mount(Breadcrumb, { props: { items } })
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('allows overriding the landmark label for non-English apps', () => {
    expect(mount(Breadcrumb, { props: { items, label: 'Drobtine' } }).attributes('aria-label'))
      .toBe('Drobtine')
  })

  it('marks the last crumb as the current page and does not link it', () => {
    const wrapper = mount(Breadcrumb, { props: { items } })
    const current = wrapper.get('[aria-current="page"]')
    expect(current.text()).toBe('INV-001')
    expect(wrapper.findAll('a')).toHaveLength(2)
  })

  it('renders a separator between crumbs but not after the last', () => {
    const wrapper = mount(Breadcrumb, { props: { items } })
    expect(wrapper.findAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(2)
    expect(wrapper.findAll('li')).toHaveLength(3)
  })

  it('renders a button when a crumb has no href', () => {
    const wrapper = mount(Breadcrumb, {
      props: { items: [{ label: 'Back', onSelect: () => {} }, { label: 'Here' }] },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('drops built-in classes when unstyled', () => {
    expect(mount(Breadcrumb, { props: { items, unstyled: true, class: 'mine' } }).attributes('class'))
      .toBe('mine')
  })
})
