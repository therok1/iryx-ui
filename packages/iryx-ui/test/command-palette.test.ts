import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { CommandPalette } from '../src'
import { commandHaystack, commandId, matchesHotkey, pushRecent, toCommandGroups } from '../src/composables/command-palette'

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
  // Reka always renders `aria-describedby`, pointing at an id that only exists
  // with a description. A palette has none, so the attribute has to be removed
  // — the same treatment IDialog needed.
  it('does not warn about a missing description', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = openPalette()
    await nextTick()

    const described = warn.mock.calls.flat().filter(
      arg => typeof arg === 'string' && arg.includes('Missing `Description`'),
    )
    expect(described).toEqual([])
    warn.mockRestore()
    wrapper.unmount()
  })

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

describe('commandPalette recent commands', () => {
  const KEY = 'test-palette-recent'

  afterEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  function groupLabels() {
    return [...document.querySelectorAll('[role="group"]')].map(group => group.firstElementChild?.textContent?.trim())
  }

  function option(label: string) {
    return [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(el => el.textContent?.includes(label))!
  }

  it('lists remembered commands first while the search is empty', async () => {
    window.localStorage.setItem(KEY, JSON.stringify(['Actions/Create invoice']))
    const wrapper = openPalette({ recentKey: KEY })
    await nextTick()
    await nextTick()
    expect(groupLabels()[0]).toBe('Recent')
    expect(document.querySelector('[role="group"]')!.textContent).toContain('Create invoice')
    wrapper.unmount()
  })

  it('remembers a chosen command, newest first', async () => {
    const wrapper = openPalette({ recentKey: KEY, closeOnSelect: false })
    await nextTick()
    option('Go to clients').click()
    await nextTick()
    option('Create invoice').click()
    await nextTick()
    expect(JSON.parse(window.localStorage.getItem(KEY)!)).toEqual(['Actions/Create invoice', 'Navigation/Go to clients'])
    wrapper.unmount()
  })

  // Otherwise picking it again from "Recent" would store "Recent/Create invoice".
  it('remembers a command picked from the recent group under its own group', async () => {
    window.localStorage.setItem(KEY, JSON.stringify(['Actions/Create invoice']))
    const wrapper = openPalette({ recentKey: KEY, closeOnSelect: false })
    await nextTick()
    await nextTick()
    document.querySelector<HTMLElement>('[role="group"] [role="option"]')!.click()
    await nextTick()
    expect(JSON.parse(window.localStorage.getItem(KEY)!)).toEqual(['Actions/Create invoice'])
    wrapper.unmount()
  })

  it('hides the recent group once the reader types', async () => {
    window.localStorage.setItem(KEY, JSON.stringify(['Actions/Create invoice']))
    const wrapper = openPalette({ recentKey: KEY })
    await nextTick()
    const input = document.querySelector<HTMLInputElement>('input')!
    input.value = 'invoice'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(groupLabels()).not.toContain('Recent')
    wrapper.unmount()
  })

  it('skips remembered commands that were removed or disabled', async () => {
    window.localStorage.setItem(KEY, JSON.stringify(['Actions/Deleted command', 'Actions/Archive invoice']))
    const wrapper = openPalette({ recentKey: KEY })
    await nextTick()
    await nextTick()
    expect(groupLabels()).not.toContain('Recent')
    wrapper.unmount()
  })

  it('remembers nothing without a recentKey', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    const wrapper = openPalette({ closeOnSelect: false })
    await nextTick()
    option('Go to clients').click()
    await nextTick()
    expect(setItem).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  // Private windows and strict settings throw on storage access.
  it('keeps working when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const onSelect = vi.fn()
    const wrapper = openPalette({ recentKey: KEY, items: [{ label: 'Go to clients', onSelect }] })
    await nextTick()
    option('Go to clients').click()
    await nextTick()
    expect(onSelect).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('takes a translated heading', async () => {
    window.localStorage.setItem(KEY, JSON.stringify(['Actions/Create invoice']))
    const wrapper = openPalette({ recentKey: KEY, recentLabel: 'Nedavno' })
    await nextTick()
    await nextTick()
    expect(groupLabels()[0]).toBe('Nedavno')
    wrapper.unmount()
  })
})

describe('recent helpers', () => {
  it('prefers an explicit id over group and label', () => {
    expect(commandId({ label: 'Settings', id: 'settings' }, 'Navigation')).toBe('settings')
    expect(commandId({ label: 'Settings' }, 'Navigation')).toBe('Navigation/Settings')
  })

  it('moves a repeat to the front and trims to the limit', () => {
    expect(pushRecent(['a', 'b', 'c'], 'c', 5)).toEqual(['c', 'a', 'b'])
    expect(pushRecent(['a', 'b', 'c'], 'd', 3)).toEqual(['d', 'a', 'b'])
  })
})
