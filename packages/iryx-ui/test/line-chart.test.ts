import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { cartesianLayout, LineChart } from '../src'

describe('cartesianLayout', () => {
  const base = {
    categories: 3,
    longestLabel: 3,
    width: 600,
    height: 240,
    tickCount: 5,
    showAxis: true,
    formatTick: (value: number) => String(value),
    includeZero: true,
  }

  it('reserves a gutter wide enough for its own tick labels', () => {
    const narrow = cartesianLayout({ ...base, values: [1, 2, 3] })
    const wide = cartesianLayout({ ...base, values: [1_000_000, 2_000_000] })
    expect(wide.plot.left).toBeGreaterThan(narrow.plot.left)
  })

  it('gives the whole width to the plot when the axis is off', () => {
    const layout = cartesianLayout({ ...base, values: [1, 2], showAxis: false })
    expect(layout.plot.left).toBe(0)
    expect(layout.plot.width).toBe(600)
  })

  /** Bars need zero; lines are read by shape and a forced zero flattens them. */
  it('only forces zero into the domain when asked', () => {
    const forced = cartesianLayout({ ...base, values: [8000, 8600] })
    expect(forced.ticks[0]).toBe(0)

    const free = cartesianLayout({ ...base, values: [8000, 8600], includeZero: false })
    expect(free.ticks[0]).toBeGreaterThan(0)
  })

  it('spaces bands evenly and centres them', () => {
    const layout = cartesianLayout({ ...base, values: [1, 2, 3], showAxis: false })
    expect(layout.bandWidth).toBe(200)
    expect(layout.bandCentre(0)).toBe(100)
    expect(layout.bandCentre(2)).toBe(500)
  })

  it('thins labels only when they would collide', () => {
    const roomy = cartesianLayout({ ...base, values: [1, 2, 3] })
    expect(roomy.labelStep).toBe(1)

    const cramped = cartesianLayout({ ...base, values: [1, 2, 3], categories: 60, longestLabel: 8 })
    expect(cramped.labelStep).toBeGreaterThan(1)
  })

  it('survives a zero width without producing negative geometry', () => {
    const layout = cartesianLayout({ ...base, values: [1, 2], width: 0 })
    expect(layout.plot.width).toBe(0)
    expect(layout.plot.height).toBeGreaterThanOrEqual(0)
  })
})

const data = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5600 },
  { label: 'Mar', value: 3100 },
]

function withWidth(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: width, configurable: true })
}

async function mountChart(props: Record<string, unknown> = {}) {
  withWidth(600)
  const wrapper = mount(LineChart, { props: { data, ...props }, attachTo: document.body })
  await nextTick()
  return wrapper
}

describe('lineChart', () => {
  it('draws one path through the series', async () => {
    const wrapper = await mountChart()
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(1)
    expect(paths[0]!.attributes('d')).toMatch(/^M[\d.]+ [\d.]+ L/)
  })

  it('breaks the line at a gap instead of bridging it', async () => {
    const wrapper = await mountChart({
      data: [{ label: 'Jan', value: 1 }, { label: 'Feb', value: null }, { label: 'Mar', value: 3 }],
    })
    expect(wrapper.findAll('path')).toHaveLength(2)
  })

  it('adds a wash under the line for the area variant', async () => {
    const wrapper = await mountChart({ variant: 'area' })
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(2)
    expect(paths[0]!.attributes('d')).toContain('Z')
  })

  it('exposes the data as a table for assistive tech', async () => {
    const wrapper = await mountChart({ label: 'Revenue by month' })
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBe('figure')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.get('tbody tr').text()).toContain('4,200')
  })

  it('shows a missing reading as absent, not as zero', async () => {
    const wrapper = await mountChart({ data: [{ label: 'Jan', value: null }] })
    expect(wrapper.get('tbody tr').text()).toContain('—')
  })

  /** A line hovering near 8,000 flattens to a straight edge if zero is forced. */
  it('does not force zero onto the axis by default', async () => {
    const high = [{ label: 'Jan', value: 8000 }, { label: 'Feb', value: 8600 }]
    const free = await mountChart({ data: high })
    expect(free.findAll('text').map(node => node.text())).not.toContain('0')

    const forced = await mountChart({ data: high, zero: true })
    expect(forced.findAll('text').map(node => node.text())).toContain('0')
  })

  it('shows a crosshair and one marker on hover, not a dot per point', async () => {
    const wrapper = await mountChart()
    expect(wrapper.findAll('circle')).toHaveLength(0)

    await wrapper.findAll('rect')[1]!.trigger('pointerenter')
    // Ring plus marker for the hovered reading only.
    expect(wrapper.findAll('circle')).toHaveLength(2)
    expect(wrapper.findAll('line').some(node => node.attributes('x1') === node.attributes('x2'))).toBe(true)
    expect(wrapper.text()).toContain('Feb')
  })

  it('shows no marker for a category with no reading', async () => {
    const wrapper = await mountChart({
      data: [{ label: 'Jan', value: 1 }, { label: 'Feb', value: null }],
    })
    await wrapper.findAll('rect')[1]!.trigger('pointerenter')
    expect(wrapper.findAll('circle')).toHaveLength(0)
  })

  it('survives an empty series', async () => {
    const wrapper = await mountChart({ data: [] })
    expect(wrapper.findAll('path')).toHaveLength(0)
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
  })
})
