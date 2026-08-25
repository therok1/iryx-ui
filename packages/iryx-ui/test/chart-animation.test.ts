import type { ChartEasing } from '../src'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { BarChart, DonutChart, LineChart, Sparkline, useChartAnimation } from '../src'

const data = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5600 },
  { label: 'Mar', value: 3100 },
]

function withWidth(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: width, configurable: true })
}

async function mountChart(component: any, props: Record<string, unknown> = {}) {
  withWidth(600)
  const wrapper = mount(component, { props: { data, ...props }, attachTo: document.body })
  await nextTick()
  return wrapper
}

describe('useChartAnimation', () => {
  it('defaults to the house curve and duration', () => {
    const { enabled, duration, css } = useChartAnimation(ref(undefined)).value
    expect(enabled).toBe(true)
    expect(duration).toBe(700)
    expect(css).toMatch(/^cubic-bezier\(/)
  })

  it('takes a duration and a named curve', () => {
    const resolved = useChartAnimation(ref({ duration: 200, easing: 'linear' as const })).value
    expect(resolved.duration).toBe(200)
    expect(resolved.ease(0.5)).toBeCloseTo(0.5, 2)
  })

  it('reports `false` as off', () => {
    expect(useChartAnimation(ref(false)).value.enabled).toBe(false)
  })

  /** A negative duration is a caller's slip, not a reason to run backwards. */
  it('floors the duration at zero', () => {
    expect(useChartAnimation(ref({ duration: -1 })).value.duration).toBe(0)
  })

  it('eases in and out of the same endpoints', () => {
    const animate = ref<{ easing: ChartEasing }>({ easing: 'ease-in' })
    const resolved = useChartAnimation(animate)
    for (const easing of ['ease-in', 'ease-out', 'ease-in-out', 'linear'] as const) {
      animate.value = { easing }
      const { ease } = resolved.value
      expect(ease(0)).toBe(0)
      expect(ease(1)).toBe(1)
      // Never runs backwards, whatever the curve.
      expect(ease(0.6)).toBeGreaterThanOrEqual(ease(0.4))
    }
  })

  /**
   * The two are mirrors of each other, which is the property that makes the
   * pair read as one family rather than as two unrelated curves.
   */
  it('mirrors ease-in and ease-out about the diagonal', () => {
    const out = useChartAnimation(ref({ easing: 'ease-out' as const })).value.ease
    const inward = useChartAnimation(ref({ easing: 'ease-in' as const })).value.ease

    for (const t of [0.25, 0.5, 0.75])
      expect(inward(t)).toBeCloseTo(1 - out(1 - t), 1)
  })

  it('is reactive to the prop it was handed', () => {
    const animate = ref<boolean | { duration: number }>({ duration: 100 })
    const resolved = useChartAnimation(computed(() => animate.value))
    expect(resolved.value.duration).toBe(100)
    animate.value = false
    expect(resolved.value.enabled).toBe(false)
  })
})

describe('chart reveals', () => {
  /**
   * Both ends of the transform are written out. Transitioning to `none`
   * gives an SVG element nothing to interpolate towards, and the bar snaps
   * to full size instead of growing.
   */
  it('grows bars from the baseline, with both ends of the transform stated', async () => {
    const wrapper = await mountChart(BarChart, { animate: { duration: 500 } })
    const style = wrapper.get('path').attributes('style')!
    expect(style).toContain('transform: scaleY(')
    expect(style).toContain('transform-origin:')
    expect(style).toContain('500ms')
  })

  it('turns the reveal into an inert style when off', async () => {
    const wrapper = await mountChart(BarChart, { animate: false })
    expect(wrapper.get('path').attributes('style')).toContain('scaleY(1)')
  })

  /**
   * The line and its wash share one clip rectangle. A dash advances along the
   * path and a fill can only be uncovered along x, so anything else lets the
   * two drift apart wherever the line is steep.
   */
  it('uncovers a line and its wash under one clip', async () => {
    const wrapper = await mountChart(LineChart, { variant: 'area', animate: { duration: 400 } })
    const group = wrapper.findAll('g').find(node => node.attributes('clip-path'))!
    expect(group.attributes('clip-path')).toContain('url(#')

    const rect = wrapper.get('clipPath rect')
    expect(rect.attributes('style')).toContain('transform: scaleX(')
    expect(rect.attributes('style')).toContain('400ms')
  })

  it('leaves a sparkline still by default', async () => {
    const wrapper = mount(Sparkline, { props: { data: [1, 2, 3] }, attachTo: document.body })
    await nextTick()
    expect(wrapper.get('clipPath rect').attributes('style')).toContain('scaleX(1)')
  })

  /** The donut recomputes its geometry, so "off" has to mean full slices. */
  it('draws the donut whole when the reveal is off', async () => {
    const wrapper = await mountChart(DonutChart, {
      data: [{ label: 'A', value: 1 }, { label: 'B', value: 1 }],
      animate: false,
    })
    expect(wrapper.findAll('path')).toHaveLength(2)
  })
})
