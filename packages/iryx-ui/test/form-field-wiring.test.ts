import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { Checkbox, Combobox, DateField, DatePicker, DateRangePicker, Editable, FileUpload, FormField, Input, NumberInput, PinInput, RadioGroup, Select, SignaturePad, Slider, Switch, TagsInput, Textarea, TimeField } from '../src'

function field(component: unknown, props: Record<string, unknown> = {}) {
  return mount(FormField, {
    props: { label: 'Field', name: 'f' },
    slots: { default: () => h(component as never, props) },
    attachTo: document.body,
  })
}

describe('controls inside a form field', () => {
  const takesId: [string, unknown, Record<string, unknown>][] = [
    ['Select', Select, { items: ['One'] }],
    ['Checkbox', Checkbox, {}],
    ['Switch', Switch, {}],
    ['PinInput', PinInput, {}],
  ]

  for (const [name, component, props] of takesId) {
    it(`${name} takes the id the label points at`, () => {
      const wrapper = field(component, props)
      const target = wrapper.find('label').attributes('for')

      expect(target).toBeTruthy()
      expect(wrapper.element.querySelector(`#${CSS.escape(target!)}`)).not.toBeNull()
    })
  }

  const invalidCases: [string, unknown, Record<string, unknown>][] = [
    ['Select', Select, { items: ['One'] }],
    ['Checkbox', Checkbox, {}],
    ['Switch', Switch, {}],
    ['RadioGroup', RadioGroup, { items: ['One'] }],
  ]

  for (const [name, component, props] of invalidCases) {
    it(`${name} reports the field's error state`, () => {
      const wrapper = mount(FormField, {
        props: { label: 'Field', name: 'f', error: 'Required' },
        slots: { default: () => h(component as never, props) },
        attachTo: document.body,
      })

      expect(wrapper.find('[aria-invalid="true"]').exists()).toBe(true)
    })

    it(`${name} takes an explicit invalid prop`, () => {
      const wrapper = mount(component as never, { props: { ...props, invalid: true } } as never)
      expect(wrapper.html()).toContain('aria-invalid="true"')
    })
  }

  const takesLabelledBy: [string, unknown, Record<string, unknown>][] = [
    ['RadioGroup', RadioGroup, { items: ['One'] }],
    ['Slider', Slider, {}],
  ]

  // A `for` cannot target a group, so these name themselves after the field's
  // own label element instead.
  for (const [name, component, props] of takesLabelledBy) {
    it(`${name} is named by the field label`, () => {
      const wrapper = field(component, props)
      const labelId = wrapper.find('label').attributes('id')
      const labelledBy = wrapper.find('[aria-labelledby]').attributes('aria-labelledby')

      expect(labelId).toBeTruthy()
      expect(labelledBy).toBe(labelId)
    })
  }

  const explicitId: [string, unknown, Record<string, unknown>][] = [
    ['Input', Input, {}],
    ['Textarea', Textarea, {}],
    ['NumberInput', NumberInput, {}],
    ['Select', Select, { items: ['One'] }],
    ['Combobox', Combobox, { items: ['One'] }],
    ['Checkbox', Checkbox, {}],
    ['Switch', Switch, {}],
    ['PinInput', PinInput, {}],
    ['DateField', DateField, {}],
    ['DatePicker', DatePicker, {}],
    ['DateRangePicker', DateRangePicker, {}],
    ['TimeField', TimeField, {}],
    ['Editable', Editable, {}],
    ['FileUpload', FileUpload, {}],
    ['TagsInput', TagsInput, {}],
    ['SignaturePad', SignaturePad, {}],
  ]

  // An explicit `id` on the control has to win, or the label points at nothing.
  for (const [name, component, props] of explicitId) {
    it(`${name} lets an explicit id win`, async () => {
      const wrapper = field(component, { ...props, id: 'explicit-id' })
      await nextTick()

      expect(wrapper.find('label').attributes('for')).toBe('explicit-id')
      expect(wrapper.element.querySelector('#explicit-id')).not.toBeNull()
    })
  }
})
