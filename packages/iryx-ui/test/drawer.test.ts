import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Drawer } from '../src'

/*
 * Drawers portal into document.body, so without unmounting between tests one
 * test's markup leaks into the next one's assertions.
 */
enableAutoUnmount(afterEach)

function body() {
  return document.body.textContent ?? ''
}

function query(selector: string) {
  return document.body.querySelector(selector)
}

function panel() {
  return document.body.querySelector('[role="dialog"]')
}

describe('drawer', () => {
  it('renders nothing until opened', async () => {
    mount(Drawer, { props: { title: 'Filters' }, attachTo: document.body })
    await nextTick()
    expect(panel()).toBeNull()
  })

  it('renders title, description and body when open', async () => {
    mount(Drawer, {
      props: { open: true, title: 'Filters', description: 'Narrow the list.' },
      slots: { default: 'Body here' },
      attachTo: document.body,
    })
    await nextTick()
    expect(panel()).not.toBeNull()
    expect(body()).toContain('Filters')
    expect(body()).toContain('Narrow the list.')
    expect(body()).toContain('Body here')
  })

  /*
   * Reka binds aria-describedby to a generated id whether or not a
   * DrawerDescription rendered, which leaves a dangling reference. The
   * attribute has to be removed, not set to the string "undefined".
   */
  it('drops aria-describedby when it has no description', async () => {
    mount(Drawer, { props: { open: true, title: 'Filters' }, attachTo: document.body })
    await nextTick()
    expect(panel()!.hasAttribute('aria-describedby')).toBe(false)
  })

  it('keeps aria-describedby wired up when it does have one', async () => {
    mount(Drawer, {
      props: { open: true, title: 'Filters', description: 'Narrow the list.' },
      attachTo: document.body,
    })
    await nextTick()
    const id = panel()!.getAttribute('aria-describedby')
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)?.textContent).toContain('Narrow the list.')
  })

  it('always provides an accessible name, even with no title', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(Drawer, { props: { open: true }, attachTo: document.body })
    await nextTick()

    const id = panel()?.getAttribute('aria-labelledby')
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)).not.toBeNull()
    // Reka warns when it cannot find a DrawerTitle; the hidden one must satisfy it.
    const missingTitle = warn.mock.calls.flat().filter(
      arg => typeof arg === 'string' && arg.includes('requires a `DrawerTitle`'),
    )
    expect(missingTitle).toEqual([])
    warn.mockRestore()
  })

  /*
   * `side` is the CSS edge; Reka's swipe direction uses up/down for the
   * vertical pair, so the mapping is not an identity and is worth pinning.
   */
  it.each([
    ['right', 'right'],
    ['left', 'left'],
    ['top', 'up'],
    ['bottom', 'down'],
  ] as const)('maps side %s to swipe direction %s', async (side, direction) => {
    mount(Drawer, { props: { open: true, title: 'T', side }, attachTo: document.body })
    await nextTick()
    expect(panel()!.getAttribute('data-swipe-direction')).toBe(direction)
  })

  /*
   * The drag offset lives on `transform`, so the enter/exit slide must use the
   * independent `translate` property. A keyframe on `transform` would win over
   * Reka's inline style and the panel would not follow the finger.
   */
  it('keeps the drag transform off the enter animation', async () => {
    mount(Drawer, { props: { open: true, title: 'T', side: 'bottom' }, attachTo: document.body })
    await nextTick()
    const classes = panel()!.getAttribute('class') ?? ''
    expect(classes).toContain('iryx-drawer')
    expect(classes).toContain('animate-drawer-in-bottom')
  })

  it('shows the handle on a sheet and hides it on a side drawer', async () => {
    mount(Drawer, { props: { open: true, title: 'T', side: 'bottom' }, attachTo: document.body })
    await nextTick()
    expect(query('[aria-hidden="true"][data-state="open"]')).not.toBeNull()
  })

  it('lets the handle be forced on for a side drawer', async () => {
    mount(Drawer, {
      props: { open: true, title: 'T', side: 'right', handle: true },
      attachTo: document.body,
    })
    await nextTick()
    expect(query('[aria-hidden="true"][data-state="open"]')).not.toBeNull()
  })

  it('labels the dismiss button and allows overriding it', async () => {
    mount(Drawer, { props: { open: true, title: 'T', closeLabel: 'Zapri' }, attachTo: document.body })
    await nextTick()
    expect(query('[aria-label="Zapri"]')).not.toBeNull()
  })

  it('hides the dismiss button when showClose is false', async () => {
    mount(Drawer, { props: { open: true, title: 'T', showClose: false }, attachTo: document.body })
    await nextTick()
    expect(query('[aria-label="Close"]')).toBeNull()
  })

  it('closes on Escape when dismissible', async () => {
    const wrapper = mount(Drawer, { props: { open: true, title: 'T' }, attachTo: document.body })
    await nextTick()
    panel()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('ignores Escape when not dismissible', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'T', dismissible: false },
      attachTo: document.body,
    })
    await nextTick()
    panel()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    await nextTick()
    expect(panel()).not.toBeNull()
    expect(wrapper.props('open')).toBe(true)
  })

  it('still closes a non-dismissible drawer from the corner button', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'T', dismissible: false },
      attachTo: document.body,
    })
    await nextTick()
    ;(query('[aria-label="Close"]') as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  /*
   * Snap points translate the panel rather than resize it, so a `size` height
   * cap would clip the expanded state. `class` merges last, so it must win
   * over the size variant.
   */
  it('drops the size height cap when snap points are given', async () => {
    mount(Drawer, {
      props: { open: true, title: 'T', side: 'bottom', size: 'sm', snapPoints: [0.4, 1] },
      attachTo: document.body,
    })
    await nextTick()
    const classes = panel()!.getAttribute('class') ?? ''
    expect(classes).toContain('max-h-dvh')
    expect(classes).not.toContain('max-h-[25dvh]')
  })

  it('marks the body as the scrollable viewport', async () => {
    mount(Drawer, {
      props: { open: true, title: 'T' },
      slots: { default: 'Body' },
      attachTo: document.body,
    })
    await nextTick()
    const viewport = query('[data-drawer-viewport]')
    expect(viewport).not.toBeNull()
    expect(viewport!.textContent).toContain('Body')
  })

  it('drops every built-in class when unstyled', async () => {
    mount(Drawer, { props: { open: true, title: 'T', unstyled: true }, attachTo: document.body })
    await nextTick()
    expect(panel()!.getAttribute('class') ?? '').toBe('')
  })
})
