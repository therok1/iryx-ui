import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { DateField } from '../src'

function segments(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[role="spinbutton"]')
}

describe('dateField', () => {
  it('renders one segment per part', () => {
    const wrapper = mount(DateField, { props: { modelValue: '2026-08-15' } })
    expect(segments(wrapper)).toHaveLength(3)
  })

  it('shows the model in its segments', () => {
    const wrapper = mount(DateField, { props: { modelValue: '2026-08-15', locale: 'en-GB' } })
    expect(wrapper.text()).toContain('15')
    expect(wrapper.text()).toContain('08')
    expect(wrapper.text()).toContain('2026')
  })

  /** Day-first or month-first is the locale's call, not the caller's. */
  it('orders the segments by locale', () => {
    const order = (locale: string) =>
      segments(mount(DateField, { props: { modelValue: '2026-08-15', locale } }))
        .map(node => node.attributes('data-reka-date-field-segment'))

    expect(order('en-GB')[0]).toBe('day')
    expect(order('en-US')[0]).toBe('month')
  })

  it('renders the separator as text, not another stop', () => {
    const wrapper = mount(DateField, { props: { modelValue: '2026-08-15', locale: 'en-GB' } })
    const literal = wrapper.findAll('span').find(node => node.text() === '/')
    expect(literal?.attributes('role')).toBeUndefined()
  })

  it('emits an ISO string, not a Date', async () => {
    const wrapper = mount(DateField, { props: { modelValue: '2026-08-15', locale: 'en-GB' } })
    const year = segments(wrapper).find(
      node => node.attributes('data-reka-date-field-segment') === 'year',
    )!
    await year.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2027-08-15'])
  })

  /** Malformed input means "no selection" rather than a thrown render. */
  it('renders a placeholder for an absent or malformed model', () => {
    expect(() => mount(DateField, { props: { modelValue: null } })).not.toThrow()
    const wrapper = mount(DateField, { props: { modelValue: 'the fifteenth' } })
    expect(segments(wrapper)).toHaveLength(3)
    expect(wrapper.text()).not.toContain('15')
  })

  it('carries the field chrome and its sizes', () => {
    const wrapper = mount(DateField, { props: { modelValue: '2026-08-15', size: 'lg' } })
    expect(wrapper.classes().join(' ')).toContain('h-10')
  })

  it('marks itself invalid for assistive tech', () => {
    const wrapper = mount(DateField, { props: { modelValue: '2026-08-15', invalid: true } })
    expect(wrapper.attributes('aria-invalid')).toBe('true')
    expect(wrapper.classes().join(' ')).toContain('border-red-500')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(DateField, { props: { modelValue: '2026-08-15', unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
  })
})

/*
 * Reka computes this and exposes `data-invalid`, but stops there: nothing
 * sets `aria-invalid`, so an out-of-range date was accepted in silence.
 */
describe('dateField bounds', () => {
  const bounded = { minValue: '2026-09-01', maxValue: '2026-10-31', locale: 'en-GB' }

  it('marks a value before the minimum invalid', () => {
    const wrapper = mount(DateField, { props: { ...bounded, modelValue: '2016-01-01' } })
    expect(wrapper.attributes('aria-invalid')).toBe('true')
    expect(wrapper.classes().join(' ')).toContain('border-red-500')
  })

  it('marks a value after the maximum invalid', () => {
    const wrapper = mount(DateField, { props: { ...bounded, modelValue: '2027-01-01' } })
    expect(wrapper.attributes('aria-invalid')).toBe('true')
  })

  it('leaves a value inside the bounds alone', () => {
    const wrapper = mount(DateField, { props: { ...bounded, modelValue: '2026-09-15' } })
    expect(wrapper.attributes('aria-invalid')).toBeUndefined()
  })

  it('marks a refused date invalid', () => {
    const wrapper = mount(DateField, {
      props: { ...bounded, modelValue: '2026-09-05', isUnavailable: (date: string) => date === '2026-09-05' },
    })
    expect(wrapper.attributes('aria-invalid')).toBe('true')
  })

  /** Being out of bounds is a fact about the value, not a presentation choice. */
  it('cannot be suppressed with invalid: false', () => {
    const wrapper = mount(DateField, { props: { ...bounded, modelValue: '2016-01-01', invalid: false } })
    expect(wrapper.attributes('aria-invalid')).toBe('true')
  })

  it('says nothing about a malformed value, which is not a date at all', () => {
    const wrapper = mount(DateField, { props: { ...bounded, modelValue: 'the fifteenth' } })
    expect(wrapper.attributes('aria-invalid')).toBeUndefined()
  })
})
