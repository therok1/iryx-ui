import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { Slider } from '../src'

/** Reka renders the thumbs as the elements carrying `role="slider"`. */
function thumbs(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[role="slider"]')
}

/** `findAll()[i]` is optional to TypeScript; every use here has already asserted the count. */
function thumb(wrapper: ReturnType<typeof mount>, index = 0) {
  const found = thumbs(wrapper)[index]
  if (!found)
    throw new Error(`no thumb at index ${index}`)
  return found
}

describe('slider', () => {
  /*
   * `aria-valuenow` lags one tick: Reka resolves a thumb's index from its
   * collection after mount, and until it does the thumb has no value to
   * report. Anything asserting on the value has to wait.
   */
  it('renders one thumb for a plain number', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 40 } })
    expect(thumbs(wrapper)).toHaveLength(1)
    await nextTick()
    expect(thumb(wrapper).attributes('aria-valuenow')).toBe('40')
  })

  it('renders a thumb per entry for a range', () => {
    const wrapper = mount(Slider, { props: { modelValue: [20, 80] } })
    expect(thumbs(wrapper)).toHaveLength(2)
  })

  it('falls back to a single thumb at min when unset', async () => {
    const wrapper = mount(Slider, { props: { min: 10 } })
    expect(thumbs(wrapper)).toHaveLength(1)
    await nextTick()
    expect(thumb(wrapper).attributes('aria-valuenow')).toBe('10')
  })

  // The whole point of accepting a scalar: `ref(50)` must not become `[50]`.
  it('emits a number when given a number', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([51])
  })

  it('emits an array when given an array', async () => {
    const wrapper = mount(Slider, { props: { modelValue: [20, 80] } })
    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[21, 80]])
  })

  it('respects step', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, step: 10 } })
    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([60])
  })

  it('clamps at max', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 100 } })
    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shows the label and the value when asked', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, label: 'Opacity', showValue: true } })
    expect(wrapper.text()).toContain('Opacity')
    expect(wrapper.text()).toContain('30')
  })

  it('joins a range value into one readable string', () => {
    const wrapper = mount(Slider, { props: { modelValue: [20, 80], showValue: true } })
    expect(wrapper.text()).toContain('20 – 80')
  })

  it('formats the value, the scale and the thumb label together', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 30, showValue: true, showScale: true, formatValue: (v: number) => `${v}%` },
    })
    expect(wrapper.text()).toContain('30%')
    expect(wrapper.text()).toContain('0%')
    expect(wrapper.text()).toContain('100%')
    expect(thumb(wrapper).attributes('aria-valuetext')).toBe('30%')
  })

  /*
   * The thumb is the element with `role="slider"`, so the name belongs on it.
   * Naming only the group left axe reporting an unnamed ARIA input field.
   */
  it('names the thumb after the label, and the group too', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, label: 'Opacity' } })
    expect(thumb(wrapper).attributes('aria-label')).toBe('Opacity')
    const labelId = wrapper.get('span').attributes('id')
    expect(wrapper.get('[data-slider-impl]').attributes('aria-labelledby')).toBe(labelId)
  })

  it('names each end of a labelled range', () => {
    const wrapper = mount(Slider, { props: { modelValue: [20, 80], label: 'Price' } })
    expect(thumb(wrapper).attributes('aria-label')).toBe('Price minimum')
    expect(thumb(wrapper, 1).attributes('aria-label')).toBe('Price maximum')
  })

  it('takes translated range labels', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: [20, 80], label: 'Preis', rangeLabels: ['von', 'bis'] as [string, string] },
    })
    expect(thumb(wrapper).attributes('aria-label')).toBe('Preis von')
  })

  // Without a label there is nothing to name the control, so the value stands in.
  it('labels a bare thumb with its value', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30 } })
    expect(thumb(wrapper).attributes('aria-label')).toBe('30')
  })

  it('hides the scale when vertical, where the captions would not line up', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 30, showScale: true, orientation: 'vertical' as const },
    })
    expect(wrapper.text()).not.toContain('100')
  })

  /*
   * The wrapper and header sit outside Reka's markup, so they cannot read
   * `data-orientation` off it. A vertical slider left on the horizontal
   * layout stretched full width and flung its label and value to opposite
   * edges of the container, nowhere near the track.
   */
  it('keeps the header attached to a vertical track', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 30, label: 'Level', showValue: true, orientation: 'vertical' as const },
    })
    expect(wrapper.classes()).toContain('w-auto')
    expect(wrapper.classes()).not.toContain('w-full')
    const header = wrapper.get('span').element.parentElement
    expect(header?.className).toContain('flex-col')
    expect(header?.className).not.toContain('justify-between')
  })

  it('stretches and spreads the header when horizontal', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, label: 'Level', showValue: true } })
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.get('span').element.parentElement?.className).toContain('justify-between')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, ui: { thumb: 'size-8' } } })
    expect(thumb(wrapper).classes()).toContain('size-8')
    expect(thumb(wrapper).classes()).not.toContain('size-4')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, unstyled: true } })
    expect(thumb(wrapper).classes()).toHaveLength(0)
  })

  it('forwards attributes to the control, not the wrapper', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30 }, attrs: { 'data-testid': 'volume' } })
    expect(wrapper.get('[data-orientation]').attributes('data-testid')).toBe('volume')
  })

  it('marks the thumbs disabled', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, disabled: true } })
    expect(thumb(wrapper).attributes('data-disabled')).toBeDefined()
  })
})
