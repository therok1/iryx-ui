import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Toaster, useToast } from '../src'

// Toasts portal into document.body and survive their wrapper; let Vue tear
// the teleported content down itself between tests.
enableAutoUnmount(afterEach)

// The store is module-level, so it leaks between tests unless emptied.
beforeEach(() => useToast().clear())

function body() {
  return document.body.textContent ?? ''
}

/** Reka renders each toast as a collection item in the viewport's <ol>. */
function toastElements() {
  return [...document.body.querySelectorAll('li[data-reka-collection-item]')]
}

async function settle() {
  await nextTick()
  await nextTick()
}

describe('useToast', () => {
  it('renders a toast pushed from outside a component', async () => {
    mount(Toaster, { attachTo: document.body })
    useToast().success('Saved')
    await settle()
    expect(body()).toContain('Saved')
  })

  it('accepts a bare string or a full options object', async () => {
    mount(Toaster, { attachTo: document.body })
    useToast().toast({ title: 'Invoice sent', description: 'To acme@example.com' })
    await settle()
    expect(body()).toContain('Invoice sent')
    expect(body()).toContain('To acme@example.com')
  })

  it('stacks multiple toasts', async () => {
    mount(Toaster, { attachTo: document.body })
    const toast = useToast()
    toast.success('One')
    toast.danger('Two')
    await settle()
    expect(toastElements()).toHaveLength(2)
  })

  it('dismisses by the id it returns', async () => {
    mount(Toaster, { attachTo: document.body })
    const toast = useToast()
    const id = toast.info('Temporary')
    await settle()
    expect(body()).toContain('Temporary')

    toast.dismiss(id)
    await settle()
    expect(body()).not.toContain('Temporary')
  })

  it('clear removes every open toast', async () => {
    mount(Toaster, { attachTo: document.body })
    const toast = useToast()
    toast.success('A')
    toast.warning('B')
    await settle()

    expect(toastElements()).toHaveLength(2)
    toast.clear()
    await settle()
    expect(toastElements()).toHaveLength(0)
  })

  /*
   * Every toast carries a close button with its own icon, so count svgs per
   * toast rather than looking for any icon in the document.
   */
  it('shows an icon for status variants but not for neutral', async () => {
    mount(Toaster, { attachTo: document.body })
    const toast = useToast()

    toast.toast('Plain')
    await settle()
    expect(toastElements()[0]!.querySelectorAll('svg')).toHaveLength(1)

    toast.clear()
    toast.success('Good')
    await settle()
    expect(toastElements()[0]!.querySelectorAll('svg')).toHaveLength(2)
  })

  it('runs the action handler and dismisses the toast', async () => {
    mount(Toaster, { attachTo: document.body })
    const onClick = vi.fn()
    useToast().toast({ title: 'Deleted', action: { label: 'Undo', onClick } })
    await settle()

    const action = [...document.body.querySelectorAll('button')]
      .find(b => b.textContent?.trim() === 'Undo')
    action!.click()
    await settle()

    expect(onClick).toHaveBeenCalledOnce()
    expect(body()).not.toContain('Deleted')
  })

  /*
   * The surface stays neutral and the icon carries the status, matching IAlert
   * and IBadge — stacked toasts would otherwise be a column of washed blocks
   * fighting each other and the page behind them.
   */
  it('colours the icon from status tokens, keeping the surface neutral', async () => {
    mount(Toaster, { attachTo: document.body })
    useToast().danger('Failed')
    await settle()
    const root = toastElements()[0]!
    expect(root.className).toContain('bg-background')
    expect(root.className).not.toContain('bg-danger-muted')

    const icon = root.querySelector('div')!
    expect(icon.className).toContain('text-danger')
    expect(icon.className).not.toMatch(/dark:|emerald|amber|red-|blue-/)
  })

  it('turns a loading toast into success when the promise resolves', async () => {
    mount(Toaster, { attachTo: document.body })
    let resolve!: (value: string) => void
    const work = new Promise<string>(r => (resolve = r))
    useToast().promise(work, { loading: 'Saving…', success: name => `Saved ${name}`, error: 'Failed' })
    await settle()
    expect(body()).toContain('Saving…')
    expect(toastElements()[0]!.querySelector('div')!.className).toContain('animate-spin')

    resolve('draft')
    await work
    await settle()
    expect(body()).toContain('Saved draft')
    expect(body()).not.toContain('Saving…')
    // Updated in place, not stacked as a second toast.
    expect(toastElements()).toHaveLength(1)
    expect(toastElements()[0]!.querySelector('div')!.className).toContain('text-success')
  })

  it('shows the error message when the promise rejects', async () => {
    mount(Toaster, { attachTo: document.body })
    const work = Promise.reject(new Error('offline'))
    useToast().promise(work, { loading: 'Saving…', success: 'Saved', error: e => `Failed: ${(e as Error).message}` })
    await work.catch(() => {})
    await settle()
    expect(body()).toContain('Failed: offline')
    expect(toastElements()[0]!.querySelector('div')!.className).toContain('text-danger')
  })

  it('stays open while pending and auto-dismisses once settled', async () => {
    vi.useFakeTimers()
    try {
      mount(Toaster, { attachTo: document.body })
      let resolve!: () => void
      const work = new Promise<void>(r => (resolve = r))
      useToast().promise(work, { loading: 'Saving…', success: 'Saved', error: 'Failed' })
      await settle()
      vi.advanceTimersByTime(60_000)
      await settle()
      expect(body()).toContain('Saving…')

      resolve()
      await work
      await settle()
      vi.advanceTimersByTime(6000)
      await settle()
      expect(body()).not.toContain('Saved')
    }
    finally {
      vi.useRealTimers()
    }
  })

  // Dismissing mid-flight means "I don't care", so settling must not bring it back.
  it('does not bring back a toast dismissed while pending', async () => {
    mount(Toaster, { attachTo: document.body })
    let resolve!: () => void
    const work = new Promise<void>(r => (resolve = r))
    const toast = useToast()
    const id = toast.promise(work, { loading: 'Saving…', success: 'Saved', error: 'Failed' })
    toast.dismiss(id)
    resolve()
    await work
    await settle()
    expect(toastElements()).toHaveLength(0)
  })

  it('allows overriding the close label for non-English apps', async () => {
    mount(Toaster, { props: { closeLabel: 'Zapri' }, attachTo: document.body })
    useToast().info('Hello')
    await settle()
    expect(document.body.querySelector('[aria-label="Zapri"]')).not.toBeNull()
  })
})
