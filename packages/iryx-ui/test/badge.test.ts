import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Badge } from '../src'

describe('badge', () => {
  it('renders the label prop', () => {
    expect(mount(Badge, { props: { label: 'Paid' } }).text()).toBe('Paid')
  })

  it('lets the default slot win over the label prop', () => {
    const wrapper = mount(Badge, { props: { label: 'Ignored' }, slots: { default: 'Draft' } })
    expect(wrapper.text()).toBe('Draft')
  })

  it('renders a span by default and honours as', () => {
    expect(mount(Badge).element.tagName).toBe('SPAN')
    expect(mount(Badge, { props: { as: 'div' } }).element.tagName).toBe('DIV')
  })

  it('defaults to the neutral variant', () => {
    expect(mount(Badge).attributes('class')).toContain('bg-muted')
  })

  it('tints the surface, border and text per variant', () => {
    const success = mount(Badge, { props: { variant: 'success' } }).attributes('class') ?? ''
    expect(success).toContain('bg-success-muted')
    expect(success).toContain('border-success-border')
    expect(success).toContain('text-success-muted-foreground')
    expect(mount(Badge, { props: { variant: 'danger' } }).attributes('class'))
      .toContain('bg-danger-muted')
  })

  /*
   * The dotted look moves the colour off the badge and onto the dot, so a row
   * of mixed statuses reads as one family rather than five competing blocks.
   */
  it('goes neutral when dotted, colouring only the dot', () => {
    const wrapper = mount(Badge, { props: { variant: 'danger', dot: true, label: 'Overdue' } })
    const root = wrapper.attributes('class') ?? ''

    expect(root).toContain('bg-background')
    expect(root).toContain('border-border')
    expect(root).not.toContain('bg-danger-muted')
    expect(wrapper.get('[aria-hidden="true"]').attributes('class')).toContain('bg-danger')
  })

  /*
   * Status colours must come from theme tokens, which carry their own dark
   * values — a raw palette class here would ignore applyTheme() and need a
   * hand-written dark: counterpart.
   */
  it('styles every coloured variant from theme tokens, not raw palettes', () => {
    for (const variant of ['success', 'warning', 'danger', 'info'] as const) {
      const plain = mount(Badge, { props: { variant } })
      const classes = plain.attributes('class') ?? ''
      expect(classes).toContain(`-${variant}`)
      expect(classes).not.toMatch(/dark:|emerald|amber|red-|blue-/)

      const dotted = mount(Badge, { props: { variant, dot: true } })
      const dotClasses = dotted.get('[aria-hidden="true"]').attributes('class') ?? ''
      expect(dotClasses).toContain(`bg-${variant}`)
      expect(dotClasses).not.toMatch(/dark:|emerald|amber|red-|blue-/)
    }
  })

  it('renders the dot only when asked, and hides it from a11y', () => {
    expect(mount(Badge).find('[aria-hidden="true"]').exists()).toBe(false)
    const dotted = mount(Badge, { props: { dot: true, label: 'Sent' } })
    expect(dotted.get('[aria-hidden="true"]').attributes('class')).toContain('rounded-full')
  })

  it('merges the class prop and per-slot ui overrides', () => {
    const wrapper = mount(Badge, {
      props: { dot: true, class: 'ml-2', ui: { dot: 'size-4' } },
    })
    expect(wrapper.attributes('class')).toContain('ml-2')
    expect(wrapper.get('[aria-hidden="true"]').attributes('class')).toContain('size-4')
  })

  /*
   * Same rule as Button: the icon declares its position, because a label is a
   * bare text node that CSS's :first-child / :last-child cannot see past.
   */
  it('tightens the padding on the side an icon sits on', () => {
    for (const [size, start, end] of [
      ['sm', 'has-[[data-icon=inline-start]]:pl-1', 'has-[[data-icon=inline-end]]:pr-1'],
      ['md', 'has-[[data-icon=inline-start]]:pl-1.5', 'has-[[data-icon=inline-end]]:pr-1.5'],
      ['lg', 'has-[[data-icon=inline-start]]:pl-2', 'has-[[data-icon=inline-end]]:pr-2'],
    ] as const) {
      const classes = mount(Badge, { props: { size } }).attributes('class') ?? ''
      expect(classes).toContain(start)
      expect(classes).toContain(end)
    }
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Badge, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})
