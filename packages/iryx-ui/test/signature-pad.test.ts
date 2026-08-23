import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { hasInk, SignaturePad, strokeWidth } from '../src'

const at = (x: number, y: number, t: number, pressure = 0.5) => ({ x, y, t, pressure })

/*
 * jsdom has no canvas backend, so `getContext` returns null and every draw is
 * a no-op. Everything the component does around drawing — the actions,
 * the emitted model — is still exercised.
 */
vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
})

describe('strokeWidth', () => {
  /*
   * A constant width reads as a traced outline rather than handwriting: real
   * ink thins as the hand speeds up.
   */
  it('thins as the pen moves faster', () => {
    const slow = strokeWidth(2, at(0, 0, 0), at(1, 0, 50))
    const fast = strokeWidth(2, at(0, 0, 0), at(60, 0, 10))
    expect(fast).toBeLessThan(slow)
  })

  it('never collapses the line or blobs it', () => {
    const flick = strokeWidth(2, at(0, 0, 0), at(4000, 0, 1))
    const crawl = strokeWidth(2, at(0, 0, 0), at(0.01, 0, 500))
    expect(flick).toBeGreaterThan(0)
    expect(crawl).toBeLessThanOrEqual(2 * 1.2 * 1.3)
  })

  it('lets pressure widen the line where the hardware reports it', () => {
    const light = strokeWidth(2, at(0, 0, 0), at(5, 0, 20, 0.1))
    const heavy = strokeWidth(2, at(0, 0, 0), at(5, 0, 20, 1))
    expect(heavy).toBeGreaterThan(light)
  })

  it('survives two points sharing a timestamp', () => {
    expect(Number.isFinite(strokeWidth(2, at(0, 0, 5), at(3, 3, 5)))).toBe(true)
  })
})

describe('hasInk', () => {
  // A stray tap leaves a one-point stroke, which is not a signature.
  it('ignores a single tap', () => {
    expect(hasInk([[at(1, 1, 0)]])).toBe(false)
    expect(hasInk([[at(1, 1, 0), at(2, 2, 10)]])).toBe(true)
    expect(hasInk([])).toBe(false)
  })
})

describe('signaturePad', () => {
  it('renders a canvas named for a screen reader', () => {
    const wrapper = mount(SignaturePad, { props: { ariaLabel: 'Sign the agreement' } })
    const canvas = wrapper.get('canvas')
    expect(canvas.attributes('role')).toBe('img')
    expect(canvas.attributes('aria-label')).toBe('Sign the agreement')
  })

  /*
   * `strokes` holds reactive proxies, so a stroke pushed through a raw
   * reference mutated the data without invalidating anything reading it —
   * the pad looked drawn on but reported itself empty until the *next*
   * pointerdown. One stroke has to count.
   */
  it('counts a single stroke as signed', async () => {
    const wrapper = mount(SignaturePad)
    const canvas = wrapper.get('canvas')

    await canvas.trigger('pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pressure: 0.5 })
    await canvas.trigger('pointermove', { pointerId: 1, clientX: 40, clientY: 30, pressure: 0.5 })
    await canvas.trigger('pointerup', { pointerId: 1, clientX: 40, clientY: 30, pressure: 0.5 })

    expect(wrapper.vm.isEmpty).toBe(false)
    expect(wrapper.emitted('start')).toHaveLength(1)
    expect(wrapper.emitted('end')).toHaveLength(1)
  })

  it('stays empty after a stray tap', async () => {
    const wrapper = mount(SignaturePad)
    const canvas = wrapper.get('canvas')

    await canvas.trigger('pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pressure: 0.5 })
    await canvas.trigger('pointerup', { pointerId: 1, clientX: 10, clientY: 10, pressure: 0.5 })

    expect(wrapper.vm.isEmpty).toBe(true)
  })

  it('names its actions, since they are icons alone', () => {
    const wrapper = mount(SignaturePad, { props: { undoLabel: 'Undo', clearLabel: 'Clear' } })
    expect(wrapper.find('[aria-label="Undo"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Clear"]').exists()).toBe(true)
  })

  // Nothing to undo or clear yet, so both are disabled rather than misleading.
  it('disables its actions while empty', () => {
    const wrapper = mount(SignaturePad)
    expect(wrapper.findAll('button').every(b => b.attributes('disabled') !== undefined)).toBe(true)
  })

  // Nothing drawn yet, so the button is disabled rather than misleading; the
  // exposed method is the way a form clears it.
  it('clears through its exposed method', () => {
    const wrapper = mount(SignaturePad)
    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('marks the pad invalid', () => {
    const wrapper = mount(SignaturePad, { props: { invalid: true } })
    expect(wrapper.classes()).toContain('border-red-500')
  })

  it('takes its height from the prop', () => {
    const wrapper = mount(SignaturePad, { props: { height: 240 } })
    expect(wrapper.get('canvas').attributes('style')).toContain('height: 240px')
  })

  // A finger signature would scroll the page instead of drawing without this.
  it('stops the pad from scrolling under a finger', () => {
    expect(mount(SignaturePad).get('canvas').classes()).toContain('touch-none')
  })

  it('exposes its own controls', () => {
    const wrapper = mount(SignaturePad)
    expect(typeof wrapper.vm.clear).toBe('function')
    expect(typeof wrapper.vm.undo).toBe('function')
    expect(typeof wrapper.vm.toDataUrl).toBe('function')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(SignaturePad, { props: { unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
  })
})
