import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { DonutChart } from '../src'

const data = [
  { label: 'Direct', value: 4200 },
  { label: 'Referral', value: 2800 },
  { label: 'Organic', value: 3000 },
]

/**
 * The DOM stub reports every element as zero-width, so nothing would ever be
 * plotted. Give the whole document a width and the component measures 600px
 * exactly as it would in a browser.
 */
function withWidth(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: width, configurable: true })
}

type Point = [number, number]

/**
 * The four corners of a sector, read back off its path. Both shapes it can
 * take are fixed strings — an annulus of `M A L A Z`, or a pie's `M L A Z`
 * pivoting on the centre — so the numbers are positional.
 */
function corners(d: string) {
  const n = d.match(/-?[\d.]+/g)!.map(Number)
  // The pie form is shorter, and both its inner corners are the slice's tip.
  if (n.length < 18) {
    const tip: Point = [n[9]!, n[10]!]
    return {
      outerStart: [n[0]!, n[1]!] as Point,
      outerEnd: [n[7]!, n[8]!] as Point,
      innerStart: tip,
      innerEnd: tip,
    }
  }
  return {
    outerStart: [n[0]!, n[1]!] as Point,
    outerEnd: [n[7]!, n[8]!] as Point,
    innerStart: [n[16]!, n[17]!] as Point,
    innerEnd: [n[9]!, n[10]!] as Point,
  }
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

/** The measurement lands in a post-flush watcher, so let it settle. */
async function mountChart(props: Record<string, unknown> = {}) {
  withWidth(600)
  // Geometry, not motion: the reveal recomputes the arcs, so these mount
  // with it off and assert the settled ring.
  const wrapper = mount(DonutChart, { props: { data, animate: false, ...props }, attachTo: document.body })
  await nextTick()
  return wrapper
}

describe('donutChart', () => {
  it('exposes the data as a table for assistive tech', async () => {
    const wrapper = await mountChart({ label: 'Traffic by source' })

    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBe('figure')
    expect(wrapper.attributes('aria-label')).toBe('Traffic by source')

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
    expect(rows[0]!.text()).toContain('Direct')
    expect(rows[0]!.text()).toContain('4,200')
  })

  /** The reading a donut is for: the part, not the number. */
  it('states every slice as a share of the whole', async () => {
    const wrapper = await mountChart({ data: [{ label: 'A', value: 3 }, { label: 'B', value: 1 }] })
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0]!.text()).toContain('75%')
    expect(rows[1]!.text()).toContain('25%')
  })

  /**
   * A percent is a proportion, so it has to survive `format` being aimed at
   * the values — currency options applied to `0.75` would render it as money.
   */
  it('keeps the share a percent whatever the values are formatted as', async () => {
    const wrapper = await mountChart({
      data: [{ label: 'A', value: 3 }, { label: 'B', value: 1 }],
      format: { style: 'currency', currency: 'EUR' },
    })
    const row = wrapper.get('tbody tr').text()
    expect(row).toContain('€3.00')
    expect(row).toContain('75%')
  })

  it('draws one sector per slice', async () => {
    const wrapper = await mountChart()
    expect(wrapper.findAll('path')).toHaveLength(3)
  })

  /**
   * An arc whose ends meet is a path of zero length, so a lone slice drawn as
   * a sector renders nothing at all. It becomes a circle instead.
   */
  it('draws a single slice as a whole circle', async () => {
    const wrapper = await mountChart({ data: [{ label: 'Only', value: 10 }] })
    expect(wrapper.findAll('path')).toHaveLength(0)
    const circle = wrapper.get('circle')
    expect(circle.attributes('fill')).toBe('none')
    expect(Number(circle.attributes('stroke-width'))).toBeGreaterThan(0)
  })

  /** A pie is the same circle with the hole filled in. */
  it('fills the middle when asked for a pie', async () => {
    const wrapper = await mountChart({ data: [{ label: 'Only', value: 10 }], pie: true })
    const circle = wrapper.get('circle')
    expect(circle.attributes('stroke')).toBe('none')
    expect(circle.attributes('fill')).not.toBe('none')
  })

  it('drops a missing reading rather than drawing it as a zero slice', async () => {
    const wrapper = await mountChart({
      data: [{ label: 'A', value: null }, { label: 'B', value: 10 }, { label: 'C', value: 10 }],
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).not.toContain('A')
  })

  /** A share of a whole cannot be negative, and silently vanishing is worse. */
  it('drops a negative value and says so', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = await mountChart({
      data: [{ label: 'A', value: -5 }, { label: 'B', value: 10 }, { label: 'C', value: 10 }],
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('hands the centre slot the total', async () => {
    const wrapper = mount(DonutChart, {
      props: { data, animate: false },
      slots: { center: '<span>{{ params.formatted }}</span>' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.text()).toContain('10,000')
  })

  /**
   * Thickness past the radius would give a negative inner radius, which SVG
   * draws as a ring turned inside out rather than as the solid disc meant.
   */
  it('clamps an over-thick ring to a solid disc', async () => {
    const wrapper = await mountChart({ data: [{ label: 'Only', value: 10 }], thickness: 9999 })
    const circle = wrapper.get('circle')
    expect(Number(circle.attributes('r'))).toBeGreaterThan(0)
    expect(circle.attributes('fill')).not.toBe('none')
    expect(circle.attributes('stroke')).toBe('none')
  })

  /**
   * The divider between two slices has to be the same width at the hole as at
   * the rim. Trimming both edges by a fixed *angle* tapers it into a wedge,
   * which is what this is here to catch.
   */
  it('keeps the gap between slices an even width across the ring', async () => {
    const wrapper = await mountChart({ data: [{ label: 'A', value: 1 }, { label: 'B', value: 1 }] })
    const [first, second] = wrapper.findAll('path').map(node => corners(node.attributes('d')!))

    const outerGap = distance(first!.outerEnd, second!.outerStart)
    const innerGap = distance(first!.innerStart, second!.innerEnd)

    expect(outerGap).toBeCloseTo(2, 1)
    expect(innerGap).toBeCloseTo(outerGap, 1)
  })

  /**
   * A pie gets the same even gap, which means its slices cannot run all the
   * way to the centre: two edges held a fixed distance off their radii meet
   * short of it, and that is where the slice ends.
   */
  it('gives a pie the same even gap, and a blunt tip to keep it', async () => {
    const wrapper = await mountChart({
      data: [{ label: 'A', value: 1 }, { label: 'B', value: 1 }],
      pie: true,
    })
    const [first, second] = wrapper.findAll('path').map(node => corners(node.attributes('d')!))

    expect(distance(first!.outerEnd, second!.outerStart)).toBeCloseTo(2, 1)
    // Half a gap out from the middle, for a slice split down the diameter.
    expect(distance(first!.innerStart, [300, 120])).toBeCloseTo(1, 1)
  })

  it('takes the gap width from the caller, and closes it at zero', async () => {
    const two = [{ label: 'A', value: 1 }, { label: 'B', value: 1 }]

    const wide = await mountChart({ data: two, gap: 10 })
    const [first, second] = wide.findAll('path').map(node => corners(node.attributes('d')!))
    expect(distance(first!.outerEnd, second!.outerStart)).toBeCloseTo(10, 1)
    expect(distance(first!.innerStart, second!.innerEnd)).toBeCloseTo(10, 1)

    const closed = await mountChart({ data: two, gap: 0 })
    const [a, b] = closed.findAll('path').map(node => corners(node.attributes('d')!))
    expect(distance(a!.outerEnd, b!.outerStart)).toBeCloseTo(0, 1)
  })

  it('shows a legend from the labels, and drops it when asked', async () => {
    expect((await mountChart()).text()).toContain('Referral')
    expect((await mountChart({ legend: false })).find('ul').exists()).toBe(false)
  })
})
