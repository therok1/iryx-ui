import { Tick02Icon } from '@hugeicons/core-free-icons'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { Icon } from '../src'

const Star = defineComponent({
  render: () => h('svg', { 'data-star': '' }),
})

describe('icon', () => {
  it('renders a component icon', () => {
    const wrapper = mount(Icon, { props: { icon: Star } })
    expect(wrapper.find('svg[data-star]').exists()).toBe(true)
  })

  it('renders nothing without an icon', () => {
    expect(mount(Icon).html()).toBe('<!--v-if-->')
  })

  it('is decorative by default', () => {
    const wrapper = mount(Icon, { props: { icon: Star } })
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('svg').attributes('role')).toBeUndefined()
  })

  it('takes a name when labelled', () => {
    const wrapper = mount(Icon, { props: { icon: Star, label: 'Favourite' } })
    const svg = wrapper.find('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('Favourite')
    expect(svg.attributes('aria-hidden')).toBeUndefined()
  })

  it('passes class through', () => {
    const wrapper = mount(Icon, { props: { icon: Star, class: 'size-4' } })
    expect(wrapper.find('svg').classes()).toContain('size-4')
  })

  it('renders a hugeicons data icon as plain svg attributes', () => {
    const wrapper = mount(Icon, { props: { icon: Tick02Icon } })
    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    expect(wrapper.find('path').attributes('stroke-linecap')).toBe('round')
  })
})
