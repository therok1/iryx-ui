import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { BarChart, niceTicks } from '../src'

describe('niceTicks', () => {
  /** The whole point: an axis a person would have written by hand. */
  it('lands on round numbers, not on the data', () => {
    expect(niceTicks(0, 4317).ticks).toEqual([0, 1000, 2000, 3000, 4000, 5000])
    expect(niceTicks(0, 87).ticks).toEqual([0, 20, 40, 60, 80, 100])
  })

  it('widens the domain outwards to reach a round step', () => {
    const { min, max } = niceTicks(3, 47)
    expect(min).toBeLessThanOrEqual(3)
    expect(max).toBeGreaterThanOrEqual(47)
  })

  it('spans negatives through zero', () => {
    const { ticks } = niceTicks(-40, 80)
    expect(ticks).toContain(0)
    expect(ticks[0]).toBeLessThanOrEqual(-40)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(80)
  })

  /** `0.1 + 0.2 !== 0.3`, and an axis reading 0.30000000000000004 is unusable. */
  it('keeps fractional steps free of float noise', () => {
    for (const tick of niceTicks(0, 1).ticks)
      expect(String(tick)).not.toMatch(/\d{6,}/)

    expect(niceTicks(0, 0.5).ticks.every(tick => String(tick).length <= 4)).toBe(true)
  })

  it('gives a flat or empty domain something to draw', () => {
    expect(niceTicks(0, 0).ticks).toEqual([0, 1])
    expect(niceTicks(5, 5).ticks.length).toBeGreaterThan(1)
    expect(niceTicks(Number.NaN, Number.NaN).ticks).toEqual([0, 1])
  })

  it('honours the requested tick count loosely', () => {
    const { ticks } = niceTicks(0, 100, 3)
    expect(ticks.length).toBeGreaterThanOrEqual(3)
    expect(ticks.length).toBeLessThanOrEqual(6)
  })
})

const data = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5600 },
  { label: 'Mar', value: 3100 },
]

/**
 * The DOM stub reports every element as zero-width, so nothing would ever be
 * plotted. Give the whole document a width and the component measures 600px
 * exactly as it would in a browser.
 */
function withWidth(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: width, configurable: true })
}

/** The measurement lands in a post-flush watcher, so let it settle. */
async function mountChart(props: Record<string, unknown> = {}) {
  withWidth(600)
  const wrapper = mount(BarChart, { props: { data, ...props }, attachTo: document.body })
  await nextTick()
  return wrapper
}

describe('barChart', () => {
  it('exposes the data as a table for assistive tech', async () => {
    const wrapper = await mountChart({ label: 'Revenue by month' })

    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBe('figure')
    expect(wrapper.attributes('aria-label')).toBe('Revenue by month')

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
    expect(rows[0]!.text()).toContain('Jan')
    expect(rows[0]!.text()).toContain('4,200')
  })

  it('shows a missing reading as absent, not as zero', async () => {
    const wrapper = await mountChart({ data: [{ label: 'Jan', value: null }, { label: 'Feb', value: 10 }] })
    expect(wrapper.findAll('tbody tr')[0]!.text()).toContain('—')
  })

  it('draws an axis of round numbers', async () => {
    const wrapper = await mountChart()
    const ticks = wrapper.findAll('text').map(node => node.text())
    expect(ticks).toContain('0')
    expect(ticks).toContain('6,000')
  })

  it('drops the axis when asked', async () => {
    const wrapper = await mountChart({ axis: false })
    expect(wrapper.findAll('line')).toHaveLength(0)
  })

  it('formats every number through the same locale and options', async () => {
    const wrapper = await mountChart({ locale: 'de-DE', format: { style: 'currency', currency: 'EUR' } })
    expect(wrapper.get('tbody tr').text()).toContain('4.200,00')
  })

  it('labels every category when they fit', async () => {
    const wrapper = await mountChart()
    const texts = wrapper.findAll('text').map(node => node.text())
    expect(texts).toContain('Jan')
    expect(texts).toContain('Feb')
    expect(texts).toContain('Mar')
  })

  /** Dropping labels beats rotating them — cheaper to read, cheaper in height. */
  it('thins category labels rather than letting them collide', async () => {
    const many = Array.from({ length: 40 }, (_, index) => ({
      label: `Week ${index + 1}`,
      value: index,
    }))
    const wrapper = await mountChart({ data: many })
    const shown = wrapper.findAll('text').filter(node => node.text().startsWith('Week'))

    expect(shown.length).toBeGreaterThan(0)
    expect(shown.length).toBeLessThan(40)
  })

  it('draws one bar per reading once measured', async () => {
    expect((await mountChart()).findAll('path')).toHaveLength(3)
  })

  it('renders no marks before the container has been measured', () => {
    withWidth(0)
    const wrapper = mount(BarChart, { props: { data } })
    expect(wrapper.findAll('path')).toHaveLength(0)
    // The table is still there — the data is never gated behind layout.
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('survives an empty series', async () => {
    const wrapper = await mountChart({ data: [] })
    expect(wrapper.findAll('path')).toHaveLength(0)
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
  })
})
