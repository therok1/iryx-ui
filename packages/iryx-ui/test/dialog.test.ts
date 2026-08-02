import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { ConfirmDialog, Dialog, useConfirm } from '../src'

/*
 * Dialogs portal into document.body, so without unmounting between tests one
 * test's markup leaks into the next one's assertions. Let Vue tear the
 * teleported content down itself — clearing document.body by hand here runs
 * before the unmount and leaves Vue removing nodes that are already gone.
 */
enableAutoUnmount(afterEach)

/** Dialog content is portalled to body, so assert against the document. */
function body() {
  return document.body.textContent ?? ''
}

function query(selector: string) {
  return document.body.querySelector(selector)
}

describe('dialog', () => {
  it('renders nothing until opened', async () => {
    mount(Dialog, { props: { title: 'Edit' }, attachTo: document.body })
    await nextTick()
    expect(query('[role="dialog"]')).toBeNull()
  })

  it('renders title, description and body when open', async () => {
    mount(Dialog, {
      props: { open: true, title: 'Edit invoice', description: 'Change the details.' },
      slots: { default: 'Body here' },
      attachTo: document.body,
    })
    await nextTick()
    expect(query('[role="dialog"]')).not.toBeNull()
    expect(body()).toContain('Edit invoice')
    expect(body()).toContain('Change the details.')
    expect(body()).toContain('Body here')
  })

  it('labels the dismiss button and allows overriding it', async () => {
    mount(Dialog, {
      props: { open: true, title: 'T', closeLabel: 'Zapri' },
      attachTo: document.body,
    })
    await nextTick()
    expect(query('[aria-label="Zapri"]')).not.toBeNull()
  })

  it('hides the dismiss button when showClose is false', async () => {
    mount(Dialog, { props: { open: true, title: 'T', showClose: false }, attachTo: document.body })
    await nextTick()
    expect(query('[aria-label="Close"]')).toBeNull()
  })

  /*
   * `dismissible: false` is enforced on the state change, not by preventing
   * Reka's escapeKeyDown/interactOutside events — those did not reliably stop
   * the close. The corner button must still work regardless.
   */
  it('ignores Escape when not dismissible', async () => {
    const wrapper = mount(Dialog, {
      props: { open: true, title: 'Choose', dismissible: false },
      attachTo: document.body,
    })
    await nextTick()
    expect(query('[role="dialog"]')).not.toBeNull()

    const content = query('[role="dialog"]')!
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    await nextTick()
    expect(query('[role="dialog"]')).not.toBeNull()
    expect(wrapper.props('open')).toBe(true)
  })

  it('still closes a non-dismissible dialog from the corner button', async () => {
    const wrapper = mount(Dialog, {
      props: { open: true, title: 'Choose', dismissible: false },
      attachTo: document.body,
    })
    await nextTick()
    ;(query('[aria-label="Close"]') as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('closes on Escape when dismissible', async () => {
    const wrapper = mount(Dialog, {
      props: { open: true, title: 'Edit' },
      attachTo: document.body,
    })
    await nextTick()
    query('[role="dialog"]')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('always provides an accessible name, even with no title', async () => {
    mount(Dialog, { props: { open: true }, attachTo: document.body })
    await nextTick()
    // Reka wires aria-labelledby to the (visually hidden) DialogTitle.
    expect(query('[role="dialog"]')?.getAttribute('aria-labelledby')).toBeTruthy()
  })
})

describe('useConfirm', () => {
  it('resolves true when confirmed', async () => {
    mount(ConfirmDialog, { attachTo: document.body })
    const { confirm } = useConfirm()

    const answer = confirm({ title: 'Delete draft?', confirmLabel: 'Delete' })
    await nextTick()
    await nextTick()
    expect(body()).toContain('Delete draft?')

    const buttons = [...document.body.querySelectorAll('button')]
    buttons.find(b => b.textContent?.trim() === 'Delete')!.click()
    expect(await answer).toBe(true)
  })

  it('resolves false when cancelled', async () => {
    mount(ConfirmDialog, { attachTo: document.body })
    const { confirm } = useConfirm()

    const answer = confirm({ title: 'Delete payment?', cancelLabel: 'Prekliči' })
    await nextTick()
    await nextTick()

    const buttons = [...document.body.querySelectorAll('button')]
    buttons.find(b => b.textContent?.trim() === 'Prekliči')!.click()
    expect(await answer).toBe(false)
  })

  it('accepts a bare string as the title', async () => {
    mount(ConfirmDialog, { attachTo: document.body })
    const { confirm } = useConfirm()

    const answer = confirm('Are you sure?')
    await nextTick()
    await nextTick()
    expect(body()).toContain('Are you sure?')

    const buttons = [...document.body.querySelectorAll('button')]
    buttons.find(b => b.textContent?.trim() === 'Cancel')!.click()
    expect(await answer).toBe(false)
  })

  /*
   * A superseded request must settle rather than hang, or the caller awaits a
   * promise that can never resolve.
   */
  it('resolves a superseded request as false instead of leaving it pending', async () => {
    mount(ConfirmDialog, { attachTo: document.body })
    const { confirm } = useConfirm()

    const first = confirm('First')
    const second = confirm('Second')
    await nextTick()
    await nextTick()

    expect(await first).toBe(false)
    expect(body()).toContain('Second')

    const buttons = [...document.body.querySelectorAll('button')]
    buttons.find(b => b.textContent?.trim() === 'Cancel')!.click()
    expect(await second).toBe(false)
  })
})
