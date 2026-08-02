import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { Button, DropdownMenu } from '../src'

// Menu content is portalled to body and outlives its wrapper.
enableAutoUnmount(afterEach)

const trigger = () => h(Button, null, () => 'Open')

function query(selector: string) {
  return document.body.querySelector(selector)
}

async function settle() {
  await nextTick()
  await nextTick()
}

describe('dropdownMenu', () => {
  it('stays closed until the trigger is used', async () => {
    mount(DropdownMenu, {
      props: { items: [{ label: 'One', onSelect: () => {} }] },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()
    expect(query('[role="menu"]')).toBeNull()
  })

  it('renders items, labels and separators when open', async () => {
    mount(DropdownMenu, {
      props: {
        open: true,
        items: [
          { label: 'Actions' },
          { label: 'Edit', onSelect: () => {} },
          '-',
          { label: 'Delete', danger: true, onSelect: () => {} },
        ],
      },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()

    const items = [...document.body.querySelectorAll('[role="menuitem"]')]
    expect(items.map(i => i.textContent?.trim())).toEqual(['Edit', 'Delete'])
    // An entry without onSelect is a group label, not a selectable item.
    expect(document.body.textContent).toContain('Actions')
    expect(query('[role="separator"]')).not.toBeNull()
  })

  it('runs the item handler on select', async () => {
    const onSelect = vi.fn()
    mount(DropdownMenu, {
      props: { open: true, items: [{ label: 'Edit', onSelect }] },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()

    ;(query('[role="menuitem"]') as HTMLElement).click()
    await settle()
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('closes itself after a selection', async () => {
    const wrapper = mount(DropdownMenu, {
      props: { open: true, items: [{ label: 'Edit', onSelect: () => {} }] },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()

    ;(query('[role="menuitem"]') as HTMLElement).click()
    await settle()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('does not fire a disabled item', async () => {
    const onSelect = vi.fn()
    mount(DropdownMenu, {
      props: { open: true, items: [{ label: 'Edit', disabled: true, onSelect }] },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()

    ;(query('[role="menuitem"]') as HTMLElement).click()
    await settle()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('colours a danger item from status tokens', async () => {
    mount(DropdownMenu, {
      props: { open: true, items: [{ label: 'Delete', danger: true, onSelect: () => {} }] },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()

    const classes = query('[role="menuitem"]')?.className ?? ''
    expect(classes).toContain('text-danger')
    expect(classes).not.toMatch(/dark:|emerald|amber|red-|blue-/)
  })

  it('wires the trigger to the menu for assistive tech', async () => {
    mount(DropdownMenu, {
      props: { items: [{ label: 'Edit', onSelect: () => {} }] },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()

    const button = query('button')!
    expect(button.getAttribute('aria-haspopup')).toBe('menu')
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  /*
   * Nesting is rendered by DropdownMenuItems calling itself, so depth is not
   * capped. The submenu content only mounts once its trigger opens, so these
   * assert on the trigger rather than the nested items.
   */
  it('turns an entry with items into a submenu trigger', async () => {
    mount(DropdownMenu, {
      props: {
        open: true,
        items: [
          { label: 'Open', onSelect: () => {} },
          { label: 'Export as', items: [{ label: 'PDF', onSelect: () => {} }] },
        ],
      },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()

    const items = [...document.body.querySelectorAll('[role="menuitem"]')]
    const submenu = items.find(i => i.textContent?.includes('Export as'))
    expect(submenu?.getAttribute('aria-haspopup')).toBe('menu')
    // A plain item must not be marked as opening a menu.
    expect(items.find(i => i.textContent?.includes('Open'))?.getAttribute('aria-haspopup')).toBeNull()
  })

  it('does not treat an empty items array as a submenu', async () => {
    mount(DropdownMenu, {
      props: { open: true, items: [{ label: 'Edit', items: [], onSelect: () => {} }] },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()
    expect(query('[role="menuitem"]')?.getAttribute('aria-haspopup')).toBeNull()
  })

  it('keeps a submenu trigger inert when disabled', async () => {
    mount(DropdownMenu, {
      props: {
        open: true,
        items: [{ label: 'Export as', disabled: true, items: [{ label: 'PDF', onSelect: () => {} }] }],
      },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()
    expect(query('[role="menuitem"]')?.getAttribute('data-disabled')).not.toBeNull()
  })

  it('drops built-in classes when unstyled', async () => {
    mount(DropdownMenu, {
      props: { open: true, unstyled: true, class: 'mine', items: [{ label: 'Edit', onSelect: () => {} }] },
      slots: { trigger },
      attachTo: document.body,
    })
    await settle()
    expect(query('[role="menu"]')?.className).toBe('mine')
  })
})
