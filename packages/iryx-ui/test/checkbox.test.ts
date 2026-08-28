import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Checkbox } from '../src'

/**
 * Reka's `CheckboxRoot` renders the hidden form input as a sibling of the
 * button (reka-ui 2.10, to fix a `nested-interactive` violation), so the
 * component has two root nodes and `wrapper.element` is the fragment, not the
 * box. Every assertion has to go through the control itself.
 */
function control(wrapper: VueWrapper<any>) {
  return wrapper.get('[role="checkbox"]')
}

describe('checkbox', () => {
  it('renders unchecked by default', () => {
    const box = control(mount(Checkbox))
    expect(box.attributes('role')).toBe('checkbox')
    expect(box.attributes('data-state')).toBe('unchecked')
  })

  it('rings on keyboard focus', () => {
    const classes = control(mount(Checkbox)).attributes('class') ?? ''
    expect(classes).toContain('focus-visible:ring-2')
    expect(classes).toContain('focus-visible:ring-primary/50')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    await control(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('reflects modelValue changes from the parent', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    expect(control(wrapper).attributes('data-state')).toBe('checked')
  })

  it('renders the indeterminate state', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: 'indeterminate' } })
    expect(control(wrapper).attributes('data-state')).toBe('indeterminate')
  })

  it('applies size overrides', () => {
    const wrapper = mount(Checkbox, { props: { size: 'lg' } })
    expect(control(wrapper).classes()).toContain('size-5')
  })

  it('stays bare when no label or description is given', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.find('[role="checkbox"]').exists()).toBe(true)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders a label wired to the control', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Accept terms' } })
    const label = wrapper.get('label')
    expect(label.text()).toBe('Accept terms')
    expect(label.attributes('for')).toBe(control(wrapper).attributes('id'))
  })

  it('renders a description and links it via aria-describedby', () => {
    const wrapper = mount(Checkbox, {
      props: { label: 'Emails', description: 'We only send receipts.' },
    })
    const describedBy = control(wrapper).attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.get(`#${describedBy}`).text()).toBe('We only send receipts.')
  })

  it('supports a description without a label', () => {
    const wrapper = mount(Checkbox, { props: { description: 'Standalone note' } })
    expect(wrapper.text()).toContain('Standalone note')
  })

  /*
   * A two-root component cannot auto-inherit attributes, so `inheritAttrs` is
   * off and `$attrs` is bound to the box by hand. Without that, these are
   * dropped with a warning — and in the labelled layout they used to land on
   * the wrapper div rather than the control.
   */
  it.each([['bare', undefined], ['labelled', 'Accept terms']])(
    'passes plain attributes through to the control (%s)',
    (_name, label) => {
      const wrapper = mount(Checkbox, {
        props: { label },
        attrs: { 'data-testid': 'box' },
      })
      expect(control(wrapper).attributes('data-testid')).toBe('box')
    },
  )
})
