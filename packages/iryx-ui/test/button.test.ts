import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Button } from '../src'

/*
 * Padding tightens on the side an icon sits on. The icon declares its own
 * position via `data-icon`, which is what makes this work in pure CSS: a label
 * is a bare text node, so `:first-child` / `:last-child` would match the icon
 * on both sides at once.
 */
describe('button icon padding', () => {
  it('carries a per-side rule for each size', () => {
    for (const [size, start, end] of [
      ['xs', 'has-[[data-icon=inline-start]]:pl-1.5', 'has-[[data-icon=inline-end]]:pr-1.5'],
      ['sm', 'has-[[data-icon=inline-start]]:pl-2', 'has-[[data-icon=inline-end]]:pr-2'],
      ['md', 'has-[[data-icon=inline-start]]:pl-3', 'has-[[data-icon=inline-end]]:pr-3'],
      ['lg', 'has-[[data-icon=inline-start]]:pl-4', 'has-[[data-icon=inline-end]]:pr-4'],
      ['xl', 'has-[[data-icon=inline-start]]:pl-5', 'has-[[data-icon=inline-end]]:pr-5'],
    ] as const) {
      const classes = mount(Button, { props: { size } }).attributes('class') ?? ''
      expect(classes).toContain(start)
      expect(classes).toContain(end)
    }
  })

  it('keeps the roomier padding as the baseline', () => {
    expect(mount(Button).attributes('class')).toContain('px-4')
  })

  it('marks the loading spinner as a leading icon', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.get('svg').attributes('data-icon')).toBe('inline-start')
  })

  it('squares the button and drops the padding when square', () => {
    const classes = mount(Button, { props: { square: true } }).attributes('class') ?? ''
    expect(classes).toContain('w-9')
    expect(classes).toContain('px-0')
    // A marked icon must not re-add padding to a square button.
    expect(classes).toContain('has-[[data-icon]]:px-0')
  })

  it('matches the square width to each height', () => {
    for (const [size, width] of [
      ['xs', 'w-7'],
      ['sm', 'w-8'],
      ['md', 'w-9'],
      ['lg', 'w-10'],
      ['xl', 'w-12'],
    ] as const) {
      expect(mount(Button, { props: { size, square: true } }).attributes('class')).toContain(width)
    }
  })
})

describe('button transitions', () => {
  /*
   * Geometry must not ease: a spinner appearing changes the padding and width,
   * and `transition-all` made the button visibly stretch on every load.
   */
  it('animates colour and motion but never geometry', () => {
    const classes = mount(Button).attributes('class') ?? ''
    expect(classes).not.toContain('transition-all')
    expect(classes).toContain('transition-[color,background-color,border-color,box-shadow,opacity,filter,translate]')
  })
})

describe('button press', () => {
  it('nudges down on press for surface variants', () => {
    for (const variant of ['solid', 'outline', 'ghost'] as const) {
      expect(mount(Button, { props: { variant } }).attributes('class'))
        .toContain('active:translate-y-px')
    }
  })

  it('leaves the link variant in place', () => {
    // The base class is still present, so the override must cancel it.
    expect(mount(Button, { props: { variant: 'link' } }).attributes('class'))
      .toContain('active:translate-y-0')
  })
})

describe('button', () => {
  it('renders a button with default variant classes', () => {
    const wrapper = mount(Button, { slots: { default: 'Click me' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('from-primary-from')
    expect(wrapper.classes()).toContain('to-primary-to')
  })

  it('applies variant and size', () => {
    const wrapper = mount(Button, { props: { variant: 'outline', size: 'lg' } })
    expect(wrapper.classes()).toContain('border-border')
    expect(wrapper.classes()).toContain('h-10')
  })

  it('merges a custom class over conflicting defaults', () => {
    const wrapper = mount(Button, { props: { class: 'rounded-full' } })
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).not.toContain('rounded-lg')
  })

  it('renders no built-in classes when unstyled', () => {
    const wrapper = mount(Button, { props: { unstyled: true, class: 'my-btn' } })
    expect(wrapper.attributes('class')).toBe('my-btn')
  })

  it('disables the button while loading and shows a spinner', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
