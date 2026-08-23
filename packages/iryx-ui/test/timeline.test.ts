import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { Timeline } from '../src'

const StubIcon = { render: () => h('svg') }

const events = [
  { title: 'Invoice created', time: '09:12', datetime: '2026-08-22T09:12:00Z' },
  { title: 'Sent to client', time: '09:20', description: 'Delivered to ana@example.com.' },
  { title: 'Paid', time: '14:03', variant: 'success' as const },
]

describe('timeline', () => {
  // An ordered list, because the order is the meaning.
  it('renders an ordered list of events', () => {
    const wrapper = mount(Timeline, { props: { items: events } })
    expect(wrapper.element.tagName).toBe('OL')
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.text()).toContain('Invoice created')
    expect(wrapper.text()).toContain('Paid')
  })

  it('renders descriptions only where there are any', () => {
    const wrapper = mount(Timeline, { props: { items: events } })
    expect(wrapper.findAll('p')).toHaveLength(1)
    expect(wrapper.text()).toContain('Delivered to ana@example.com.')
  })

  it('renders the time as a machine-readable element', () => {
    const wrapper = mount(Timeline, { props: { items: events } })
    const time = wrapper.get('time')
    expect(time.text()).toBe('09:12')
    expect(time.attributes('datetime')).toBe('2026-08-22T09:12:00Z')
  })

  it('leaves datetime off when none is given', () => {
    const wrapper = mount(Timeline, { props: { items: [{ title: 'x', time: '09:00' }] } })
    expect(wrapper.get('time').attributes('datetime')).toBeUndefined()
  })

  it('renders no time element without a time', () => {
    const wrapper = mount(Timeline, { props: { items: [{ title: 'x' }] } })
    expect(wrapper.find('time').exists()).toBe(false)
  })

  /*
   * The spine is drawn per item so the last one can omit it — a single line
   * behind the column would run past the final marker and trail off.
   */
  it('draws one fewer connector than there are events', () => {
    const wrapper = mount(Timeline, { props: { items: events } })
    expect(wrapper.findAll('.bg-border')).toHaveLength(2)
  })

  it('draws no connector for a single event', () => {
    const wrapper = mount(Timeline, { props: { items: [{ title: 'Only one' }] } })
    expect(wrapper.findAll('.bg-border')).toHaveLength(0)
  })

  it('drops the trailing space on the last item', () => {
    const wrapper = mount(Timeline, { props: { items: events } })
    const contents = wrapper.findAll('li > div:last-child')
    expect(contents.at(-1)?.classes()).toContain('pb-0')
    expect(contents[0]?.classes()).toContain('pb-6')
  })

  it('colours a marker by its variant', () => {
    const wrapper = mount(Timeline, { props: { items: events } })
    const markers = wrapper.findAll('li span.rounded-full')
    expect(markers.at(-1)?.classes()).toContain('bg-success')
    expect(markers[0]?.classes()).toContain('bg-muted-foreground')
  })

  it('falls back to the timeline variant', () => {
    const wrapper = mount(Timeline, { props: { items: [{ title: 'x' }], variant: 'primary' } })
    expect(wrapper.get('li span.rounded-full').classes()).toContain('bg-primary')
  })

  /*
   * An icon needs a real box to sit in, so the dot grows into a ringed circle
   * and the fill becomes a tint.
   */
  it('grows the marker into a box when the item has an icon', () => {
    const wrapper = mount(Timeline, { props: { items: [{ title: 'x', icon: StubIcon }] } })
    const marker = wrapper.get('li span.rounded-full')
    expect(marker.classes()).toContain('size-7')
    expect(marker.classes()).not.toContain('size-3')
    expect(marker.find('svg').exists()).toBe(true)
  })

  it('tints an icon marker to match its variant', () => {
    const wrapper = mount(Timeline, {
      props: { items: [{ title: 'x', icon: StubIcon, variant: 'danger' as const }] },
    })
    expect(wrapper.get('li span.rounded-full').classes()).toContain('bg-danger/10')
  })

  it('sizes the rows', () => {
    const wrapper = mount(Timeline, { props: { items: events, size: 'sm' } })
    expect(wrapper.get('li span.rounded-full').classes()).toContain('size-2.5')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(Timeline, { props: { items: events, ui: { title: 'text-lg' } } })
    expect(wrapper.html()).toContain('text-lg')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(Timeline, { props: { items: events, unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
    expect(wrapper.get('li').classes()).toHaveLength(0)
  })
})
