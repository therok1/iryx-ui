import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { Tabs, Tooltip } from '../src'
import { tabsTheme } from '../src/theme/tabs'

enableAutoUnmount(afterEach)

describe('tabs', () => {
  const items = ['Overview', 'Items', 'History']

  it('renders a tab per item and selects the first by default', () => {
    const wrapper = mount(Tabs, { props: { items } })
    const triggers = wrapper.findAll('[role="tab"]')
    expect(triggers).toHaveLength(3)
    expect(triggers[0]!.attributes('aria-selected')).toBe('true')
  })

  it('expands string items to label and value', () => {
    const wrapper = mount(Tabs, { props: { items } })
    expect(wrapper.findAll('[role="tab"]').map(t => t.text())).toEqual(items)
  })

  // Reka activates a tab on mousedown, not click.
  it('switches panels on press', async () => {
    const wrapper = mount(Tabs, {
      props: { items },
      slots: { Overview: 'First panel', Items: 'Second panel' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.text()).toContain('First panel')

    await wrapper.findAll('[role="tab"]')[1]!.trigger('mousedown')
    await nextTick()
    expect(wrapper.text()).toContain('Second panel')
    expect(wrapper.text()).not.toContain('First panel')
  })

  it('emits the selected value', async () => {
    const wrapper = mount(Tabs, { props: { items }, attachTo: document.body })
    await wrapper.findAll('[role="tab"]')[2]!.trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['History'])
  })

  it('honours an explicit value over the label', async () => {
    const wrapper = mount(Tabs, {
      props: { items: [{ label: 'Overview', value: 'overview' }, { label: 'Items', value: 'items' }] },
      attachTo: document.body,
    })
    await wrapper.findAll('[role="tab"]')[1]!.trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['items'])
  })

  it('does not select a disabled tab', async () => {
    const wrapper = mount(Tabs, {
      props: { items: ['One', { label: 'Two', disabled: true }] },
      attachTo: document.body,
    })
    const disabled = wrapper.findAll('[role="tab"]')[1]!
    expect(disabled.attributes('disabled')).toBeDefined()
    await disabled.trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  /* Panels holding form state should survive switching away. */
  it('keeps panels mounted when asked', async () => {
    const wrapper = mount(Tabs, {
      props: { items, keepMounted: true },
      slots: { Overview: 'First panel', Items: 'Second panel' },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.findAll('[role="tab"]')[1]!.trigger('mousedown')
    await nextTick()
    expect(wrapper.text()).toContain('First panel')
  })

  it('applies the line variant styling', () => {
    const wrapper = mount(Tabs, { props: { items, variant: 'line' } })
    expect(wrapper.get('[role="tablist"]').element.parentElement!.className).toContain('border-b')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Tabs, { props: { items, unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})

describe('tooltip', () => {
  it('renders the trigger and stays closed initially', () => {
    const wrapper = mount(Tooltip, {
      props: { text: 'Explains a thing' },
      slots: { trigger: '<button>Hover me</button>' },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('Hover me')
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
  })

  it('shows the content when opened', async () => {
    mount(Tooltip, {
      props: { text: 'Explains a thing', open: true },
      slots: { trigger: '<button>Hover me</button>' },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('Explains a thing')
  })

  it('renders an arrow only when asked', async () => {
    mount(Tooltip, {
      props: { text: 'Explains a thing', open: true, arrow: true },
      slots: { trigger: '<button>Hover me</button>' },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('svg')).not.toBeNull()
  })

  it('applies per-slot ui overrides to the content', async () => {
    mount(Tooltip, {
      props: { text: 'Explains a thing', open: true, ui: { content: 'max-w-sm' } },
      slots: { trigger: '<button>Hover me</button>' },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const content = [...document.body.querySelectorAll('*')]
      .find(el => el.className && String(el.className).includes('max-w-sm'))
    expect(content).toBeTruthy()
  })
})

describe('tabs overflow', () => {
  const many = ['Overview', 'Invoices', 'Payments', 'Customers', 'Products', 'Reports', 'Taxes', 'Settings']

  /** jsdom has no layout, so sizes are stubbed; `scrollLeft` stays writable. */
  function stub(el: Element, values: Record<string, number>) {
    for (const [key, value] of Object.entries(values))
      Object.defineProperty(el, key, { configurable: true, writable: true, value })
  }

  function layOut(wrapper: ReturnType<typeof mount>) {
    const list = wrapper.get('[role="tablist"]').element as HTMLElement
    stub(list, { clientWidth: 200, scrollWidth: 800, scrollLeft: 0 })
    wrapper.findAll('[role="tab"]').forEach((tab, index) =>
      stub(tab.element, { offsetLeft: index * 100, offsetWidth: 80 }),
    )
    return list
  }

  it('scrolls sideways with the scrollbar hidden', () => {
    const list = mount(Tabs, { props: { items: many } }).get('[role="tablist"]')
    expect(list.classes()).toContain('overflow-x-auto')
    expect(list.classes()).toContain('[scrollbar-width:none]')
  })

  it('scrolls vertically when vertical', () => {
    const list = mount(Tabs, { props: { items: many, orientation: 'vertical' } }).get('[role="tablist"]')
    expect(list.classes()).toContain('overflow-y-auto')
  })

  // Triggers would otherwise squeeze together instead of overflowing.
  it('keeps triggers from shrinking', () => {
    const wrapper = mount(Tabs, { props: { items: many } })
    expect(wrapper.get('[role="tab"]').classes()).toContain('shrink-0')
  })

  // An outer ring would be clipped by the scrolling list.
  it('insets the focus ring', () => {
    const wrapper = mount(Tabs, { props: { items: many } })
    expect(wrapper.get('[role="tab"]').classes()).toContain('focus-visible:ring-inset')
  })

  it('reports which edges have tabs past them', async () => {
    const wrapper = mount(Tabs, { props: { items: many }, attachTo: document.body })
    const list = layOut(wrapper)
    list.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(list.hasAttribute('data-overflowing')).toBe(true)
    expect(list.hasAttribute('data-at-start')).toBe(true)
    expect(list.hasAttribute('data-at-end')).toBe(false)
  })

  // The mask sits on the list; a background there would fade along with the tabs.
  it('keeps the background off the faded list', () => {
    const list = mount(Tabs, { props: { items: many } }).get('[role="tablist"]')
    expect(list.classes()).not.toContain('bg-muted')
    expect(list.element.parentElement!.className).toContain('bg-muted')
  })

  it('does not report overflow when everything fits', () => {
    const list = mount(Tabs, { props: { items: ['One', 'Two'] } }).get('[role="tablist"]')
    expect(list.attributes('data-overflowing')).toBeUndefined()
  })

  it('scrolls the selected tab fully into view, clear of the fade', async () => {
    const wrapper = mount(Tabs, { props: { items: many, modelValue: 'Overview' }, attachTo: document.body })
    const list = layOut(wrapper)

    // Taxes spans 600–680; a 200px view plus the 24px fade puts it at 504.
    await wrapper.setProps({ modelValue: 'Taxes' })
    await nextTick()
    await nextTick()
    expect(list.scrollLeft).toBe(504)

    // Back to the first tab: clamped to the start, never negative.
    await wrapper.setProps({ modelValue: 'Overview' })
    await nextTick()
    await nextTick()
    expect(list.scrollLeft).toBe(0)
  })

  it('leaves the scroll alone when the selected tab is already in view', async () => {
    const wrapper = mount(Tabs, { props: { items: many, modelValue: 'Overview' }, attachTo: document.body })
    const list = layOut(wrapper)
    list.scrollLeft = 50

    // Invoices spans 100–180, inside 50 + 24 … 250 - 24.
    await wrapper.setProps({ modelValue: 'Invoices' })
    await nextTick()
    await nextTick()
    expect(list.scrollLeft).toBe(50)
  })
})

describe('vertical tabs', () => {
  const items = ['Profile', 'Billing', 'Members']

  it('left-aligns the labels', () => {
    const wrapper = mount(Tabs, { props: { items, orientation: 'vertical' } })
    expect(wrapper.get('[role="tab"]').classes()).toContain('justify-start')
  })

  // The base `left-0` used to win, leaving the bar on the far side from the rule.
  // Checked on the theme: jsdom has no layout, so Reka never renders the indicator.
  it('puts the line indicator on the same edge as the rule', () => {
    const theme = tabsTheme({ variant: 'line', orientation: 'vertical' })
    const indicator = theme.indicator()
    expect(indicator).toContain('right-0')
    expect(indicator).toContain('left-auto')
    expect(indicator).not.toMatch(/(^|\s)left-0(\s|$)/)
    expect(theme.frame()).toContain('border-r')
  })

  it('stacks line tabs tightly, with room beside the indicator', () => {
    const wrapper = mount(Tabs, { props: { items, orientation: 'vertical', variant: 'line' } })
    expect(wrapper.get('[role="tablist"]').classes()).toContain('gap-0.5')
    expect(wrapper.get('[role="tablist"]').classes()).not.toContain('gap-4')
    expect(wrapper.get('[role="tab"]').classes()).toContain('px-3')
  })
})
