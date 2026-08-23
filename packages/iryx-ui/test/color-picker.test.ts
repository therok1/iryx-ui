import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ColorPicker } from '../src'

const swatches = ['#16a372', '#ff5733', '#3b82f6']

/** Reka renders each ramp as a slider; the area is a 2-D control of its own. */
function sliders(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[role="slider"]')
}

describe('colorPicker', () => {
  it('renders an area and a hue ramp by default', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372' } })
    expect(sliders(wrapper).length).toBeGreaterThan(0)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('adds an opacity ramp only when asked', () => {
    const plain = mount(ColorPicker, { props: { modelValue: '#16a372' } })
    const withAlpha = mount(ColorPicker, { props: { modelValue: '#16a372', alpha: true } })
    expect(sliders(withAlpha).length).toBeGreaterThan(sliders(plain).length)
  })

  /*
   * Transparent at one end reads as white without something behind it, so the
   * alpha ramp gets a chequerboard.
   */
  it('backs the alpha ramp with a chequerboard', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372', alpha: true } })
    expect(wrapper.html()).toContain('repeating-conic-gradient')
  })

  it('hides the hex field when asked', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372', hideField: true } })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('renders one swatch per preset', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372', swatches } })
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3)
  })

  it('renders no swatch row without presets', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372' } })
    expect(wrapper.findAll('[role="option"]')).toHaveLength(0)
  })

  it('emits a hex string when a swatch is chosen', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372', swatches } })
    await wrapper.findAll('[role="option"]')[1]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('#ff5733')
  })

  // The preview shows the current colour, so it has to track the model.
  it('paints the preview from the model', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372' } })
    // Inside the preview swatch, not the hue ramp — both carry a background.
    const fill = wrapper.get('.size-5').findAll('span').at(-1)
    expect(fill?.attributes('style')).toContain('#16a372')
  })

  it('leaves the gradients to Reka rather than painting over them', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372' } })
    // No background utility on the area, or it would cover the colour plane.
    const area = wrapper.findAll('div').find(d => d.classes().includes('h-40'))
    expect(area?.classes().some(c => c.startsWith('bg-'))).toBe(false)
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372', ui: { area: 'h-56' } } })
    expect(wrapper.html()).toContain('h-56')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#16a372', unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
  })
})
