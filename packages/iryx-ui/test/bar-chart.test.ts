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

  /** Width of the first bar, read back out of its path. */
  function barWidthOf(wrapper: Awaited<ReturnType<typeof mountChart>>): number {
    const xs = [...wrapper.get('path').attributes('d')!.matchAll(/[ML]([\d.]+) /g)]
      .map(match => Number(match[1]))
    return Math.max(...xs) - Math.min(...xs)
  }

  it('caps bar width so a few categories are not slabs', async () => {
    expect(barWidthOf(await mountChart())).toBeLessThanOrEqual(24)
  })

  /**
   * Regression: the gap used to be a fixed 8px subtracted from the band, which
   * is fine at wide bands and collapses at narrow ones — 26 categories in a
   * phone-width card left 2px hairlines. A proportional gap shrinks the bar
   * and the space beside it together.
   */
  it('keeps bars substantial when the band is narrow', async () => {
    const many = Array.from({ length: 26 }, (_, index) => ({ label: `W${index + 1}`, value: index + 1 }))
    withWidth(290)
    const wrapper = mount(BarChart, { props: { data: many }, attachTo: document.body })
    await nextTick()

    const width = barWidthOf(wrapper)
    expect(width).toBeGreaterThan(4)
    // Still leaves air: never the whole band.
    expect(width).toBeLessThan((290 - 30) / 26)
  })

  it('renders no marks before the container has been measured', () => {
    withWidth(0)
    const wrapper = mount(BarChart, { props: { data } })
    expect(wrapper.findAll('path')).toHaveLength(0)
    // The table is still there — the data is never gated behind layout.
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  /**
   * The reason horizontal exists: vertical charts thin colliding labels, and
   * long category names are exactly the case where dropping every other one
   * loses the information the chart is about.
   */
  it('shows every long label horizontally that it would thin vertically', async () => {
    const long = [
      { label: 'Travel and accommodation', value: 4300 },
      { label: 'Professional services', value: 3800 },
      { label: 'Software licences', value: 9200 },
      { label: 'Office and utilities', value: 6100 },
      { label: 'Subcontractors', value: 18400 },
      { label: 'Equipment', value: 2400 },
    ]

    const vertical = await mountChart({ data: long })
    const shownVertically = vertical.findAll('text').filter(node => node.text().includes(' ')).length

    const horizontal = await mountChart({ data: long, orientation: 'horizontal' })
    const shownHorizontally = horizontal.findAll('text').filter(node => node.text().includes(' ')).length

    expect(shownHorizontally).toBeGreaterThan(shownVertically)
    for (const datum of long)
      expect(horizontal.text()).toContain(datum.label)
  })

  it('runs bars along the value axis when horizontal', async () => {
    const wrapper = await mountChart({ orientation: 'horizontal' })
    const boxOf = (d: string) => {
      const xs = [...d.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])] as const)
      return {
        w: Math.max(...xs.map(p => p[0])) - Math.min(...xs.map(p => p[0])),
        h: Math.max(...xs.map(p => p[1])) - Math.min(...xs.map(p => p[1])),
      }
    }

    // Bars are wider than they are tall once the chart turns.
    const bar = boxOf(wrapper.findAll('path')[1]!.attributes('d')!)
    expect(bar.w).toBeGreaterThan(bar.h)
  })

  it('keeps the axis anchored at zero in both orientations', async () => {
    for (const orientation of ['vertical', 'horizontal'] as const) {
      const wrapper = await mountChart({ orientation })
      expect(wrapper.findAll('text').map(node => node.text())).toContain('0')
    }
  })

  it('survives an empty series', async () => {
    const wrapper = await mountChart({ data: [] })
    expect(wrapper.findAll('path')).toHaveLength(0)
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
  })
})

const stackData = [
  { label: 'Jan', a: 100, b: 200, c: 300 },
  { label: 'Feb', a: 150, b: 150, c: 300 },
]
const stackSeries = [{ key: 'a', name: 'A' }, { key: 'b', name: 'B' }, { key: 'c', name: 'C' }]

describe('stacked bars', () => {
  /** The axis has to fit the total, or the top of every stack is clipped. */
  it('sizes the axis against the running total, not the largest reading', async () => {
    const grouped = await mountChart({ data: stackData, series: stackSeries })
    const stacked = await mountChart({ data: stackData, series: stackSeries, stacked: true })

    const top = (w: typeof grouped) =>
      Math.max(...w.findAll('text').map(n => Number(n.text().replace(/,/g, ''))).filter(Number.isFinite))

    expect(top(stacked)).toBeGreaterThanOrEqual(600)
    expect(top(grouped)).toBeLessThan(600)
  })

  it('puts one bar per category rather than one per series', async () => {
    const stacked = await mountChart({ data: stackData, series: stackSeries, stacked: true })
    // Still three segments per category, but sharing a single band slot.
    expect(stacked.findAll('path')).toHaveLength(6)

    const xs = stacked.findAll('path').map(p => p.attributes('d')!.match(/M([\d.]+)/)![1])
    // Two distinct x positions — one stack per category.
    expect(new Set(xs).size).toBe(2)
  })

  it('rounds only the outermost segment', async () => {
    const wrapper = await mountChart({ data: stackData, series: stackSeries, stacked: true })
    const curved = wrapper.findAll('path').filter(p => p.attributes('d')!.includes('Q'))
    // One capped segment per category.
    expect(curved).toHaveLength(2)
  })

  it('reports the total alongside the parts', async () => {
    const wrapper = await mountChart({ data: stackData, series: stackSeries, stacked: true })
    await wrapper.findAll('rect')[0]!.trigger('pointerenter')

    // The tooltip is the only div positioned by an inline style. Taking the
    // last div instead broke as soon as the chart gained another one.
    const tooltip = wrapper.findAll('div').find(d => d.attributes('style')?.includes('left'))!
    expect(tooltip.text()).toContain('Total')
    expect(tooltip.text()).toContain('600')
  })

  it('stacks negatives away from zero instead of cancelling them out', async () => {
    const mixed = [{ label: 'Jan', a: 100, b: -50 }]
    const wrapper = await mountChart({
      data: mixed,
      series: [{ key: 'a', name: 'A' }, { key: 'b', name: 'B' }],
      stacked: true,
    })

    const ticks = wrapper.findAll('text').map(n => n.text())
    // Both directions are on the axis; they do not net to a single 50.
    expect(ticks).toContain('0')
    expect(ticks.some(t => t.startsWith('-'))).toBe(true)
  })

  it('ignores stacking for a single series', async () => {
    const wrapper = await mountChart({ stacked: true })
    expect(wrapper.findAll('path')).toHaveLength(3)
  })

  it('stacks horizontally too', async () => {
    const wrapper = await mountChart({
      data: stackData,
      series: stackSeries,
      stacked: true,
      orientation: 'horizontal',
    })
    expect(wrapper.findAll('path')).toHaveLength(6)

    // Segments run along x, so each is wider than it is tall.
    const d = wrapper.get('path').attributes('d')!
    const xs = [...d.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])] as const)
    const w = Math.max(...xs.map(p => p[0])) - Math.min(...xs.map(p => p[0]))
    const h = Math.max(...xs.map(p => p[1])) - Math.min(...xs.map(p => p[1]))
    expect(w).toBeGreaterThan(0)
    expect(h).toBeGreaterThan(0)
  })
})
