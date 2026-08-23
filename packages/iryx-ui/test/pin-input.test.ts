import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { PinInput } from '../src'

/**
 * Reka appends a hidden input carrying the whole value for form submission,
 * so a bare `input` selector counts one cell too many.
 */
function cells(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('input:not([aria-hidden])')
}

function cell(wrapper: ReturnType<typeof mount>, index = 0) {
  const found = cells(wrapper)[index]
  if (!found)
    throw new Error(`no cell at index ${index}`)
  return found
}

describe('pinInput', () => {
  it('renders six cells by default', () => {
    expect(cells(mount(PinInput))).toHaveLength(6)
  })

  it('takes a length', () => {
    expect(cells(mount(PinInput, { props: { length: 4 } }))).toHaveLength(4)
  })

  /*
   * The whole point of the string model: a PIN is a string in the request
   * body, the validator and the email it arrived in, so Reka's array of single
   * characters stays an internal detail.
   */
  it('spreads a string model across the cells', () => {
    const wrapper = mount(PinInput, { props: { modelValue: '1234', length: 4 } })
    expect(cells(wrapper).map(c => (c.element as HTMLInputElement).value)).toEqual(['1', '2', '3', '4'])
  })

  it('emits a string, not an array', async () => {
    const wrapper = mount(PinInput, { props: { modelValue: '', length: 4 } })
    await cell(wrapper).setValue('7')
    const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0]
    expect(emitted).toBe('7')
    expect(Array.isArray(emitted)).toBe(false)
  })

  it('emits complete as a string once every cell is filled', async () => {
    const wrapper = mount(PinInput, { props: { modelValue: '123', length: 4 } })
    await cell(wrapper, 3).setValue('4')
    expect(wrapper.emitted('complete')?.[0]).toEqual(['1234'])
  })

  it('leaves complete alone while cells are empty', async () => {
    const wrapper = mount(PinInput, { props: { modelValue: '', length: 4 } })
    await cell(wrapper).setValue('1')
    expect(wrapper.emitted('complete')).toBeUndefined()
  })

  it('masks the entry when asked', () => {
    const wrapper = mount(PinInput, { props: { mask: true, modelValue: '12' } })
    expect(cell(wrapper).attributes('type')).toBe('password')
  })

  it('offers the code to autofill when otp is set', () => {
    const wrapper = mount(PinInput, { props: { otp: true } })
    expect(cell(wrapper).attributes('autocomplete')).toBe('one-time-code')
  })

  it('places a separator between groups but never after the last cell', () => {
    const wrapper = mount(PinInput, { props: { length: 6, groupSize: 3 } })
    const separators = wrapper.findAll('span[aria-hidden="true"]')
    expect(separators).toHaveLength(1)
    expect(separators[0]?.text()).toBe('–')
  })

  it('takes a custom separator character', () => {
    const wrapper = mount(PinInput, { props: { length: 4, groupSize: 2, separator: '/' } })
    expect(wrapper.find('span[aria-hidden="true"]').text()).toBe('/')
  })

  it('renders no separators without a group size', () => {
    expect(mount(PinInput, { props: { length: 6 } }).findAll('span[aria-hidden="true"]')).toHaveLength(0)
  })

  // A group size that divides evenly would otherwise trail a dash off the end.
  it('does not separate when the group size matches the length', () => {
    const wrapper = mount(PinInput, { props: { length: 4, groupSize: 4 } })
    expect(wrapper.findAll('span[aria-hidden="true"]')).toHaveLength(0)
  })

  /*
   * Reka counts the cells from a Set filled on mount, so the name reads
   * "of 0" on the very first render and only settles a tick later.
   */
  it('names each cell by its position once the cells have registered', async () => {
    const wrapper = mount(PinInput, { props: { length: 4 } })
    await nextTick()
    expect(cell(wrapper).attributes('aria-label')).toBe('pin input 1 of 4')
    expect(cell(wrapper, 3).attributes('aria-label')).toBe('pin input 4 of 4')
  })

  it('marks every cell invalid', () => {
    const wrapper = mount(PinInput, { props: { invalid: true, length: 3 } })
    expect(cells(wrapper).every(c => c.attributes('aria-invalid') === 'true')).toBe(true)
    expect(cell(wrapper).classes()).toContain('border-red-500')
  })

  it('disables every cell', () => {
    const wrapper = mount(PinInput, { props: { disabled: true, length: 3 } })
    expect(cells(wrapper).every(c => c.attributes('disabled') !== undefined)).toBe(true)
  })

  it('sizes the cells', () => {
    expect(cell(mount(PinInput, { props: { size: 'sm' } })).classes()).toContain('size-8')
    expect(cell(mount(PinInput, { props: { size: 'lg' } })).classes()).toContain('size-12')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(PinInput, { props: { ui: { input: 'size-16' } } })
    expect(cell(wrapper).classes()).toContain('size-16')
    expect(cell(wrapper).classes()).not.toContain('size-10')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(PinInput, { props: { unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
    expect(cell(wrapper).classes()).toHaveLength(0)
  })
})
