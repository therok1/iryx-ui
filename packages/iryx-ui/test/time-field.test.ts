import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { TimeField, toIsoTime, toTime } from '../src'

function segments(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[role="spinbutton"]')
}

describe('time helpers', () => {
  it('parses HH:mm and HH:mm:ss', () => {
    expect(toTime('09:30')).toMatchObject({ hour: 9, minute: 30, second: 0 })
    expect(toTime('09:30:15')).toMatchObject({ hour: 9, minute: 30, second: 15 })
  })

  /*
   * Malformed input means "no selection" rather than a thrown render — the
   * value often arrives from a URL or a stale draft.
   */
  it('treats malformed input as no selection', () => {
    expect(toTime('25:00')).toBeUndefined()
    expect(toTime('9:30')).toBeUndefined()
    expect(toTime('half past nine')).toBeUndefined()
    expect(toTime('')).toBeUndefined()
    expect(toTime(null)).toBeUndefined()
  })

  // Padded so the result sorts and compares as a string.
  it('pads on the way back out', () => {
    expect(toIsoTime({ hour: 9, minute: 5 })).toBe('09:05')
    expect(toIsoTime({ hour: 9, minute: 5, second: 7 })).toBe('09:05:07')
    expect(toIsoTime(null)).toBeNull()
  })

  it('drops a zero seconds rather than writing :00', () => {
    expect(toIsoTime({ hour: 9, minute: 5, second: 0 })).toBe('09:05')
  })
})

describe('timeField', () => {
  it('renders one segment per part', () => {
    const wrapper = mount(TimeField, { props: { modelValue: '09:30' } })
    expect(segments(wrapper).length).toBeGreaterThanOrEqual(2)
  })

  it('shows the model in its segments', () => {
    const wrapper = mount(TimeField, { props: { modelValue: '09:30', hourCycle: 24 } })
    expect(wrapper.text()).toContain('09')
    expect(wrapper.text()).toContain('30')
  })

  it('adds a seconds segment at second granularity', () => {
    const minute = mount(TimeField, { props: { modelValue: '09:30:00' } })
    const second = mount(TimeField, { props: { modelValue: '09:30:00', granularity: 'second' } })
    expect(segments(second).length).toBeGreaterThan(segments(minute).length)
  })

  it('renders the separator as text, not another stop', () => {
    const wrapper = mount(TimeField, { props: { modelValue: '09:30' } })
    const literal = wrapper.findAll('span').find(s => s.text() === ':')
    expect(literal?.attributes('role')).toBeUndefined()
  })

  it('emits a padded string, never a Date', () => {
    const wrapper = mount(TimeField, { props: { modelValue: '09:30' } })
    // The root forwards Reka's Time; the component is what turns it into a string.
    wrapper.vm.$emit('update:modelValue', '09:05')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['09:05'])
  })

  it('starts empty when the model is malformed', () => {
    const wrapper = mount(TimeField, { props: { modelValue: 'nonsense' } })
    expect(wrapper.text()).not.toContain('09')
  })

  it('sizes the field', () => {
    expect(mount(TimeField, { props: { size: 'sm' } }).classes()).toContain('h-8')
    expect(mount(TimeField, { props: { size: 'lg' } }).classes()).toContain('h-10')
  })

  it('marks the field invalid', () => {
    const wrapper = mount(TimeField, { props: { invalid: true } })
    expect(wrapper.attributes('aria-invalid')).toBe('true')
    expect(wrapper.classes()).toContain('border-red-500')
  })

  it('disables every segment', () => {
    const wrapper = mount(TimeField, { props: { modelValue: '09:30', disabled: true } })
    expect(segments(wrapper).every(s => s.attributes('aria-disabled') === 'true')).toBe(true)
  })

  /*
   * The id lands on Reka's visually hidden input, not the wrapper — which is
   * the right target for a `<label for>`, since focusing it jumps to the
   * first segment.
   */
  it('takes an id a label can point at', () => {
    const wrapper = mount(TimeField, { props: { id: 'start' } })
    expect(wrapper.get('input').attributes('id')).toBe('start')
  })

  it('drops every built-in class when unstyled', () => {
    expect(mount(TimeField, { props: { unstyled: true } }).classes()).toHaveLength(0)
  })
})

describe('timeField bounds', () => {
  it('marks an out-of-range time invalid', () => {
    const early = mount(TimeField, { props: { modelValue: '07:00', minValue: '09:00', maxValue: '17:00' } })
    expect(early.attributes('aria-invalid')).toBe('true')

    const late = mount(TimeField, { props: { modelValue: '19:00', minValue: '09:00', maxValue: '17:00' } })
    expect(late.attributes('aria-invalid')).toBe('true')
  })

  it('leaves a time inside the range alone', () => {
    const wrapper = mount(TimeField, { props: { modelValue: '10:30', minValue: '09:00', maxValue: '17:00' } })
    expect(wrapper.attributes('aria-invalid')).toBeUndefined()
  })
})
