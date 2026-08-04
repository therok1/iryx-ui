import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { Tabs, Tooltip } from '../src'

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
    expect(wrapper.get('[role="tablist"]').attributes('class')).toContain('border-b')
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
