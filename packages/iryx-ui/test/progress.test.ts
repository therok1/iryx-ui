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

describe('stacked segments', () => {
  const segments = [
    { value: 40, label: 'Documents', variant: 'primary' as const },
    { value: 25, label: 'Images', variant: 'success' as const },
    { value: 10, label: 'Other' },
  ]

  it('renders one run per segment, sized by value', () => {
    const wrapper = mount(Progress, { props: { segments } })
    const runs = wrapper.findAll('[role="progressbar"] > div > div')
    expect(runs).toHaveLength(3)
    expect(runs[0]!.attributes('style')).toContain('width: 40%')
    expect(runs[1]!.attributes('style')).toContain('width: 25%')
  })

  it('reports the sum as the accessible value', () => {
    const wrapper = mount(Progress, { props: { segments } })
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('75')
  })

  /*
   * Segments come from somewhere else and can sum past `max` — a disk that
   * grew, a budget overspent. Painting outside the track is never right.
   */
  it('clamps runs cumulatively so they cannot overflow the track', () => {
    const wrapper = mount(Progress, {
      props: { segments: [{ value: 80 }, { value: 60 }] },
    })
    const runs = wrapper.findAll('[role="progressbar"] > div > div')
    expect(runs[0]!.attributes('style')).toContain('width: 80%')
    expect(runs[1]!.attributes('style')).toContain('width: 20%')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
  })

  it('is never indeterminate, whatever modelValue says', () => {
    const wrapper = mount(Progress, { props: { segments, modelValue: null } })
    expect(wrapper.find('.iryx-progress-indeterminate').exists()).toBe(false)
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('75')
  })

  it('lists named runs in a legend, and renders none when unnamed', () => {
    const named = mount(Progress, { props: { segments } })
    expect(named.findAll('li')).toHaveLength(3)

    const bare = mount(Progress, { props: { segments: [{ value: 30 }, { value: 20 }] } })
    expect(bare.findAll('li')).toHaveLength(0)
  })

  it('formats legend values with formatValue when given', () => {
    const wrapper = mount(Progress, {
      props: {
        segments: [{ value: 40, label: 'Documents' }],
        max: 200,
        formatValue: (value: number) => `${value} GB`,
      },
    })
    expect(wrapper.get('li').text()).toContain('40 GB')
  })
})
