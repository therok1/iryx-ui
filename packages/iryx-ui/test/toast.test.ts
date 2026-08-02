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

  it('colours variants from status tokens, not raw palettes', async () => {
    mount(Toaster, { attachTo: document.body })
    useToast().danger('Failed')
    await settle()
    const root = toastElements()[0]!
    expect(root.className).toContain('bg-danger-muted')
    expect(root.className).not.toMatch(/dark:|emerald|amber|red-|blue-/)
  })

  it('allows overriding the close label for non-English apps', async () => {
    mount(Toaster, { props: { closeLabel: 'Zapri' }, attachTo: document.body })
    useToast().info('Hello')
    await settle()
    expect(document.body.querySelector('[aria-label="Zapri"]')).not.toBeNull()
  })
})
