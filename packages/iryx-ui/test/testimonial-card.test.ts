import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { TestimonialCard } from '../src/marketing'

describe('testimonialCard', () => {
  it('wraps the quote in curly quotes', () => {
    expect(mount(TestimonialCard, { props: { quote: 'It just works' } }).text())
      .toBe('\u201CIt just works\u201D')
  })

  it('quotes the words and leaves the attribution outside the quote', () => {
    const wrapper = mount(TestimonialCard, { props: { quote: 'It just works', name: 'Rae Ellis' } })
    const quote = wrapper.find('blockquote')
    expect(quote.exists()).toBe(true)
    expect(quote.text()).not.toContain('Rae Ellis')
  })

  it('credits a role on its own', () => {
    const wrapper = mount(TestimonialCard, { props: { quote: 'A', role: 'Finance lead' } })
    expect(wrapper.text()).toContain('Finance lead')
  })

  it('renders the name and role', () => {
    const wrapper = mount(TestimonialCard, { props: { quote: 'A', name: 'Rae Ellis', role: 'Finance lead' } })
    expect(wrapper.text()).toContain('Rae Ellis')
    expect(wrapper.text()).toContain('Finance lead')
  })

  it('omits the footer when nobody is credited', () => {
    const wrapper = mount(TestimonialCard, { props: { quote: 'Anonymous praise' } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('\u201CAnonymous praise\u201D')
  })

  it('leaves the avatar alt empty, since the name is printed beside it', () => {
    const wrapper = mount(TestimonialCard, { props: { quote: 'A', name: 'Rae Ellis', avatar: '/rae.jpg' } })
    expect(wrapper.find('img').attributes('alt')).toBe('')
  })

  it('lets the default slot replace the quote', () => {
    const wrapper = mount(TestimonialCard, { props: { quote: 'Ignored' }, slots: { default: 'Custom markup' } })
    expect(wrapper.text()).toBe('Custom markup')
  })
})
