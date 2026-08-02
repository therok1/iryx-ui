import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Progress } from '../src'

const track = '[role="progressbar"]'

describe('progress', () => {
  it('exposes the value to assistive tech', () => {
    const wrapper = mount(Progress, { props: { modelValue: 40 } })
    expect(wrapper.get(track).attributes('aria-valuenow')).toBe('40')
    expect(wrapper.get(track).attributes('aria-valuemax')).toBe('100')
  })

  it('translates the indicator by the remaining percentage', () => {
    const wrapper = mount(Progress, { props: { modelValue: 25 } })
    expect(wrapper.get(`${track} > *`).attributes('style')).toContain('translateX(-75%)')
  })

  it('respects a custom max', () => {
    const wrapper = mount(Progress, { props: { modelValue: 25, max: 50 } })
    expect(wrapper.get(`${track} > *`).attributes('style')).toContain('translateX(-50%)')
  })

  it('clamps values outside the range', () => {
    const over = mount(Progress, { props: { modelValue: 250 } })
    expect(over.get(`${track} > *`).attributes('style')).toContain('translateX(-0%)')
    const under = mount(Progress, { props: { modelValue: -10 } })
    expect(under.get(`${track} > *`).attributes('style')).toContain('translateX(-100%)')
  })

  it('animates and drops the transform when indeterminate', () => {
    const wrapper = mount(Progress, { props: { indeterminate: true } })
    const indicator = wrapper.get(`${track} > *`)
    expect(indicator.attributes('class')).toContain('animate-progress-indeterminate')
    expect(indicator.attributes('style')).toBeUndefined()
  })

  it('treats a null value as indeterminate', () => {
    const wrapper = mount(Progress, { props: { modelValue: null } })
    expect(wrapper.get(`${track} > *`).attributes('class')).toContain('animate-progress-indeterminate')
  })

  it('shows a percentage only when asked', () => {
    expect(mount(Progress, { props: { modelValue: 40 } }).text()).toBe('')
    expect(mount(Progress, { props: { modelValue: 40, showValue: true } }).text()).toBe('40%')
  })

  it('lets formatValue override the display for other units and locales', () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 1234.5,
        max: 5000,
        showValue: true,
        formatValue: (value, max) => `${value} od ${max} €`,
      },
    })
    expect(wrapper.text()).toBe('1234.5 od 5000 €')
  })

  it('renders the header only when there is something in it', () => {
    expect(mount(Progress, { props: { modelValue: 10 } }).findAll('span')).toHaveLength(0)
    expect(mount(Progress, { props: { modelValue: 10, label: 'Used' } }).text()).toBe('Used')
  })

  it('colours the indicator from status tokens, not raw palettes', () => {
    for (const variant of ['success', 'warning', 'danger', 'info'] as const) {
      const classes = mount(Progress, { props: { modelValue: 1, variant } })
        .get(`${track} > *`)
        .attributes('class') ?? ''
      expect(classes).toContain(`bg-${variant}`)
      expect(classes).not.toMatch(/dark:|emerald|amber|red-|blue-/)
    }
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Progress, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
