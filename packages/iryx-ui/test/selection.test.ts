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

  it('renders grouped items under their labels', async () => {
    mount(Select, {
      props: {
        defaultOpen: true,
        items: [
          { label: 'Frameworks', items: ['Vue', 'React'] },
          { label: 'Compilers', items: [{ label: 'Svelte', value: 'svelte' }] },
        ],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.querySelectorAll('[role="group"]')).toHaveLength(2)
    expect(document.body.textContent).toContain('Frameworks')
    expect(document.body.textContent).toContain('Compilers')
    expect([...document.querySelectorAll('[role="option"]')].map(o => o.textContent?.trim()))
      .toEqual(['Vue', 'React', 'Svelte'])
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

  /*
   * Opening and closing is deliberately untested here. Reka drives it from
   * pointer events and a dismissable layer that happy-dom's synthetic clicks
   * don't reproduce — both the trigger's toggle and the create row's dismissal
   * work in a browser and fail here for environment reasons only. The one
   * thing worth writing down: `open` must stay Reka's, since controlling it
   * lets an outside click and the trigger's toggle read the same stale prop
   * and reopen the popup with the field unfocused.
   */

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

  it('renders grouped items under their labels', async () => {
    mount(Combobox, {
      props: {
        defaultOpen: true,
        items: [
          { label: 'Recent', items: ['Acme Industries'] },
          { label: 'Archived', items: [{ label: 'Old Co', value: 'old' }] },
        ],
      },
      attachTo: document.body,
    })
    await nextTick()
    expect([...document.querySelectorAll('[role="group"]')]).toHaveLength(2)
    expect(document.body.textContent).toContain('Recent')
    expect(document.body.textContent).toContain('Archived')
    expect([...document.querySelectorAll('[role="option"]')].map(o => o.textContent?.trim()))
      .toEqual(['Acme Industries', 'Old Co'])
  })

  it('spaces groups off the previous visible one, not off :first-child', async () => {
    // Filtered-out groups stay in the DOM with `hidden`, so a `not-first:`
    // margin indented whichever group survived at the top of the list.
    mount(Combobox, {
      props: { defaultOpen: true, items: [{ label: 'Recent', items: ['Acme Industries'] }] },
      attachTo: document.body,
    })
    await nextTick()
    const group = document.querySelector('[role="group"]')!
    expect(group.className).toContain('[[role=group]:not([hidden])~&]:mt-1')
    expect(group.className).not.toContain('not-first:mt-1')
  })

  it('hides a group once nothing in it matches', async () => {
    const wrapper = mount(Combobox, {
      props: {
        defaultOpen: true,
        items: [
          { label: 'Recent', items: ['Acme Industries'] },
          { label: 'Archived', items: ['Old Co'] },
        ],
      },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.get('input').setValue('acme')
    await nextTick()

    const groups = [...document.querySelectorAll('[role="group"]')]
    expect(groups[0]?.hasAttribute('hidden')).toBe(false)
    expect(groups[1]?.hasAttribute('hidden')).toBe(true)
  })

  /*
   * The virtualizer needs real layout to decide which rows are on screen, and
   * happy-dom reports every element as 0px tall, so no row is ever "in view"
   * here. What these assert instead is the part this component owns: the list
   * the virtualizer is given. Its spacer is sized `count * estimateSize`, so
   * that height is a faithful read of how many options got through the filter.
   * Actual windowing is verified in the playground.
   */
  function spacerHeight(): number {
    const spacer = document.querySelector('[data-reka-virtualizer]') as HTMLElement | null
    return Number.parseInt(spacer?.style.height ?? '0', 10)
  }

  it('hands the whole list to the virtualizer when unfiltered', async () => {
    const many = Array.from({ length: 2000 }, (_, i) => ({ label: `Client ${i}`, value: `c${i}` }))
    mount(Combobox, {
      props: { items: many, defaultOpen: true, virtual: true, estimateSize: 32 },
      attachTo: document.body,
    })
    await nextTick()
    expect(spacerHeight()).toBe(2000 * 32)
  })

  it('filters itself when virtual, since Reka stops filtering', async () => {
    // ComboboxVirtualizer sets isVirtual, which short-circuits the root's
    // filter state — the component has to do the matching itself.
    const wrapper = mount(Combobox, {
      props: {
        items: ['Acme Industries', 'Bolt Logistics', 'Cirrus Systems'],
        defaultOpen: true,
        virtual: true,
        estimateSize: 32,
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(spacerHeight()).toBe(3 * 32)

    await wrapper.get('input').setValue('bolt')
    await nextTick()
    expect(spacerHeight()).toBe(1 * 32)
  })

  it('matches case- and accent-insensitively when virtual, as Reka does', async () => {
    const wrapper = mount(Combobox, {
      props: { items: ['Zürich', 'Genève'], defaultOpen: true, virtual: true, estimateSize: 32 },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.get('input').setValue('zurich')
    await nextTick()
    expect(spacerHeight()).toBe(1 * 32)
  })

  it('shows the empty text when a virtual list matches nothing', async () => {
    const wrapper = mount(Combobox, {
      props: { items: ['Acme Industries'], defaultOpen: true, virtual: true },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.get('input').setValue('zzz')
    await nextTick()
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(0)
    expect(document.body.textContent).toContain('No results found.')
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

  /*
   * `orientation` reaches Reka's roving focus on its own, so the arrow keys
   * followed it while the layout stayed a single column — the prop looked
   * implemented and was only half-wired. The layout has to move with it.
   */
  it('lays the options out along the orientation', () => {
    const vertical = mount(RadioGroup, { props: { items: ['a', 'b'] } })
    expect(vertical.attributes('class')).toContain('grid')
    expect(vertical.attributes('class')).not.toContain('flex-wrap')

    const horizontal = mount(RadioGroup, { props: { items: ['a', 'b'], orientation: 'horizontal' } })
    expect(horizontal.attributes('class')).toContain('flex-wrap')
    expect(horizontal.attributes('class')).not.toContain('grid')

    // Reka still needs it for the keyboard, so it must survive on the root.
    expect(horizontal.attributes('aria-orientation')).toBe('horizontal')
  })

  // Same reasoning as the checkbox and switch: clicking a radio should ring it.
  it('rings on focus, however focus arrived', () => {
    const classes = mount(RadioGroup, { props: { items: ['a'] } })
      .get('[role="radio"]')
      .attributes('class') ?? ''
    expect(classes).toContain('focus:ring-2')
    expect(classes).not.toContain('focus-visible:ring')
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
