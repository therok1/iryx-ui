import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { Editable } from '../src'

function mountEditable(props: Record<string, unknown> = {}) {
  return mount(Editable, {
    props: { modelValue: 'Q3 revenue report', ...props },
    attachTo: document.body,
  })
}

describe('editable', () => {
  it('reads as text until it is edited', () => {
    const wrapper = mountEditable()
    expect(wrapper.text()).toContain('Q3 revenue report')
    expect(wrapper.get('input').isVisible()).toBe(false)
  })

  it('shows the placeholder when there is nothing to read', () => {
    const wrapper = mountEditable({ modelValue: '', placeholder: 'Untitled' })
    expect(wrapper.text()).toContain('Untitled')
  })

  it('swaps the preview for the input on edit', async () => {
    const wrapper = mountEditable({ startWithEditMode: true })
    await nextTick()
    expect(wrapper.get('input').isVisible()).toBe(true)
  })

  it('emits the new value on submit', async () => {
    const wrapper = mountEditable({ startWithEditMode: true, submitMode: 'enter' })
    await nextTick()
    const input = wrapper.get('input')
    await input.setValue('Q4 revenue report')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Q4 revenue report'])
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('leaves the value alone on cancel', async () => {
    const wrapper = mountEditable({ startWithEditMode: true })
    await nextTick()
    const input = wrapper.get('input')
    await input.setValue('Something else')
    await input.trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.text()).toContain('Q3 revenue report')
  })

  /**
   * One set at a time: an edit button while reading, save and cancel while
   * editing. All three at once leaves two of them inert.
   */
  it('shows only the controls that apply', async () => {
    const reading = mountEditable({ controls: true })
    expect(reading.findAll('button')).toHaveLength(1)

    const editing = mountEditable({ controls: true, startWithEditMode: true })
    await nextTick()
    expect(editing.findAll('button')).toHaveLength(2)
  })

  it('has no controls unless asked', () => {
    expect(mountEditable().findAll('button')).toHaveLength(0)
  })

  it('takes a preview slot for the value', () => {
    const wrapper = mount(Editable, {
      props: { modelValue: 'Q3 revenue report' },
      slots: { preview: '<strong>{{ params.value }}</strong>' },
      attachTo: document.body,
    })
    expect(wrapper.get('strong').text()).toBe('Q3 revenue report')
  })

  it('marks itself invalid for assistive tech', () => {
    const wrapper = mountEditable({ invalid: true })
    expect(wrapper.attributes('aria-invalid')).toBe('true')
  })

  it('drops every built-in class when unstyled', () => {
    expect(mountEditable({ unstyled: true }).classes()).toHaveLength(0)
  })
})
