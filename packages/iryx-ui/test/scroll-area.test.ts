import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ScrollArea } from '../src'

function bars(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-orientation]')
}

describe('scrollArea', () => {
  it('renders its content in a viewport', () => {
    const wrapper = mount(ScrollArea, { slots: { default: 'Contents' } })
    expect(wrapper.text()).toContain('Contents')
  })

  // With the default 'hover' type the bars only mount on demand, and jsdom
  // never overflows — so visibility tests have to ask for 'always'.
  it('shows a vertical bar by default', () => {
    const wrapper = mount(ScrollArea, { props: { type: 'always' }, slots: { default: 'x' } })
    const orientations = bars(wrapper).map(b => b.attributes('data-orientation'))
    expect(orientations).toContain('vertical')
    expect(orientations).not.toContain('horizontal')
  })

  it('shows only a horizontal bar when asked', () => {
    const wrapper = mount(ScrollArea, { props: { type: 'always', orientation: 'horizontal' }, slots: { default: 'x' } })
    const orientations = bars(wrapper).map(b => b.attributes('data-orientation'))
    expect(orientations).toContain('horizontal')
    expect(orientations).not.toContain('vertical')
  })

  it('shows both bars when asked', () => {
    const wrapper = mount(ScrollArea, { props: { type: 'always', orientation: 'both' }, slots: { default: 'x' } })
    const orientations = bars(wrapper).map(b => b.attributes('data-orientation'))
    expect(orientations).toContain('vertical')
    expect(orientations).toContain('horizontal')
  })

  /*
   * Dragging a bar must not scroll the page underneath it, nor start
   * selecting the content it sits over.
   */
  it('keeps the bar from hijacking touch or selection', () => {
    const wrapper = mount(ScrollArea, { props: { type: 'always' }, slots: { default: 'x' } })
    const bar = bars(wrapper).find(b => b.attributes('data-orientation') === 'vertical')
    expect(bar?.classes()).toContain('touch-none')
    expect(bar?.classes()).toContain('select-none')
  })

  it('sizes the bars', () => {
    const thin = mount(ScrollArea, { props: { type: 'always', size: 'sm' }, slots: { default: 'x' } })
    const thick = mount(ScrollArea, { props: { type: 'always', size: 'lg' }, slots: { default: 'x' } })
    const barOf = (w: ReturnType<typeof mount>) =>
      bars(w).find(b => b.attributes('data-orientation') === 'vertical')
    expect(barOf(thin)?.classes()).toContain('w-1.5')
    expect(barOf(thick)?.classes()).toContain('w-3.5')
  })

  it('clips at the root so the bars sit inside it', () => {
    expect(mount(ScrollArea, { slots: { default: 'x' } }).classes()).toContain('overflow-hidden')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(ScrollArea, {
      props: { type: 'always', ui: { thumb: 'bg-primary' } },
      slots: { default: 'x' },
    })
    expect(wrapper.html()).toContain('bg-primary')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(ScrollArea, { props: { unstyled: true }, slots: { default: 'x' } })
    expect(wrapper.classes()).toHaveLength(0)
  })
})
