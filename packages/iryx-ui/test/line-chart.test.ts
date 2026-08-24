import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
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

  /**
   * Horizontal ticks are centred on their gridline and the last gridline sits
   * at the plot's right edge, so half of `20,000` hangs off the chart unless
   * the plot stops short of it.
   */
  it('leaves room for the last tick label when horizontal', () => {
    const vertical = cartesianLayout({ ...base, values: [0, 20000] })
    const horizontal = cartesianLayout({ ...base, values: [0, 20000], orientation: 'horizontal' })

    expect(vertical.plot.left + vertical.plot.width).toBe(600)
    expect(horizontal.plot.left + horizontal.plot.width).toBeLessThan(600)
  })

  it('reserves no right padding when the axis is hidden', () => {
    const layout = cartesianLayout({
      ...base,
      values: [0, 20000],
      orientation: 'horizontal',
      showAxis: false,
    })
    expect(layout.plot.left + layout.plot.width).toBe(600)
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

/**
 * The answer to "does it have plugins": no registry, a scoped slot. The layout
 * goes to the caller and they write ordinary SVG into it.
 */
describe('chart annotations', () => {
  it('hands the layout to the overlay slot', async () => {
    withWidth(600)
    const wrapper = mount(LineChart, {
      props: { data },
      slots: {
        overlay: `<template #overlay="{ plot, value }">
          <line class="target" :x1="plot.left" :y1="value(5000)" :x2="plot.left + plot.width" :y2="value(5000)" />
        </template>`,
      },
      attachTo: document.body,
    })
    await nextTick()

    const target = wrapper.get('line.target')
    // Positioned by the chart's own scale, not by the caller guessing pixels.
    expect(Number(target.attributes('y1'))).toBeGreaterThan(0)
    expect(target.attributes('x1')).not.toBe('0')
  })

  it('draws the underlay behind the marks and the overlay in front', async () => {
    withWidth(600)
    const wrapper = mount(LineChart, {
      props: { data },
      slots: {
        underlay: '<rect class="band" />',
        overlay: '<rect class="note" />',
      },
      attachTo: document.body,
    })
    await nextTick()

    const order = [...wrapper.element.querySelectorAll('svg *')]
    const band = order.findIndex(node => node.classList.contains('band'))
    const line = order.findIndex(node => node.tagName === 'path')
    const note = order.findIndex(node => node.classList.contains('note'))

    expect(band).toBeLessThan(line)
    expect(note).toBeGreaterThan(line)
  })

  /** Annotations must not swallow the pointer, or hovering silently dies. */
  it('keeps hit targets above the annotations', async () => {
    withWidth(600)
    const wrapper = mount(LineChart, {
      props: { data },
      slots: { overlay: '<rect class="note" />' },
      attachTo: document.body,
    })
    await nextTick()

    const order = [...wrapper.element.querySelectorAll('svg *')]
    const note = order.findIndex(node => node.classList.contains('note'))
    const lastHit = order.map(node => node.tagName).lastIndexOf('rect')

    expect(lastHit).toBeGreaterThan(note)
  })

  it('renders nothing extra when the slots are unused', async () => {
    const wrapper = await mountChart()
    expect(wrapper.findAll('rect')).toHaveLength(data.length)
  })
})

const multi = [
  { label: 'Jan', revenue: 4200, expenses: 3100 },
  { label: 'Feb', revenue: 5600, expenses: 3400 },
]
const twoSeries = [{ key: 'revenue', name: 'Revenue' }, { key: 'expenses', name: 'Expenses' }]

describe('multi-series charts', () => {
  it('draws one line per series, each in its own slot colour', async () => {
    const wrapper = await mountChart({ data: multi, series: twoSeries })
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(2)

    const colors = paths.map(path => path.attributes('style'))
    expect(colors[0]).toContain('--iryx-chart-1')
    expect(colors[1]).toContain('--iryx-chart-2')
  })

  /**
   * Colour alone is never a dependable identity channel, so the legend is not
   * optional once there are two series to tell apart.
   */
  it('forces a legend on for two or more series', async () => {
    const wrapper = await mountChart({ data: multi, series: twoSeries, legend: false })
    expect(wrapper.get('ul').text()).toContain('Revenue')
    expect(wrapper.get('ul').text()).toContain('Expenses')
  })

  it('leaves the legend off for a single unnamed series', async () => {
    const wrapper = await mountChart()
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('gives the table a column per series', async () => {
    const wrapper = await mountChart({ data: multi, series: twoSeries, label: 'Money' })
    expect(wrapper.findAll('thead th').map(th => th.text())).toEqual(['Category', 'Revenue', 'Expenses'])
    expect(wrapper.get('tbody tr').text()).toContain('4,200')
    expect(wrapper.get('tbody tr').text()).toContain('3,100')
  })

  it('reports every series in one tooltip', async () => {
    const wrapper = await mountChart({ data: multi, series: twoSeries })
    await wrapper.findAll('rect')[0]!.trigger('pointerenter')

    // The tooltip is the only div positioned by an inline style. Taking the
    // last div instead broke as soon as the chart gained another one.
    const tooltip = wrapper.findAll('div').find(d => d.attributes('style')?.includes('left'))!
    expect(tooltip.text()).toContain('Revenue')
    expect(tooltip.text()).toContain('Expenses')
    expect(tooltip.text()).toContain('4,200')
  })

  it('marks every series at the hovered category', async () => {
    const wrapper = await mountChart({ data: multi, series: twoSeries })
    await wrapper.findAll('rect')[0]!.trigger('pointerenter')
    // Ring plus dot, per series.
    expect(wrapper.findAll('circle')).toHaveLength(4)
  })

  it('skips a series that has no reading at the hovered category', async () => {
    const wrapper = await mountChart({
      data: [{ label: 'Jan', revenue: 4200, expenses: null }],
      series: twoSeries,
    })
    await wrapper.findAll('rect')[0]!.trigger('pointerenter')
    expect(wrapper.findAll('circle')).toHaveLength(2)
  })

  /** Overlapping washes muddy into a colour that belongs to neither series. */
  it('drops the area wash once there is more than one series', async () => {
    const single = await mountChart({ variant: 'area' })
    expect(single.findAll('path')).toHaveLength(2)

    const many = await mountChart({ data: multi, series: twoSeries, variant: 'area' })
    expect(many.findAll('path')).toHaveLength(2) // two lines, no washes
  })

  /**
   * Colour follows the entity, never its rank. Without a pinned slot the
   * survivor of a filter inherits the removed series' colour, and the reader
   * has to relearn the chart every time a filter changes.
   */
  it('repaints the survivor when slots are left to position', async () => {
    const wrapper = await mountChart({ data: multi, series: twoSeries })
    const before = wrapper.findAll('path')[1]!.attributes('style')

    await wrapper.setProps({ series: [twoSeries[1]!] })
    expect(wrapper.findAll('path')[0]!.attributes('style')).not.toBe(before)
  })

  it('holds a pinned slot when another series is filtered out', async () => {
    const pinned = [
      { key: 'revenue', name: 'Revenue', slot: 0 },
      { key: 'expenses', name: 'Expenses', slot: 1 },
    ]
    const wrapper = await mountChart({ data: multi, series: pinned })
    const before = wrapper.findAll('path')[1]!.attributes('style')

    await wrapper.setProps({ series: [pinned[1]!] })
    expect(wrapper.findAll('path')[0]!.attributes('style')).toBe(before)
    expect(before).toContain('--iryx-chart-2')
  })

  it('warns rather than silently reusing a colour past the eighth slot', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const nine = Array.from({ length: 9 }, (_, index) => ({ key: `s${index}`, name: `S${index}` }))
    const row = Object.fromEntries(nine.map((entry, index) => [entry.key, index + 1]))

    await mountChart({ data: [{ label: 'Jan', ...row }], series: nine })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('exceeds the 8 categorical slots'))
    warn.mockRestore()
  })
})
