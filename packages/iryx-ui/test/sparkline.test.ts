import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { extent, finiteValues, linearScale, Sparkline } from '../src'

describe('scale helpers', () => {
  it('finds an extent, ignoring gaps and non-finite values', () => {
    expect(extent([3, null, 9, undefined, 1, Number.NaN])).toEqual([1, 9])
    expect(finiteValues([1, null, Number.POSITIVE_INFINITY, 2])).toEqual([1, 2])
  })

  it('has no extent when there is nothing to measure', () => {
    expect(extent([])).toBeUndefined()
    expect(extent([null, undefined])).toBeUndefined()
  })

  it('maps a domain onto a range, including inverted ranges', () => {
    const up = linearScale([0, 10], [0, 100])
    expect(up(0)).toBe(0)
    expect(up(5)).toBe(50)

    // SVG y grows downward, so charts invert the range rather than the data.
    const down = linearScale([0, 10], [100, 0])
    expect(down(0)).toBe(100)
    expect(down(10)).toBe(0)
  })

  /** A flat series should draw through the middle, not divide by zero. */
  it('sends a zero-width domain to the middle of the range', () => {
    const flat = linearScale([5, 5], [100, 0])
    expect(flat(5)).toBe(50)
    expect(Number.isFinite(flat(5))).toBe(true)
  })
})

describe('sparkline', () => {
  it('draws one line through the data', () => {
    const wrapper = mount(Sparkline, { props: { data: [1, 5, 3] } })
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(1)

    // Highest value pinned to the top, lowest to the bottom.
    expect(paths[0]!.attributes('d')).toBe('M0 100 L50 0 L100 50')
  })

  it('keeps strokes immune to the non-uniform stretch', () => {
    const wrapper = mount(Sparkline, { props: { data: [1, 2] } })
    expect(wrapper.attributes('preserveAspectRatio')).toBe('none')
    expect(wrapper.get('path').attributes('vector-effect')).toBe('non-scaling-stroke')
  })

  it('breaks the line at a gap instead of bridging it', () => {
    const wrapper = mount(Sparkline, { props: { data: [1, null, 3] } })
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(2)
    expect(paths[0]!.attributes('d')).not.toContain('L')
  })

  it('renders nothing for an empty series', () => {
    expect(mount(Sparkline, { props: { data: [] } }).findAll('path')).toHaveLength(0)
    expect(mount(Sparkline, { props: { data: [null, null] } }).findAll('path')).toHaveLength(0)
  })

  it('centres a flat series rather than dropping it to an edge', () => {
    const wrapper = mount(Sparkline, { props: { data: [4, 4, 4] } })
    expect(wrapper.get('path').attributes('d')).toBe('M0 50 L50 50 L100 50')
  })

  it('places a single reading in the middle', () => {
    const wrapper = mount(Sparkline, { props: { data: [7] } })
    expect(wrapper.get('path').attributes('d')).toBe('M50 50')
  })

  it('adds a wash under the line for the area variant', () => {
    const wrapper = mount(Sparkline, { props: { data: [1, 5, 3], variant: 'area' } })
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(2)
    // Closed back down to the baseline.
    expect(paths[0]!.attributes('d')).toContain('Z')
    expect(paths[0]!.classes().join(' ')).toContain('opacity-10')
  })

  it('closes an area to zero when asked and zero is in range', () => {
    const wrapper = mount(Sparkline, {
      props: { data: [-5, 5], variant: 'area', baseline: 'zero' },
    })
    expect(wrapper.findAll('path')[0]!.attributes('d')).toContain('L100 50 L0 50 Z')
  })

  /** Ring first, then the dot on top — both round caps on zero-length paths. */
  it('marks the last point with a ringed dot', () => {
    const wrapper = mount(Sparkline, { props: { data: [1, 5, 3], endDot: true } })
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(3)

    expect(paths[1]!.attributes('stroke-width')).toBe('12')
    expect(paths[2]!.attributes('stroke-width')).toBe('8')
    expect(paths[2]!.attributes('d')).toBe('M100 50 L100 50')
  })

  it('shares a scale across sparklines when the domain is pinned', () => {
    const props = { min: 0, max: 10 } as const
    const low = mount(Sparkline, { props: { ...props, data: [0, 5] } })
    const high = mount(Sparkline, { props: { ...props, data: [5, 10] } })

    expect(low.get('path').attributes('d')).toBe('M0 100 L100 50')
    expect(high.get('path').attributes('d')).toBe('M0 50 L100 0')
  })

  it('is decorative unless given a label', () => {
    const bare = mount(Sparkline, { props: { data: [1, 2] } })
    expect(bare.attributes('aria-hidden')).toBe('true')
    expect(bare.attributes('role')).toBeUndefined()

    const described = mount(Sparkline, { props: { data: [1, 2], label: 'Revenue, up 12%' } })
    expect(described.attributes('role')).toBe('img')
    expect(described.attributes('aria-label')).toBe('Revenue, up 12%')
    expect(described.attributes('aria-hidden')).toBeUndefined()
  })

  it('renders no built-in classes when unstyled', () => {
    const wrapper = mount(Sparkline, { props: { data: [1, 2], unstyled: true, class: 'my-spark' } })
    expect(wrapper.attributes('class')).toBe('my-spark')
  })
})
