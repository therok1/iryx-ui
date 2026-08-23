import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import {
  addDecimals,
  clampDecimal,
  compareDecimals,
  formatForLocale,
  NumberInput,
  parseFromLocale,
  roundDecimal,
} from '../src'

/*
 * The whole point of this component: money is decimal, and binary floating
 * point cannot represent it. Every operation goes through BigInt, so these
 * assertions must hold exactly rather than approximately.
 */
describe('decimal arithmetic', () => {
  it('adds without floating-point drift', () => {
    // 0.1 + 0.2 === 0.30000000000000004 in a float.
    expect(addDecimals('0.1', '0.2')).toBe('0.3')
    expect(addDecimals('1234.56', '0.01')).toBe('1234.57')
    expect(addDecimals('-0.3', '0.1')).toBe('-0.2')
  })

  it('keeps precision far beyond what a float can hold', () => {
    // 9007199254740993 is Number.MAX_SAFE_INTEGER + 2, unrepresentable exactly.
    expect(addDecimals('9007199254740992', '1')).toBe('9007199254740993')
    expect(addDecimals('0.000000000000000001', '0.000000000000000002')).toBe('0.000000000000000003')
  })

  it('lines up different scales', () => {
    expect(addDecimals('1.5', '0.25')).toBe('1.75')
    expect(addDecimals('100', '0.001')).toBe('100.001')
  })

  it('rounds half-up at a fixed scale', () => {
    expect(roundDecimal('1.005', 2)).toBe('1.01')
    expect(roundDecimal('2.5', 0)).toBe('3')
    expect(roundDecimal('-2.5', 0)).toBe('-3')
    expect(roundDecimal('1.004', 2)).toBe('1.00')
    // Padding out is exact too.
    expect(roundDecimal('1.5', 3)).toBe('1.500')
  })

  it('compares exactly across scales', () => {
    expect(compareDecimals('1.10', '1.1')).toBe(0)
    expect(compareDecimals('1.9', '1.10')).toBe(1)
    expect(compareDecimals('-5', '-4.99')).toBe(-1)
  })

  it('clamps to the range', () => {
    expect(clampDecimal('5', '0', '3')).toBe('3')
    expect(clampDecimal('-1', '0', '3')).toBe('0')
    expect(clampDecimal('1.5', '0', '3')).toBe('1.5')
  })

  it('rejects junk rather than guessing', () => {
    expect(addDecimals('abc', '1')).toBeUndefined()
    expect(roundDecimal('', 2)).toBeUndefined()
  })
})

describe('locale display', () => {
  it('formats for a locale without touching the value', () => {
    expect(formatForLocale('1234.56', 'sl', 2)).toBe('1.234,56')
    expect(formatForLocale('1234.56', 'en', 2)).toBe('1,234.56')
    expect(formatForLocale('-1234567.5', 'sl', 2)).toBe('-1.234.567,50')
  })

  it('formats values a float could not hold exactly', () => {
    expect(formatForLocale('9007199254740993.01', 'en', 2)).toBe('9,007,199,254,740,993.01')
  })

  it('parses back from a locale', () => {
    expect(parseFromLocale('1.234,56', 'sl')).toBe('1234.56')
    expect(parseFromLocale('1,234.56', 'en')).toBe('1234.56')
    expect(parseFromLocale('nonsense', 'en')).toBeUndefined()
  })
})

describe('numberInput', () => {
  it('keeps the model a string, never a number', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '' } })
    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.setValue('1234.50')
    await input.trigger('blur')

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0]
    expect(emitted).toBe('1234.50')
    expect(typeof emitted).toBe('string')
  })

  it('preserves trailing zeros that a number would drop', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '', precision: 2 } })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('10.00')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('10.00')
  })

  it('steps without drift', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '0.1', step: '0.2' } })
    await wrapper.get('[aria-label="Increment"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('0.3')
  })

  it('clamps to min and max when stepping', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '9.5', max: '10', step: '1' } })
    await wrapper.get('[aria-label="Increment"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('10')
  })

  it('disables the stepper at the bounds', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '10', max: '10', min: '0' } })
    expect(wrapper.get('[aria-label="Increment"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[aria-label="Decrement"]').attributes('disabled')).toBeUndefined()
  })

  it('rounds typed input to the precision', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '', precision: 2 } })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('1.005')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('1.01')
  })

  it('accepts locale-typed input but stores canonical', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '', locale: 'sl', precision: 2 } })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('1.234,56')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('1234.56')
  })

  it('shows the locale format while idle and an ungrouped one while editing', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '1234.56', locale: 'sl', precision: 2 } })
    await nextTick()
    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).value).toBe('1.234,56')

    // Ungrouped, but still the locale's decimal separator.
    await input.trigger('focus')
    expect((input.element as HTMLInputElement).value).toBe('1234,56')
  })

  /*
   * Regression: editing used to show the canonical `1234.56`, which parses as
   * `123456` in a locale where `.` groups digits — a focus/blur round trip
   * silently multiplied the value and appended two zeros.
   */
  it('survives a focus/blur round trip unchanged in a comma-decimal locale', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '1234.56', locale: 'sl', precision: 2 },
    })
    await nextTick()
    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('blur')

    const emitted = wrapper.emitted('update:modelValue')?.at(-1)?.[0]
    expect(emitted ?? '1234.56').toBe('1234.56')
    expect((input.element as HTMLInputElement).value).toBe('1.234,56')
  })

  it('round trips in a dot-decimal locale too', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '1234.56', locale: 'en', precision: 2 },
    })
    await nextTick()
    const input = wrapper.get('input')

    await input.trigger('focus')
    expect((input.element as HTMLInputElement).value).toBe('1234.56')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0] ?? '1234.56').toBe('1234.56')
    expect((input.element as HTMLInputElement).value).toBe('1,234.56')
  })

  it('keeps the last good value when input cannot be parsed', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '5' } })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('not a number')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect((input.element as HTMLInputElement).value).toBe('5')
  })

  it('treats an empty field as no value', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '5' } })
    const input = wrapper.get('input')
    await input.trigger('focus')
    await input.setValue('')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('')
  })

  /* A native number input would strip precision and fight locale separators. */
  it('is a text field with a decimal keypad, not type=number', () => {
    const input = mount(NumberInput).get('input')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('inputmode')).toBe('decimal')
    expect(input.attributes('role')).toBe('spinbutton')
  })

  it('steps with the arrow keys', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: '1', step: '0.5' } })
    await wrapper.get('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('1.5')
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(NumberInput, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.element.getAttribute('class')).toBe('mine')
  })

  /*
   * The stepper is positioned against the root and the input fills it, so a
   * width written on the input left the root full-width and the arrows pinned
   * to that edge, floating beside a narrow field.
   */
  it('puts class on the root, which is what the stepper is positioned against', () => {
    const wrapper = mount(NumberInput, { props: { stepper: true, class: 'w-32' } })
    expect(wrapper.element.getAttribute('class')).toContain('w-32')
    expect(wrapper.get('input').attributes('class')).not.toContain('w-32')
  })

  it('still reaches the input through ui.input', () => {
    const wrapper = mount(NumberInput, { props: { ui: { input: 'font-bold' } } })
    expect(wrapper.get('input').attributes('class')).toContain('font-bold')
  })
})
