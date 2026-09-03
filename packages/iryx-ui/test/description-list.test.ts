import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { DescriptionList } from '../src'

const items = [
  { term: 'Invoice', description: 'INV-2048' },
  { term: 'Amount', description: '€4,280.00' },
]

describe('descriptionList', () => {
  it('renders a dl of term and description pairs', () => {
    const wrapper = mount(DescriptionList, { props: { items } })
    expect(wrapper.element.tagName).toBe('DL')
    expect(wrapper.findAll('dt').map(dt => dt.text())).toEqual(['Invoice', 'Amount'])
    expect(wrapper.findAll('dd').map(dd => dd.text())).toEqual(['INV-2048', '€4,280.00'])
  })

  it('renders each row through the slots', () => {
    const wrapper = mount(DescriptionList, {
      props: { items },
      slots: { description: '<b>{{ params.item.description }}</b>' },
    })
    expect(wrapper.get('dd b').text()).toBe('INV-2048')
  })

  it('lays the rows out side by side when horizontal', () => {
    const vertical = mount(DescriptionList, { props: { items } })
    const horizontal = mount(DescriptionList, { props: { items, orientation: 'horizontal' } })
    expect(vertical.classes()).not.toEqual(horizontal.classes())
    expect(horizontal.classes().join(' ')).toContain('grid')
  })

  it('rules the rows apart when divided', () => {
    const wrapper = mount(DescriptionList, { props: { items, divided: true } })
    expect(wrapper.get('dt').element.parentElement?.className).toContain('border-t')
  })
})
