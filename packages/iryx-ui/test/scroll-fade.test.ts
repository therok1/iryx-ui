import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { ScrollFade } from '../src'
import { scrollFadeMask } from '../src/composables/scroll-fade'

/**
 * happy-dom lays nothing out, so the scroll metrics have to be supplied. These
 * are the three numbers the composable reads.
 *
 * It also drops `mask-image` from inline styles, so the rendered style
 * attribute proves nothing — the edge state is asserted through the data
 * attributes, and the gradient itself through `scrollFadeMask` directly.
 */
function measured(el: HTMLElement, metrics: { scrollTop: number, clientHeight: number, scrollHeight: number }) {
  for (const [key, value] of Object.entries(metrics))
    Object.defineProperty(el, key, { configurable: true, value })
}

async function mountWith(
  metrics: { scrollTop: number, clientHeight: number, scrollHeight: number },
  props = {},
) {
  const wrapper = mount(ScrollFade, {
    props,
    slots: { default: '<p>Rows</p>' },
    attachTo: document.body,
  })

  measured(wrapper.element as HTMLElement, metrics)
  wrapper.element.dispatchEvent(new Event('scroll'))
  await nextTick()
  return wrapper
}

describe('scrollFade edges', () => {
  it('reports no overflow when the content fits', async () => {
    const wrapper = await mountWith({ scrollTop: 0, clientHeight: 200, scrollHeight: 200 })
    expect(wrapper.attributes('data-overflowing')).toBeUndefined()
    expect(wrapper.attributes('data-at-start')).toBe('')
    expect(wrapper.attributes('data-at-end')).toBe('')
    wrapper.unmount()
  })

  it('is at the start but not the end at the top of a long list', async () => {
    const wrapper = await mountWith({ scrollTop: 0, clientHeight: 200, scrollHeight: 600 })
    expect(wrapper.attributes('data-overflowing')).toBe('')
    expect(wrapper.attributes('data-at-start')).toBe('')
    expect(wrapper.attributes('data-at-end')).toBeUndefined()
    wrapper.unmount()
  })

  it('is at neither end in the middle', async () => {
    const wrapper = await mountWith({ scrollTop: 200, clientHeight: 200, scrollHeight: 600 })
    expect(wrapper.attributes('data-at-start')).toBeUndefined()
    expect(wrapper.attributes('data-at-end')).toBeUndefined()
    wrapper.unmount()
  })

  /*
   * Fractional layout — a zoomed page, a scaled root font — leaves `scrollTop`
   * a hair short of the maximum. An exact comparison reads that as "more
   * below" and paints a trailing fade on a list already scrolled to the end.
   */
  it('treats a sub-pixel remainder as the end', async () => {
    const wrapper = await mountWith({ scrollTop: 399.6, clientHeight: 200, scrollHeight: 600 })
    expect(wrapper.attributes('data-at-end')).toBe('')
    wrapper.unmount()
  })

  it('scrolls horizontally when asked', () => {
    const wrapper = mount(ScrollFade, { props: { orientation: 'horizontal' } })
    expect(wrapper.classes()).toContain('overflow-x-auto')
    expect(wrapper.classes()).not.toContain('overflow-y-auto')
  })

  it('exposes the edge state to its slot', async () => {
    const wrapper = mount(ScrollFade, {
      slots: { default: '<span>{{ params.atStart }}</span>' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.text()).toBe('true')
    wrapper.unmount()
  })
})

describe('scrollFadeMask', () => {
  it('fades only the trailing edge at the top', () => {
    const mask = scrollFadeMask({ orientation: 'vertical', size: '2rem', fadeStart: false, fadeEnd: true })
    expect(mask).toBe('linear-gradient(to bottom, black 0, black calc(100% - 2rem), transparent 100%)')
  })

  it('fades only the leading edge at the bottom', () => {
    const mask = scrollFadeMask({ orientation: 'vertical', size: '2rem', fadeStart: true, fadeEnd: false })
    expect(mask).toBe('linear-gradient(to bottom, transparent 0, black 2rem, black 100%)')
  })

  it('fades both edges in the middle', () => {
    const mask = scrollFadeMask({ orientation: 'horizontal', size: '48px', fadeStart: true, fadeEnd: true })
    expect(mask).toBe('linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)')
  })

  it('returns nothing when neither edge fades, rather than an identity mask', () => {
    expect(scrollFadeMask({ orientation: 'vertical', size: '2rem', fadeStart: false, fadeEnd: false })).toBeUndefined()
  })
})
