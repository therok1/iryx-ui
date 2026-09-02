import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { RadioGroup } from '../src'

const items = [
  { label: 'Free', value: 'free', description: 'Three a month.' },
  { label: 'Pro', value: 'pro' },
]

describe('radioGroup', () => {
  it('renders one radio per item, labelled and described', () => {
    const wrapper = mount(RadioGroup, { props: { items } })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios).toHaveLength(2)
    expect(wrapper.text()).toContain('Three a month.')
  })

  /*
   * The card and the tile are the control, so the text moves inside the
   * button. Named through `aria-labelledby`, or the description would be read
   * out as part of the option's name.
   */
  it.each(['card', 'tile'] as const)('names the %s by its label alone', (variant) => {
    const wrapper = mount(RadioGroup, { props: { items, variant } })
    const radio = wrapper.findAll('[role="radio"]')[0]!

    expect(radio.text()).toContain('Free')
    const labelId = radio.attributes('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(wrapper.get(`#${labelId}`).text()).toBe('Free')
    expect(wrapper.get(`#${radio.attributes('aria-describedby')}`).text()).toBe('Three a month.')
  })

  it('keeps the label beside the control for the default variant', () => {
    const wrapper = mount(RadioGroup, { props: { items } })
    const radio = wrapper.findAll('[role="radio"]')[0]!
    expect(radio.text()).toBe('')
    expect(wrapper.get('label').attributes('for')).toBe(radio.attributes('id'))
  })

  it('renders the item icon only for the tile variant', () => {
    const icon = [['path', { d: 'M0 0h24v24H0z' }]] as any
    const withIcon = [{ label: 'Card', value: 'card', icon }]

    expect(mount(RadioGroup, { props: { items: withIcon, variant: 'tile' } }).find('svg').exists()).toBe(true)
    expect(mount(RadioGroup, { props: { items: withIcon, variant: 'card' } }).find('svg').exists()).toBe(false)
  })
})
