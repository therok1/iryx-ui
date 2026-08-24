import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Stat } from '../src'

/**
 * The arrow is an inline SVG with no name in the DOM, so it is identified by
 * comparison: render a stat whose direction is not in doubt and check the
 * markup matches. That survives Hugeicons changing its path data, which
 * asserting on the `d` attribute would not.
 */
function arrow(props: Record<string, unknown>): string {
  return mount(Stat, { props: { label: 'Revenue', ...props } }).get('svg').html()
}

const arrowUp = arrow({ delta: 5 })
const arrowDown = arrow({ delta: -5 })
const arrowFlat = arrow({ delta: 0 })

describe('stat', () => {
  it('renders the label and value', () => {
    const wrapper = mount(Stat, { props: { label: 'Outstanding', value: '€31,551.15' } })
    expect(wrapper.text()).toContain('Outstanding')
    expect(wrapper.text()).toContain('€31,551.15')
  })

  it('signs the delta', () => {
    expect(mount(Stat, { props: { delta: 8.2 } }).text()).toContain('+8.2%')
    expect(mount(Stat, { props: { delta: -8.2 } }).text()).toContain('-8.2%')
  })

  it('draws a different arrow for up, down and flat', () => {
    expect(arrowUp).not.toBe(arrowDown)
    expect(arrowFlat).not.toBe(arrowUp)
    expect(arrowFlat).not.toBe(arrowDown)
  })

  it('colours a rise as good and a fall as bad by default', () => {
    expect(mount(Stat, { props: { delta: 5 } }).get('span.text-success').exists()).toBe(true)
    expect(mount(Stat, { props: { delta: -5 } }).find('span.text-success').exists()).toBe(false)
  })

  /*
   * `trend` says whether the move was *good*, which the sign cannot tell on
   * its own — a falling overdue total is a win. It must not turn the arrow
   * around: "↑ -14%" reads as a bug rather than as nuance.
   */
  it('colours by trend while the arrow still follows the sign', () => {
    const wrapper = mount(Stat, { props: { label: 'Overdue', delta: -14, trend: 'up' } })
    expect(wrapper.text()).toContain('-14%')
    expect(wrapper.get('svg').html()).toBe(arrowDown)
    expect(wrapper.get('span.text-success').exists()).toBe(true)
  })

  it('takes a formatter for deltas that are not percentages', () => {
    const wrapper = mount(Stat, {
      props: { label: 'Signups', delta: 12, formatDelta: (d: number) => `${d} new` },
    })
    expect(wrapper.text()).toContain('12 new')
  })
})
