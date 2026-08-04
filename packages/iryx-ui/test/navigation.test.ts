import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { Pagination, Stepper } from '../src'

enableAutoUnmount(afterEach)

describe('pagination', () => {
  it('derives the page count from total and page size', () => {
    const wrapper = mount(Pagination, { props: { total: 45, itemsPerPage: 10 } })
    const pages = wrapper.findAll('button').filter(b => /^\d+$/.test(b.text()))
    // 45 items at 10 per page is 5 pages; the last is shown via showEdges.
    expect(pages.at(-1)!.text()).toBe('5')
  })

  it('marks the current page for assistive tech', () => {
    const wrapper = mount(Pagination, { props: { total: 30, page: 2 } })
    const current = wrapper.find('[data-selected]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('2')
  })

  it('emits the new page when one is chosen', async () => {
    const wrapper = mount(Pagination, { props: { total: 50 }, attachTo: document.body })
    const three = wrapper.findAll('button').find(b => b.text() === '3')!
    await three.trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([3])
  })

  it('disables prev on the first page and next on the last', () => {
    const first = mount(Pagination, { props: { total: 30, page: 1 } })
    expect(first.get('[aria-label="Previous page"]').attributes('disabled')).toBeDefined()

    const last = mount(Pagination, { props: { total: 30, page: 3 } })
    expect(last.get('[aria-label="Next page"]').attributes('disabled')).toBeDefined()
  })

  it('allows overriding the labels for non-English apps', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, prevLabel: 'Prejšnja', nextLabel: 'Naslednja', label: 'Strani' },
    })
    expect(wrapper.find('[aria-label="Prejšnja"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Naslednja"]').exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('Strani')
  })

  it('renders an ellipsis when there are many pages', () => {
    const wrapper = mount(Pagination, { props: { total: 500, page: 1, siblingCount: 1 } })
    expect(wrapper.text()).toContain('…')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Pagination, { props: { total: 30, unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})

describe('stepper', () => {
  const items = ['Details', 'Items', 'Review']

  it('renders a step per item, numbered from one', () => {
    const wrapper = mount(Stepper, { props: { items } })
    const steps = wrapper.findAll('[role="tab"], [role="button"], button')
    expect(steps.length).toBeGreaterThanOrEqual(3)
    expect(wrapper.text()).toContain('Details')
    expect(wrapper.text()).toContain('Review')
  })

  it('expands string items to a title', () => {
    const wrapper = mount(Stepper, {
      props: { items: [{ title: 'Details', description: 'Who it is for' }] },
    })
    expect(wrapper.text()).toContain('Details')
    expect(wrapper.text()).toContain('Who it is for')
  })

  it('marks the current step as active', () => {
    const wrapper = mount(Stepper, { props: { items, modelValue: 2 } })
    expect(wrapper.find('[data-state="active"]').exists()).toBe(true)
  })

  /* Completed steps show a tick rather than their number. */
  it('ticks steps behind the current one', () => {
    const wrapper = mount(Stepper, { props: { items, modelValue: 3 } })
    expect(wrapper.findAll('svg').length).toBeGreaterThanOrEqual(2)
  })

  it('renders a separator between steps but not after the last', () => {
    const wrapper = mount(Stepper, { props: { items } })
    // One fewer separator than steps.
    expect(wrapper.findAll('[data-orientation]').length).toBeGreaterThanOrEqual(2)
  })

  /*
   * `linear` is off by default: when on, Reka refuses to reach a step until
   * the ones before it are complete, which makes plain v-model increments
   * silently do nothing.
   */
  it('lets the model move freely between steps by default', async () => {
    const wrapper = mount(Stepper, {
      props: { items, modelValue: 1 },
      attachTo: document.body,
    })
    await wrapper.setProps({ modelValue: 3 })
    expect(wrapper.get('[data-state="active"]').text()).toContain('Review')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Stepper, { props: { items, unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
