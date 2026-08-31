import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PricingCard, PricingTable } from '../src/marketing'

const plans = [
  { name: 'Solo', price: '€0', period: 'forever', cta: 'Start' },
  { name: 'Studio', price: '€24', period: 'per month', cta: 'Choose', featured: true },
]

describe('pricingCard', () => {
  it('renders the name as an h3 with the price and period', () => {
    const wrapper = mount(PricingCard, { props: { name: 'Studio', price: '€24', period: 'per month' } })
    expect(wrapper.find('h3').text()).toBe('Studio')
    expect(wrapper.text()).toContain('€24')
    expect(wrapper.text()).toContain('per month')
  })

  it('renders one list item per feature', () => {
    const wrapper = mount(PricingCard, { props: { features: ['Reminders', 'CSV export'] } })
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.findAll('li')[1]?.text()).toContain('CSV export')
  })

  it('renders the button only when a cta is given, and emits select', async () => {
    expect(mount(PricingCard).find('button').exists()).toBe(false)

    const wrapper = mount(PricingCard, { props: { cta: 'Start' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  it('badges and rings the featured plan only', () => {
    expect(mount(PricingCard, { props: { name: 'Solo' } }).text()).not.toContain('Most popular')

    const featured = mount(PricingCard, { props: { name: 'Studio', featured: true } })
    expect(featured.text()).toContain('Most popular')
    expect(featured.html()).toContain('ring-1')
  })

  it('takes a custom badge label', () => {
    const wrapper = mount(PricingCard, { props: { featured: true, badge: 'Most chosen' } })
    expect(wrapper.text()).toContain('Most chosen')
  })

  it('lets a price of zero through', () => {
    expect(mount(PricingCard, { props: { price: '0' } }).text()).toContain('0')
  })
})

describe('pricingTable', () => {
  it('renders a card per plan', () => {
    const wrapper = mount(PricingTable, { props: { plans } })
    expect(wrapper.findAllComponents(PricingCard)).toHaveLength(2)
    expect(wrapper.text()).toContain('Solo')
    expect(wrapper.text()).toContain('Studio')
  })

  it('takes its column count from the number of plans', () => {
    expect(mount(PricingTable, { props: { plans } }).attributes('class')).toContain('sm:grid-cols-2')
    expect(mount(PricingTable, { props: { plans, columns: 3 } }).attributes('class')).toContain('lg:grid-cols-3')
  })

  it('caps the columns at four so five plans wrap', () => {
    const many = Array.from({ length: 5 }, (_, index) => ({ name: `Plan ${index}` }))
    expect(mount(PricingTable, { props: { plans: many } }).attributes('class')).toContain('lg:grid-cols-4')
  })

  it('re-emits select with the plan that was chosen', async () => {
    const wrapper = mount(PricingTable, { props: { plans } })
    await wrapper.findAll('button')[1]?.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([plans[1]])
  })

  it('keeps the cards from stretching to the tallest', () => {
    expect(mount(PricingTable, { props: { plans } }).attributes('class')).toContain('items-start')
  })
})
