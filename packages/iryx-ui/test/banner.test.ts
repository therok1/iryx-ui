import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Alert, Banner } from '../src'

describe('banner', () => {
  it('renders the title and description props', () => {
    const wrapper = mount(Banner, { props: { title: 'Heads up', description: 'Maintenance on Sunday.' } })
    expect(wrapper.text()).toContain('Heads up')
    expect(wrapper.text()).toContain('Maintenance on Sunday.')
  })

  it('lets the default slot win over the description prop', () => {
    const wrapper = mount(Banner, { props: { description: 'Ignored' }, slots: { default: 'Shown' } })
    expect(wrapper.text()).toContain('Shown')
    expect(wrapper.text()).not.toContain('Ignored')
  })

  /*
   * A banner is ambient, so it is a labelled landmark rather than an alert —
   * `role="alert"` would interrupt a screen reader mid-task for something the
   * user did not trigger.
   */
  it('is a labelled region, never an alert', () => {
    const wrapper = mount(Banner, { props: { variant: 'danger', label: 'Billing notice' } })
    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.attributes('aria-label')).toBe('Billing notice')
  })

  it('spans full width and rules only its bottom edge by default', () => {
    const classes = mount(Banner).attributes('class') ?? ''
    expect(classes).toContain('w-full')
    expect(classes).toContain('border-b')
    expect(classes).not.toContain('rounded')
  })

  it('moves the rule to the top edge when pinned to the bottom', () => {
    const classes = mount(Banner, { props: { position: 'bottom' } }).attributes('class') ?? ''
    expect(classes).toContain('fixed')
    expect(classes).toContain('border-t')
    expect(classes).toContain('border-b-0')
  })

  it('sticks to the top when positioned there', () => {
    expect(mount(Banner, { props: { position: 'top' } }).attributes('class')).toContain('sticky')
  })

  it('styles every coloured variant from theme tokens, not raw palettes', () => {
    for (const variant of ['info', 'success', 'warning', 'danger'] as const) {
      const classes = mount(Banner, { props: { variant } }).attributes('class') ?? ''
      expect(classes).toContain(`-${variant}`)
      expect(classes).not.toMatch(/dark:|emerald|amber|red-|blue-/)
    }
  })

  it('renders actions and a dismiss button only when asked', () => {
    expect(mount(Banner).find('button').exists()).toBe(false)

    const wrapper = mount(Banner, {
      props: { closable: true, closeLabel: 'Hide' },
      slots: { actions: '<a href="#">Upgrade</a>' },
    })
    expect(wrapper.find('a').text()).toBe('Upgrade')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Hide')
  })

  it('hides itself on dismiss and emits close', async () => {
    const wrapper = mount(Banner, { props: { closable: true } })
    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(wrapper.find('[role="region"]').exists()).toBe(false)
  })

  it('stays hidden while the open model says so', () => {
    expect(mount(Banner, { props: { open: false } }).find('[role="region"]').exists()).toBe(false)
  })

  it('drops built-in classes when unstyled', () => {
    const wrapper = mount(Banner, { props: { unstyled: true, class: 'mine' } })
    expect(wrapper.attributes('class')).toBe('mine')
  })
})

describe('alert dismissal and actions', () => {
  it('hides itself on dismiss and still emits close', async () => {
    const wrapper = mount(Alert, { props: { closable: true, description: 'Saved' } })
    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(wrapper.text()).not.toContain('Saved')
  })

  it('renders the actions slot only when given one', () => {
    expect(mount(Alert, { props: { description: 'Failed' } }).findAll('button')).toHaveLength(0)

    const wrapper = mount(Alert, {
      props: { variant: 'danger', description: 'Upload failed' },
      slots: { actions: '<button type="button">Retry</button>' },
    })
    expect(wrapper.get('button').text()).toBe('Retry')
  })
})
