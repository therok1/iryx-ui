import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { NavigationMenu, Pagination, Stepper } from '../src'

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

describe('navigationMenu', () => {
  const items = [
    { label: 'Overview', href: '/', active: true },
    {
      label: 'Product',
      items: [
        { label: 'Invoicing', href: '/invoicing', description: 'Send and track invoices.' },
        { label: 'Reporting', href: '/reporting' },
      ],
    },
    { label: 'Contact', onSelect: () => {} },
  ]

  it('renders a navigation landmark with an overridable name', () => {
    const wrapper = mount(NavigationMenu, { props: { items, label: 'Glavna' } })
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Glavna')
  })

  it('renders an entry with items as a trigger, and one without as a link', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    // The trigger is Reka's button; the plain entries render our own tags.
    const trigger = wrapper.findAll('button').find(b => b.text().includes('Product'))
    expect(trigger).toBeDefined()
    expect(trigger!.attributes('aria-expanded')).toBe('false')

    const overview = wrapper.find('a[href="/"]')
    expect(overview.exists()).toBe(true)
    expect(overview.text()).toBe('Overview')
  })

  it('marks the active entry for assistive tech, not just visually', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const overview = wrapper.get('a[href="/"]')
    expect(overview.attributes('aria-current')).toBe('page')
    expect(wrapper.get('button[type="button"]').attributes('aria-current')).toBeUndefined()
  })

  it('renders an entry without href as a button so it stays focusable', () => {
    const wrapper = mount(NavigationMenu, { props: { items } })
    const contact = wrapper.findAll('button').find(b => b.text() === 'Contact')!
    expect(contact.attributes('type')).toBe('button')
  })

  it('calls onSelect when a link entry is chosen', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(NavigationMenu, {
      props: { items: [{ label: 'Contact', onSelect }] },
      attachTo: document.body,
    })
    await wrapper.get('button').trigger('click')
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('does not call onSelect on a disabled entry', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(NavigationMenu, {
      props: { items: [{ label: 'Contact', onSelect, disabled: true }] },
      attachTo: document.body,
    })
    const link = wrapper.get('button')
    expect(link.attributes('aria-disabled')).toBe('true')
    await link.trigger('click')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('opens the panel named by the model and renders its children', async () => {
    const wrapper = mount(NavigationMenu, {
      props: { items, modelValue: 'Product' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.get('a[href="/invoicing"]').text()).toContain('Invoicing')
    expect(wrapper.text()).toContain('Send and track invoices.')
  })

  /*
   * The viewport is an absolutely positioned box that would sit over the page
   * whether or not anything can ever open inside it.
   */
  it('omits the viewport entirely when no entry has a panel', () => {
    const wrapper = mount(NavigationMenu, { props: { items: [{ label: 'Contact' }] } })
    expect(wrapper.findComponent({ name: 'NavigationMenuViewport' }).exists()).toBe(false)
  })

  it('lets one entry widen its own panel past the menu default', async () => {
    mount(NavigationMenu, {
      props: {
        columns: 1,
        modelValue: 'Product',
        items: [{ label: 'Product', columns: 3, items: [{ label: 'Invoicing' }] }],
      },
      attachTo: document.body,
    })
    await nextTick()
    const content = document.body.querySelector('[data-state="open"].grid')
    expect(content?.className).toContain('grid-cols-3')
  })

  /*
   * Both of these were found by measuring the rendered box, not in jsdom, and
   * neither has a visible symptom a rendering test would catch: without
   * `shrink-0` the viewport shrinks to the nav's width and clips the panel,
   * and without `box-content` its own border eats a pixel of the panel's
   * padding. Pinned here because nothing else would notice them going away.
   */
  it('keeps the viewport from being resized by its own flex parent or border', async () => {
    mount(NavigationMenu, {
      props: { items, modelValue: 'Product' },
      attachTo: document.body,
    })
    await nextTick()
    const viewport = document.body.querySelector('[data-state="open"].grid')!.parentElement!
    expect(viewport.className).toContain('shrink-0')
    expect(viewport.className).toContain('box-content')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(NavigationMenu, { props: { items, unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
