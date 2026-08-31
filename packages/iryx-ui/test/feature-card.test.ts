import { ZapIcon } from '@hugeicons/core-free-icons'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { FeatureCard } from '../src/marketing'

describe('featureCard', () => {
  it('renders the title as an h3 with the description', () => {
    const wrapper = mount(FeatureCard, { props: { title: 'Money that adds up', description: 'To the penny.' } })
    expect(wrapper.find('h3').text()).toBe('Money that adds up')
    expect(wrapper.text()).toContain('To the penny.')
  })

  it('renders the icon only when given', () => {
    expect(mount(FeatureCard, { props: { title: 'A' } }).find('svg').exists()).toBe(false)
    expect(mount(FeatureCard, { props: { title: 'A', icon: ZapIcon } }).find('svg').exists()).toBe(true)
  })

  it('centres the card and its icon on request', () => {
    expect(mount(FeatureCard, { props: { title: 'A' } }).attributes('class')).not.toContain('text-center')
    expect(mount(FeatureCard, { props: { title: 'A', align: 'center' } }).attributes('class')).toContain('text-center')
  })

  it('drops the built-in classes when unstyled', () => {
    expect(mount(FeatureCard, { props: { unstyled: true, class: 'mine' } }).attributes('class')).toBe('mine')
  })
})
