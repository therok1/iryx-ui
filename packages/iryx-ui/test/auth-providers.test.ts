import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { AuthProviders } from '../src'

/** Stand-in for a provider's own mark. */
const Mark = () => h('svg')

const providers = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'apple', label: 'Continue with Apple' },
]

describe('authProviders', () => {
  it('renders one button per provider', () => {
    const wrapper = mount(AuthProviders, { props: { providers } })
    expect(wrapper.findAll('button').map(b => b.text())).toEqual([
      'Continue with Google',
      'Continue with Apple',
    ])
  })

  it('emits select with the provider', async () => {
    const wrapper = mount(AuthProviders, { props: { providers } })
    await wrapper.findAll('button')[1]?.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([providers[1]])
  })

  it('renders a link when the provider has an href', () => {
    const wrapper = mount(AuthProviders, {
      props: { providers: [{ id: 'google', label: 'Google', href: '/auth/google' }] },
    })
    expect(wrapper.get('a').attributes('href')).toBe('/auth/google')
  })

  it('disables every provider at once', () => {
    const wrapper = mount(AuthProviders, { props: { providers, disabled: true } })
    expect(wrapper.findAll('button').every(b => b.attributes('disabled') !== undefined)).toBe(true)
  })

  /* The label is the only name a mark-only button has left. */
  it('keeps the label as the accessible name when compact', () => {
    const wrapper = mount(AuthProviders, { props: { providers, compact: true } })
    const first = wrapper.findAll('button')[0]
    expect(first?.text()).toBe('')
    expect(first?.attributes('aria-label')).toBe('Continue with Google')
  })

  /*
   * The mark is pinned out of the flow so that labels of different lengths
   * still line up with each other, which is the point of the component.
   */
  it('takes the mark out of the flow only while labels show', () => {
    const withLabels = mount(AuthProviders, {
      props: { providers: [{ id: 'google', label: 'Google', icon: Mark }] },
    })
    expect(withLabels.get('button > span').classes()).toContain('absolute')

    const compact = mount(AuthProviders, {
      props: { compact: true, providers: [{ id: 'google', label: 'Google', icon: Mark }] },
    })
    expect(compact.get('button > span').classes()).toContain('static')
  })

  it('drops the mark for a spinner while loading', () => {
    const wrapper = mount(AuthProviders, {
      props: { providers: [{ id: 'google', label: 'Google', icon: Mark, loading: true }] },
    })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('svg').classes()).toContain('animate-spin')
    expect(wrapper.findAll('svg')).toHaveLength(1)
  })

  /* Otherwise a custom mark and the button's spinner both draw. */
  it('stands a slotted mark down while loading', () => {
    const wrapper = mount(AuthProviders, {
      props: { providers: [{ id: 'google', label: 'Google', loading: true }] },
      slots: { icon: '<svg data-mark />' },
    })
    expect(wrapper.find('[data-mark]').exists()).toBe(false)
    expect(wrapper.get('svg').classes()).toContain('animate-spin')
  })

  it('takes the styling back when unstyled', () => {
    const wrapper = mount(AuthProviders, {
      props: { providers, unstyled: true, class: 'grid' },
    })
    expect(wrapper.get('div').classes()).toEqual(['grid'])
  })
})
