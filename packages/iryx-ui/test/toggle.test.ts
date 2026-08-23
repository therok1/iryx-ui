import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Toggle } from '../src'

/**
 * Reka renders a hidden form input as a sibling of the button, so the
 * component has two root nodes and `wrapper.element` is the fragment rather
 * than the toggle. Every assertion has to go through the button itself.
 */
function control(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('button')
}

describe('toggle', () => {
  it('starts off and reports it', () => {
    const wrapper = mount(Toggle, { slots: { default: 'Bold' } })
    expect(control(wrapper).attributes('data-state')).toBe('off')
    expect(control(wrapper).attributes('aria-pressed')).toBe('false')
  })

  it('takes a default value when uncontrolled', () => {
    const wrapper = mount(Toggle, { props: { defaultValue: true } })
    expect(control(wrapper).attributes('aria-pressed')).toBe('true')
  })

  it('emits on click', async () => {
    const wrapper = mount(Toggle, { props: { modelValue: false } })
    await control(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('reflects modelValue changes from the parent', async () => {
    const wrapper = mount(Toggle, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    expect(control(wrapper).attributes('data-state')).toBe('on')
  })

  it('renders its slot content', () => {
    expect(mount(Toggle, { slots: { default: 'Bold' } }).text()).toBe('Bold')
  })

  // The heights are shared with IButton so the two line up side by side.
  it('matches the button heights', () => {
    expect(control(mount(Toggle, { props: { size: 'sm' } })).classes()).toContain('h-8')
    expect(control(mount(Toggle, { props: { size: 'xl' } })).classes()).toContain('h-12')
  })

  it('squares itself for icon-only use', () => {
    const classes = control(mount(Toggle, { props: { square: true, size: 'md' } })).classes()
    expect(classes).toContain('w-9')
    expect(classes).toContain('px-0')
  })

  // One look, so the pressed treatment is on the base rather than a variant.
  it('reads as a button pressed or not', () => {
    const classes = control(mount(Toggle)).classes()
    expect(classes).toContain('border-border')
    expect(classes).toContain('bg-input')
    expect(classes).toContain('data-[state=on]:bg-accent')
  })

  /*
   * Same mechanism as `IButton`: a label is a bare text node, so
   * `:first-child` cannot tell which side the icon is on — the marker can.
   */
  it('tightens the padding on the side a marked icon sits on', () => {
    const classes = control(mount(Toggle, { props: { size: 'md' } })).classes()
    expect(classes).toContain('px-4')
    expect(classes).toContain('has-[[data-icon=inline-start]]:pl-3')
    expect(classes).toContain('has-[[data-icon=inline-end]]:pr-3')
  })

  it('zeroes the icon padding when square, where there is none to tighten', () => {
    expect(control(mount(Toggle, { props: { square: true, size: 'md' } })).classes())
      .toContain('has-[[data-icon]]:px-0')
  })

  it('does not respond while disabled', async () => {
    const wrapper = mount(Toggle, { props: { modelValue: false, disabled: true } })
    await control(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // Two root nodes mean Vue cannot auto-inherit; an icon-only toggle's name
  // depends on this reaching the button.
  it('forwards attributes to the button', () => {
    const wrapper = mount(Toggle, { props: { square: true }, attrs: { 'aria-label': 'Bold' } })
    expect(control(wrapper).attributes('aria-label')).toBe('Bold')
  })

  it('drops every built-in class when unstyled', () => {
    expect(control(mount(Toggle, { props: { unstyled: true } })).classes()).toHaveLength(0)
  })

  it('merges a custom class over the variant', () => {
    const classes = control(mount(Toggle, { props: { size: 'md', class: 'h-20' } })).classes()
    expect(classes).toContain('h-20')
    expect(classes).not.toContain('h-9')
  })
})
