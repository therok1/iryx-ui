import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { Combobox, RadioGroup, Select } from '../src'

// Select and Combobox portal their content to <body>, so clear it between tests.
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

describe('combobox', () => {
  const clients = [
    { label: 'Acme Industries', value: 'acme' },
    { label: 'Bolt Logistics', value: 'bolt' },
    { label: 'Cirrus Systems', value: 'cirrus', disabled: true },
  ]

  it('shows the selected option label, not its value', async () => {
    const wrapper = mount(Combobox, {
      props: { items: clients, modelValue: 'acme' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.get('input').element.value).toBe('Acme Industries')
  })

  it('renders options when open, expanding string items', async () => {
    mount(Combobox, {
      props: { items: ['One', 'Two'], defaultOpen: true },
      attachTo: document.body,
    })
    await nextTick()
    const options = [...document.querySelectorAll('[role="option"]')]
    expect(options.map(o => o.textContent?.trim())).toEqual(['One', 'Two'])
  })

  it('marks disabled options as disabled', async () => {
    mount(Combobox, { props: { items: clients, defaultOpen: true }, attachTo: document.body })
    await nextTick()
    const options = [...document.querySelectorAll('[role="option"]')]
    expect(options[2]?.hasAttribute('data-disabled')).toBe(true)
  })

  it('filters options down to the typed query', async () => {
    const wrapper = mount(Combobox, {
      props: { items: clients, defaultOpen: true },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.get('input').setValue('bo')
    await nextTick()

    const visible = [...document.querySelectorAll('[role="option"]')]
      .filter(o => !o.hasAttribute('hidden') && o.getAttribute('data-state') !== 'hidden')
    expect(visible.map(o => o.textContent?.trim())).toEqual(['Bolt Logistics'])
  })

  it('emits update:modelValue when an option is chosen', async () => {
    const wrapper = mount(Combobox, {
      props: { items: clients, defaultOpen: true },
      attachTo: document.body,
    })
    await nextTick()
    const option = document.querySelectorAll('[role="option"]')[1] as HTMLElement
    option.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bolt'])
  })

  it('emits create with the query instead of selecting it', async () => {
    const wrapper = mount(Combobox, {
      props: { items: clients, defaultOpen: true, create: true },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.get('input').setValue('  Delta  ')
    await nextTick()

    const createRow = document.querySelector('[data-create]') as HTMLElement
    expect(createRow.textContent?.trim()).toBe('Create "Delta"')

    createRow.click()
    await nextTick()
    expect(wrapper.emitted('create')?.[0]).toEqual(['Delta'])
    // The query isn't a real value, so nothing may be selected from it.
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('keeps the create row as the query grows', async () => {
    // Reka registers an item's filter text on mount, so a create row mounted
    // at "D" filters itself out once the query is "Delta" unless it remounts.
    const wrapper = mount(Combobox, {
      props: { items: clients, defaultOpen: true, create: true },
      attachTo: document.body,
    })
    await nextTick()
    for (const query of ['D', 'De', 'Delta']) {
      await wrapper.get('input').setValue(query)
      await nextTick()
      expect(document.querySelector('[data-create]')?.textContent?.trim()).toBe(`Create "${query}"`)
    }
  })

  it('offers no create row when an option already has that label', async () => {
    const wrapper = mount(Combobox, {
      props: { items: clients, defaultOpen: true, create: true },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.get('input').setValue('acme industries')
    await nextTick()
    expect(document.querySelector('[data-create]')).toBeNull()
  })

  it('renders overridable empty text rather than a baked-in English string', async () => {
    const wrapper = mount(Combobox, {
      props: { items: clients, defaultOpen: true, emptyText: 'Nothing matched.' },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.get('input').setValue('zzz')
    await nextTick()
    expect(document.body.textContent).toContain('Nothing matched.')
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
