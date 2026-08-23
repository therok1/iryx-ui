import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Splitter } from '../src'

const slots = {
  'panel-0': 'Left',
  'panel-1': 'Right',
  'panel-2': 'Third',
}

function panels(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-panel]')
}

function handles(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[role="separator"]')
}

describe('splitter', () => {
  // Two evenly split panels is the shape almost every splitter starts as.
  it('defaults to two panels', () => {
    const wrapper = mount(Splitter, { slots })
    expect(panels(wrapper)).toHaveLength(2)
    expect(wrapper.text()).toContain('Left')
    expect(wrapper.text()).toContain('Right')
  })

  it('renders one panel per entry', () => {
    const wrapper = mount(Splitter, { props: { panels: [{}, {}, {}] }, slots })
    expect(panels(wrapper)).toHaveLength(3)
    expect(wrapper.text()).toContain('Third')
  })

  /*
   * A handle goes *between* panels. Trailing one after each panel would leave
   * one hanging off the end of the group with nothing to resize.
   */
  it('puts one fewer handle than there are panels', () => {
    expect(handles(mount(Splitter, { slots }))).toHaveLength(1)
    expect(handles(mount(Splitter, { props: { panels: [{}, {}, {}] }, slots }))).toHaveLength(2)
  })

  it('renders no handle for a single panel', () => {
    expect(handles(mount(Splitter, { props: { panels: [{}] }, slots }))).toHaveLength(0)
  })

  it('applies the starting sizes', () => {
    const wrapper = mount(Splitter, { props: { panels: [{ size: 30 }, { size: 70 }] }, slots })
    expect(panels(wrapper)[0]?.attributes('style')).toContain('30')
  })

  it('lays out horizontally by default and vertically on request', () => {
    expect(mount(Splitter, { slots }).classes()).toContain('flex-row')
    expect(mount(Splitter, { props: { direction: 'vertical' }, slots }).classes()).toContain('flex-col')
  })

  it('turns the handle to match the direction', () => {
    const across = mount(Splitter, { slots })
    expect(handles(across)[0]?.classes()).toContain('cursor-col-resize')

    const down = mount(Splitter, { props: { direction: 'vertical' }, slots })
    expect(handles(down)[0]?.classes()).toContain('cursor-row-resize')
  })

  /*
   * A 1px target is unusable with a mouse, so the handle keeps a padded hit
   * area and only the rule inside it is thin.
   */
  it('gives the handle a hit area larger than its rule', () => {
    const wrapper = mount(Splitter, { slots })
    const handle = handles(wrapper)[0]
    expect(handle?.classes()).toContain('px-1')
    expect(handle?.get('span').classes()).toContain('w-px')
  })

  /*
   * Reka gives the handle `role="separator"` and a tab stop so arrow keys can
   * resize it. It does not set `aria-valuenow`, so nothing here asserts one —
   * inventing a value would be worse than the gap.
   */
  it('makes the handle a focusable separator', () => {
    const wrapper = mount(Splitter, { slots })
    const handle = handles(wrapper)[0]
    expect(handle?.attributes('tabindex')).toBe('0')
    expect(handle?.attributes('data-orientation')).toBe('horizontal')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(Splitter, { props: { ui: { rule: 'bg-primary' } }, slots })
    expect(wrapper.html()).toContain('bg-primary')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(Splitter, { props: { unstyled: true }, slots })
    expect(wrapper.classes()).toHaveLength(0)
    expect(handles(wrapper)[0]?.classes()).toHaveLength(0)
  })
})
