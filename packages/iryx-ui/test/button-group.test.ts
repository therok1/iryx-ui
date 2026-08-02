import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { Button, ButtonGroup } from '../src'

describe('buttonGroup', () => {
  it('groups its children for assistive tech', () => {
    const wrapper = mount(ButtonGroup)
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('squares off the inner edges horizontally', () => {
    const classes = mount(ButtonGroup).attributes('class') ?? ''
    expect(classes).toContain('[&>*:not(:first-child)]:rounded-l-none')
    expect(classes).toContain('[&>*:not(:last-child)]:rounded-r-none')
    // Collapses the doubled border between children.
    expect(classes).toContain('[&>*:not(:first-child)]:-ml-px')
  })

  it('switches the seams to the vertical axis', () => {
    const classes = mount(ButtonGroup, { props: { orientation: 'vertical' } }).attributes('class') ?? ''
    expect(classes).toContain('flex-col')
    expect(classes).toContain('[&>*:not(:first-child)]:rounded-t-none')
    expect(classes).toContain('[&>*:not(:first-child)]:-mt-px')
    expect(classes).not.toContain('rounded-l-none')
  })

  /*
   * Collapsed borders overlap, so a focused child must be able to paint its
   * ring above its neighbour.
   */
  it('raises hovered and focused children above their neighbours', () => {
    const classes = mount(ButtonGroup).attributes('class') ?? ''
    expect(classes).toContain('[&>*:focus-visible]:z-10')
    expect(classes).toContain('[&>*:hover]:z-10')
    expect(classes).toContain('isolate')
  })

  it('shares its size with the buttons inside', () => {
    const wrapper = mount(ButtonGroup, {
      props: { size: 'lg' },
      slots: { default: () => h(Button, null, () => 'Go') },
    })
    // lg buttons are h-10.
    expect(wrapper.get('button').attributes('class')).toContain('h-10')
  })

  it('lets an explicit button size win over the group size', () => {
    const wrapper = mount(ButtonGroup, {
      props: { size: 'lg' },
      slots: { default: () => h(Button, { size: 'xs' }, () => 'Go') },
    })
    expect(wrapper.get('button').attributes('class')).toContain('h-7')
  })

  it('leaves buttons at their default size when the group sets none', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: () => h(Button, null, () => 'Go') },
    })
    expect(wrapper.get('button').attributes('class')).toContain('h-9')
  })

  it('accepts any child, not just buttons', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: '<button>One</button><a href="#">Two</a><span>Three</span>' },
    })
    expect(wrapper.element.children).toHaveLength(3)
  })

  it('splits the width between children when block', () => {
    const classes = mount(ButtonGroup, { props: { block: true } }).attributes('class') ?? ''
    expect(classes).toContain('w-full')
    expect(classes).toContain('[&>*]:flex-1')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(ButtonGroup, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
