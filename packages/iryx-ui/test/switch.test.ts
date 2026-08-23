import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Switch } from '../src'

/**
 * Reka's `SwitchRoot` renders the hidden form input as a sibling of the button
 * (reka-ui 2.10, to fix a `nested-interactive` violation), so the component has
 * two root nodes and `wrapper.element` is the fragment, not the switch. Every
 * assertion has to go through the control itself.
 */
function control(wrapper: VueWrapper<any>) {
  return wrapper.get('[role="switch"]')
}

describe('switch', () => {
  it('renders unchecked by default', () => {
    expect(control(mount(Switch)).attributes('data-state')).toBe('unchecked')
  })

  // Was an offset outline; now the same ring every other control uses.
  it('rings on focus, however focus arrived', () => {
    const classes = control(mount(Switch)).attributes('class') ?? ''
    expect(classes).toContain('focus:ring-2')
    expect(classes).toContain('focus:ring-primary/50')
    expect(classes).not.toContain('outline-primary')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    await control(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('reflects modelValue changes from the parent', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    expect(control(wrapper).attributes('data-state')).toBe('unchecked')
    await wrapper.setProps({ modelValue: true })
    expect(control(wrapper).attributes('data-state')).toBe('checked')
  })

  it('applies ui slot overrides', () => {
    const wrapper = mount(Switch, { props: { ui: { root: 'h-8' } } })
    expect(control(wrapper).classes()).toContain('h-8')
    expect(control(wrapper).classes()).not.toContain('h-5')
  })

  it('stays bare when no label or description is given', () => {
    const wrapper = mount(Switch)
    expect(wrapper.find('[role="switch"]').exists()).toBe(true)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders a label wired to the control', () => {
    const wrapper = mount(Switch, { props: { label: 'Notifications' } })
    const label = wrapper.get('label')
    expect(label.text()).toBe('Notifications')
    expect(label.attributes('for')).toBe(control(wrapper).attributes('id'))
  })

  it('renders a description and links it via aria-describedby', () => {
    const wrapper = mount(Switch, {
      props: { label: 'Notifications', description: 'Push alerts to your phone.' },
    })
    const describedBy = control(wrapper).attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.get(`#${describedBy}`).text()).toBe('Push alerts to your phone.')
  })

  it('still toggles when labelled', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, label: 'Wifi' } })
    await control(wrapper).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  /*
   * A two-root component cannot auto-inherit attributes, so `inheritAttrs` is
   * off and `$attrs` is bound to the switch by hand. Without that, these are
   * dropped with a warning — and in the labelled layout they used to land on
   * the wrapper div rather than the control.
   */
  it.each([['bare', undefined], ['labelled', 'Wifi']])(
    'passes plain attributes through to the control (%s)',
    (_name, label) => {
      const wrapper = mount(Switch, {
        props: { label },
        attrs: { 'data-testid': 'toggle' },
      })
      expect(control(wrapper).attributes('data-testid')).toBe('toggle')
    },
  )

  /*
   * Track, thumb and travel are one measurement split across three classes:
   * the checked offset must equal `track − thumb − 2px` so the thumb rests 2px
   * inside the far edge exactly as it starts 2px inside the near one. Nothing
   * else notices when one of the three is changed without the others — the
   * switch just looks subtly wrong at one size.
   */
  it.each([
    { size: 'sm' as const, track: 'w-7', thumb: 'size-3', travel: 'translate-x-3.5' },
    { size: 'md' as const, track: 'w-9', thumb: 'size-4', travel: 'translate-x-4.5' },
    { size: 'lg' as const, track: 'w-11', thumb: 'size-5', travel: 'translate-x-5.5' },
  ])('sizes the $size track, thumb and travel together', ({ size, track, thumb, travel }) => {
    const wrapper = mount(Switch, { props: { size } })
    const root = control(wrapper)

    expect(root.classes()).toContain(track)

    const thumbClasses = wrapper.get('[role="switch"] > *').classes()
    expect(thumbClasses).toContain(thumb)
    expect(thumbClasses).toContain(`data-[state=checked]:${travel}`)
    // The resting inset is shared across sizes.
    expect(thumbClasses).toContain('data-[state=unchecked]:translate-x-0.5')
  })

  it('defaults to md and keeps size off the DOM node', () => {
    const wrapper = mount(Switch, { props: { size: 'lg' } })
    expect(control(wrapper).attributes('size')).toBeUndefined()
    expect(control(mount(Switch)).classes()).toContain('w-9')
  })

  /*
   * A 16px `sm` track against the label's 20px line box needs the nudge to
   * centre; `md` already matches it and `lg` is taller, so a nudge there would
   * push the track below the text instead of centring it.
   */
  it('nudges only the sm track down when there is a label', () => {
    expect(mount(Switch, { props: { size: 'sm', label: 'On' } }).get('[role="switch"]').classes()).toContain('mt-0.5')
    expect(mount(Switch, { props: { size: 'md', label: 'On' } }).get('[role="switch"]').classes()).not.toContain('mt-0.5')
    expect(mount(Switch, { props: { size: 'lg', label: 'On' } }).get('[role="switch"]').classes()).not.toContain('mt-0.5')
    // No label, no line box to centre against.
    expect(mount(Switch, { props: { size: 'sm' } }).get('[role="switch"]').classes()).not.toContain('mt-0.5')
  })
})
