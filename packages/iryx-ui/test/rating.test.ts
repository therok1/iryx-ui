import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Rating } from '../src'

/** The painted width of each icon's fill layer, as a percentage. */
function fills(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[style*="width"]').map((node) => {
    const width = (node.attributes('style') ?? '').match(/width:\s*([\d.]+)%/)?.[1]
    return Number(width)
  })
}

describe('rating', () => {
  it('reads as an image with the score in its name', () => {
    const wrapper = mount(Rating, { props: { modelValue: 4, label: 'Overall rating' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Overall rating: 4 out of 5')
  })

  it('fills whole icons up to the value', () => {
    expect(fills(mount(Rating, { props: { modelValue: 3 } }))).toEqual([100, 100, 100, 0, 0])
  })

  /* The point of clipping one icon rather than swapping in a second. */
  it('fills a fraction of the icon the value lands in', () => {
    expect(fills(mount(Rating, { props: { modelValue: 3.7 } }))).toEqual([100, 100, 100, 70, 0])
  })

  it('clamps a value outside the range rather than painting past the row', () => {
    expect(fills(mount(Rating, { props: { modelValue: 9 } }))).toEqual([100, 100, 100, 100, 100])
    expect(fills(mount(Rating, { props: { modelValue: -2 } }))).toEqual([0, 0, 0, 0, 0])
  })

  it('honours max', () => {
    expect(fills(mount(Rating, { props: { modelValue: 2, max: 3 } }))).toHaveLength(3)
  })

  it('prints a rounded score, not a floating-point tail', () => {
    const wrapper = mount(Rating, { props: { modelValue: 0.1 + 0.2, showValue: true } })
    expect(wrapper.text()).toBe('0.3')
  })

  describe('interactive', () => {
    it('reads as a slider carrying the value', () => {
      const wrapper = mount(Rating, { props: { modelValue: 2, interactive: true } })
      expect(wrapper.attributes('role')).toBe('slider')
      expect(wrapper.attributes('aria-valuenow')).toBe('2')
      expect(wrapper.attributes('aria-valuetext')).toBe('2 out of 5')
    })

    /* One tab stop, not `max` of them. */
    it('is a single tab stop', () => {
      const wrapper = mount(Rating, { props: { interactive: true } })
      expect(wrapper.attributes('tabindex')).toBe('0')
      expect(wrapper.findAll('[tabindex]')).toHaveLength(1)
    })

    it('sets the value from a click', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, interactive: true } })
      await wrapper.findAll('[class*="relative"]')[3]!.trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    })

    it('moves by one step on the arrow keys', async () => {
      const forwards = mount(Rating, { props: { modelValue: 3, interactive: true } })
      await forwards.trigger('keydown', { key: 'ArrowRight' })
      expect(forwards.emitted('update:modelValue')?.at(-1)).toEqual([4])

      // A fresh mount rather than `setProps`: without a listener `defineModel`
      // keeps its own copy, so the first press already left this one at 4.
      const backwards = mount(Rating, { props: { modelValue: 3, interactive: true } })
      await backwards.trigger('keydown', { key: 'ArrowLeft' })
      expect(backwards.emitted('update:modelValue')?.at(-1)).toEqual([2])
    })

    it('moves by a fractional step when told to', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, interactive: true, step: 0.5 } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3.5])
    })

    it('rounds a click to the step', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, interactive: true, step: 2 } })
      await wrapper.findAll('[class*="relative"]')[2]!.trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    })

    /* Never below one step: a slider that can reach zero has no way back up
       by clicking, since there is no icon to click for it. */
    it('stops at one step rather than zero', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 1, interactive: true } })
      await wrapper.trigger('keydown', { key: 'ArrowLeft' })
      // Held, not lowered — and unchanged, so nothing is emitted at all.
      expect(wrapper.attributes('aria-valuenow')).toBe('1')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('jumps to the ends on Home and End', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, interactive: true } })
      await wrapper.trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5])

      await wrapper.trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1])
    })

    it('ignores input while disabled', async () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, interactive: true, disabled: true } })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.attributes('tabindex')).toBe('-1')
    })
  })

  it('drops every built-in class under unstyled', () => {
    const wrapper = mount(Rating, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.classes()).toEqual(['mine'])
  })
})
