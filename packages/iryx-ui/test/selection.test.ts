import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { RadioGroup, Select } from '../src'

// Select portals its content to <body>, so clear it between tests.
afterEach(() => {
  document.body.innerHTML = ''
})

describe('select', () => {
  it('renders a trigger showing the placeholder when empty', () => {
    const wrapper = mount(Select, {
      props: { items: ['One', 'Two'], placeholder: 'Pick one' },
      attachTo: document.body,
    })
    expect(wrapper.text()).toContain('Pick one')
  })

  it('shows the selected label', async () => {
    const wrapper = mount(Select, {
      props: { items: ['One', 'Two'], modelValue: 'Two' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.text()).toContain('Two')
  })

  it('renders options when open, expanding string items', async () => {
    mount(Select, {
      props: {
        items: ['One', { label: 'Second', value: '2', disabled: true }],
        defaultOpen: true,
      },
      attachTo: document.body,
    })
    await nextTick()
    const options = [...document.querySelectorAll('[role="option"]')]
    expect(options.map(o => o.textContent?.trim())).toEqual(['One', 'Second'])
    expect(options[1]?.hasAttribute('data-disabled')).toBe(true)
  })
})

describe('radioGroup', () => {
  it('renders one radio per item with labels', () => {
    const wrapper = mount(RadioGroup, {
      props: { items: ['Small', 'Large'] },
      attachTo: document.body,
    })
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Small')
    expect(wrapper.text()).toContain('Large')
  })

  it('marks the selected item as checked', () => {
    const wrapper = mount(RadioGroup, {
      props: { items: ['a', 'b'], modelValue: 'b' },
      attachTo: document.body,
    })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[0]!.attributes('data-state')).toBe('unchecked')
    expect(radios[1]!.attributes('data-state')).toBe('checked')
  })

  it('emits update:modelValue when an item is clicked', async () => {
    const wrapper = mount(RadioGroup, {
      props: { items: ['a', 'b'] },
      attachTo: document.body,
    })
    await wrapper.findAll('[role="radio"]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('associates each label with its radio', () => {
    const wrapper = mount(RadioGroup, { props: { items: ['a'] }, attachTo: document.body })
    const radioId = wrapper.find('[role="radio"]').attributes('id')
    expect(wrapper.find('label').attributes('for')).toBe(radioId)
  })

  it('renders item descriptions and links them via aria-describedby', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        items: [
          { label: 'Free', value: 'free', description: 'Up to 3 projects.' },
          { label: 'Pro', value: 'pro' },
        ],
      },
      attachTo: document.body,
    })
    const radios = wrapper.findAll('[role="radio"]')
    const describedBy = radios[0]!.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.get(`#${describedBy}`).text()).toBe('Up to 3 projects.')
    // Items without a description get no dangling reference.
    expect(radios[1]!.attributes('aria-describedby')).toBeUndefined()
  })
})
