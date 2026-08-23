import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { CommandPalette } from '../src'
import { commandHaystack, matchesHotkey, toCommandGroups } from '../src/composables/command-palette'

const items = [
  {
    label: 'Navigation',
    items: [
      { label: 'Go to invoices', shortcut: 'g i', keywords: ['billing'] },
      { label: 'Go to clients' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { label: 'Create invoice', shortcut: 'mod n' },
      { label: 'Archive invoice', disabled: true },
    ],
  },
]

// The dialog teleports to <body>, so a leftover panel would be found by the
// next test's query and quietly assert against the wrong palette.
afterEach(() => {
  document.body.innerHTML = ''
})

function openPalette(props: Record<string, unknown> = {}) {
  return mount(CommandPalette, { props: { items, open: true, ...props }, attachTo: document.body })
}

describe('commandPalette', () => {
  it('renders every command, grouped', async () => {
    const wrapper = openPalette()
    await nextTick()

    const text = document.body.textContent ?? ''
    expect(text).toContain('Navigation')
    expect(text).toContain('Go to invoices')
    expect(text).toContain('Create invoice')
    wrapper.unmount()
  })

  it('renders nothing until it is opened', () => {
    const wrapper = mount(CommandPalette, { props: { items }, attachTo: document.body })
    expect(document.body.textContent).not.toContain('Go to invoices')
    wrapper.unmount()
  })

  it('renders a command with href as a link, so it can be opened in a new tab', async () => {
    const wrapper = openPalette({ items: [{ label: 'Docs', href: '/docs' }] })
    await nextTick()

    const link = document.body.querySelector('a[href="/docs"]')
    expect(link).not.toBeNull()
    wrapper.unmount()
  })

  it('runs the command, emits it, and closes', async () => {
    const onSelect = vi.fn()
    const wrapper = openPalette({ items: [{ label: 'Create invoice', onSelect }] })
    await nextTick()

    const row = document.body.querySelector('[role="option"]') as HTMLElement
    row.click()
    await nextTick()

    expect(onSelect).toHaveBeenCalledOnce()
    expect(wrapper.emitted('select')?.at(-1)?.[0]).toMatchObject({ label: 'Create invoice' })
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('stays open when closeOnSelect is false', async () => {
    const wrapper = openPalette({ items: [{ label: 'Toggle grid' }], closeOnSelect: false })
    await nextTick()

    const row = document.body.querySelector('[role="option"]') as HTMLElement
    row.click()
    await nextTick()

    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    wrapper.unmount()
  })

  it('never runs a disabled command', async () => {
    const onSelect = vi.fn()
    const wrapper = openPalette({ items: [{ label: 'Archive', disabled: true, onSelect }] })
    await nextTick()

    const row = document.body.querySelector('[role="option"]') as HTMLElement
    row.click()
    await nextTick()

    expect(onSelect).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('clears the query on close, not on open', async () => {
    const wrapper = openPalette()
    await nextTick()

    const input = document.body.querySelector('input') as HTMLInputElement
    input.value = 'invoice'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    await wrapper.setProps({ open: false })
    await nextTick()
    await wrapper.setProps({ open: true })
    await nextTick()

    expect((document.body.querySelector('input') as HTMLInputElement).value).toBe('')
    wrapper.unmount()
  })
})

/*
 * The hotkey is the one part that has to work before the component exists in
 * the DOM, so it is a window listener rather than anything the palette owns.
 */
describe('hotkey', () => {
  it('opens on the bound chord', async () => {
    const wrapper = mount(CommandPalette, { props: { items }, attachTo: document.body })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true }))
    await nextTick()

    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
    wrapper.unmount()
  })

  it('binds nothing when the hotkey is null', async () => {
    const wrapper = mount(CommandPalette, { props: { items, hotkey: null }, attachTo: document.body })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true }))
    await nextTick()

    expect(wrapper.emitted('update:open')).toBeUndefined()
    wrapper.unmount()
  })

  it('stops listening once unmounted', async () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(CommandPalette, { props: { items } })
    wrapper.unmount()
    expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function))
    remove.mockRestore()
  })
})

describe('matchesHotkey', () => {
  it('reads mod as control off Apple platforms', () => {
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }), 'mod+k')).toBe(true)
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'k' }), 'mod+k')).toBe(false)
  })

  it('requires the modifiers named and no others', () => {
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, shiftKey: true }), 'mod+k')).toBe(false)
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, shiftKey: true }), 'mod+shift+k')).toBe(true)
  })

  it('is case-insensitive on the key', () => {
    expect(matchesHotkey(new KeyboardEvent('keydown', { key: 'K', ctrlKey: true }), 'mod+k')).toBe(true)
  })
})

describe('command data', () => {
  it('keeps loose commands in the order they were written', () => {
    const groups = toCommandGroups([
      { label: 'First' },
      { label: 'Group', items: [{ label: 'Inside' }] },
      { label: 'Last' },
    ])

    expect(groups.map(group => group.label)).toEqual(['', 'Group', ''])
    expect(groups[0]!.items[0]!.label).toBe('First')
    expect(groups[2]!.items[0]!.label).toBe('Last')
  })

  it('searches labels, keywords and the group name together', () => {
    const haystack = commandHaystack({ label: 'Go to invoices', keywords: ['billing'] }, 'Navigation')
    expect(haystack).toContain('billing')
    expect(haystack).toContain('Navigation')
  })
})
