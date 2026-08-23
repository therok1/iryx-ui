import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { Accordion } from '../src'

const items = [
  { label: 'What are payment terms?', content: 'When the money is due.' },
  { label: 'Can I change a sent invoice?', content: 'Only by issuing a credit note.' },
  { label: 'Archived', content: 'Nothing here.', disabled: true },
]

describe('accordion', () => {
  it('renders a trigger per item', () => {
    const wrapper = mount(Accordion, { props: { items } })
    expect(wrapper.findAll('button')).toHaveLength(3)
    expect(wrapper.text()).toContain('What are payment terms?')
  })

  it('opens a panel on click', async () => {
    const wrapper = mount(Accordion, { props: { items } })
    await wrapper.findAll('button')[0]!.trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['What are payment terms?'])
  })

  it('keeps one panel open in single mode', async () => {
    const wrapper = mount(Accordion, { props: { items, modelValue: 'What are payment terms?' } })
    await wrapper.findAll('button')[1]!.trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Can I change a sent invoice?'])
  })

  it('collects open panels in multiple mode', async () => {
    const wrapper = mount(Accordion, {
      props: { items, type: 'multiple', modelValue: ['What are payment terms?'] },
    })
    await wrapper.findAll('button')[1]!.trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
      'What are payment terms?',
      'Can I change a sent invoice?',
    ])
  })

  it('closes the open panel when collapsible', async () => {
    const wrapper = mount(Accordion, {
      props: { items, collapsible: true, modelValue: 'What are payment terms?' },
    })
    await wrapper.findAll('button')[0]!.trigger('click')
    await nextTick()
    // Reka clears a single accordion to `undefined`, not an empty string.
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
  })

  it('never opens a disabled item', async () => {
    const wrapper = mount(Accordion, { props: { items } })
    await wrapper.findAll('button')[2]!.trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('falls back to the label as the value', () => {
    const wrapper = mount(Accordion, { props: { items: [{ label: 'Only' }] } })
    expect(wrapper.html()).toContain('Only')
  })

  it('uses an explicit value when given', async () => {
    const wrapper = mount(Accordion, { props: { items: [{ label: 'Terms', value: 'terms' }] } })
    await wrapper.get('button').trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['terms'])
  })

  /*
   * The animated element must carry no spacing: margin is not part of an
   * animated height, so it survives the close as a gap under a shut panel.
   * Same rule the sidebar submenu is built on.
   */
  it('keeps padding off the animated element', () => {
    const wrapper = mount(Accordion, { props: { items } })
    const content = wrapper.find('[data-state]').element.parentElement
    const animated = wrapper.findAll('.overflow-hidden')[0]!
    expect(animated.classes().some(c => /^(?:p|m)[trblxy]?-/.test(c))).toBe(false)
    expect(content).toBeTruthy()
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Accordion, { props: { items, unstyled: true, class: 'mine' } })
    expect(wrapper.classes()).toEqual(['mine'])
  })
})
