import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Kbd, parseHotkey } from '../src'

function keys(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('kbd').map(k => k.text())
}

/** `useApplePlatform` resolves on mount, so a tick is needed before asserting. */
async function mountOn(platform: string, props: Record<string, unknown>) {
  vi.stubGlobal('navigator', { platform, userAgent: platform })
  const wrapper = mount(Kbd, { props })
  await nextTick()
  return wrapper
}

describe('parseHotkey', () => {
  it('splits a plus-joined string', () => {
    expect(parseHotkey('mod+k', false).map(k => k.symbol)).toEqual(['Ctrl', 'K'])
  })

  it('takes an array as given', () => {
    expect(parseHotkey(['shift', 'enter'], false).map(k => k.symbol)).toEqual(['Shift', '↵'])
  })

  /*
   * The point of `mod`: one shortcut in the source, the right key on each
   * platform, matching what `matchesHotkey` actually binds.
   */
  it('resolves mod per platform', () => {
    expect(parseHotkey('mod', true)[0]).toMatchObject({ symbol: '⌘', spoken: 'Command' })
    expect(parseHotkey('mod', false)[0]).toMatchObject({ symbol: 'Ctrl', spoken: 'Control' })
  })

  it('resolves the other modifiers per platform', () => {
    expect(parseHotkey('alt', true)[0]).toMatchObject({ symbol: '⌥', spoken: 'Option' })
    expect(parseHotkey('alt', false)[0]).toMatchObject({ symbol: 'Alt', spoken: 'Alt' })
    expect(parseHotkey('shift', true)[0]?.symbol).toBe('⇧')
  })

  it('knows the named keys, including the event spellings', () => {
    expect(parseHotkey('escape', false)[0]?.symbol).toBe('Esc')
    expect(parseHotkey('arrowup', false)[0]?.symbol).toBe('↑')
    expect(parseHotkey('up', false)[0]?.symbol).toBe('↑')
  })

  // A lone letter reads better capitalised; a word keeps whatever casing it has.
  it('capitalises a single character but leaves words alone', () => {
    expect(parseHotkey('k', false)[0]?.symbol).toBe('K')
    expect(parseHotkey('F12', false)[0]?.symbol).toBe('F12')
  })

  // Every glyph carries a spoken name, because ⌘ announces as nothing useful.
  it('gives every key something to say', () => {
    expect(parseHotkey('mod+shift+enter', true).map(k => k.spoken))
      .toEqual(['Command', 'Shift', 'Enter'])
  })
})

describe('kbd', () => {
  it('renders one chip per key', async () => {
    const wrapper = await mountOn('Win32', { keys: 'mod+k' })
    expect(keys(wrapper)).toEqual(['Ctrl', 'K'])
  })

  it('shows the Apple glyph on an Apple platform', async () => {
    const wrapper = await mountOn('MacIntel', { keys: 'mod+k' })
    expect(keys(wrapper)).toEqual(['⌘', 'K'])
  })

  /*
   * Resolved after mount on purpose: there is no `navigator` on the server, so
   * deciding during render would mismatch on hydration.
   */
  it('starts on the non-Apple glyph before mount resolves', () => {
    vi.stubGlobal('navigator', { platform: 'MacIntel', userAgent: 'MacIntel' })
    expect(keys(mount(Kbd, { props: { keys: 'mod' } }))).toEqual(['Ctrl'])
  })

  it('labels the group with the spoken combination', async () => {
    const wrapper = await mountOn('MacIntel', { keys: 'mod+shift+k' })
    expect(wrapper.attributes('aria-label')).toBe('Command Shift K')
  })

  it('hides the glyphs from assistive technology', async () => {
    const wrapper = await mountOn('Win32', { keys: 'mod+k' })
    expect(wrapper.findAll('kbd').every(k => k.attributes('aria-hidden') === 'true')).toBe(true)
  })

  it('takes an explicit label', async () => {
    const wrapper = await mountOn('Win32', { keys: 'mod+k', ariaLabel: 'Open the palette' })
    expect(wrapper.attributes('aria-label')).toBe('Open the palette')
  })

  it('joins with a plus only when asked', async () => {
    const plain = await mountOn('Win32', { keys: 'mod+k' })
    expect(plain.text()).not.toContain('+')

    const joined = await mountOn('Win32', { keys: 'mod+k', joined: true })
    expect(joined.text()).toContain('+')
  })

  it('sizes the chips', async () => {
    const wrapper = await mountOn('Win32', { keys: 'k', size: 'md' })
    expect(wrapper.get('kbd').classes()).toContain('h-6')
  })

  it('renders nothing for an empty shortcut', async () => {
    const wrapper = await mountOn('Win32', {})
    expect(wrapper.findAll('kbd')).toHaveLength(0)
  })

  it('drops every built-in class when unstyled', async () => {
    const wrapper = await mountOn('Win32', { keys: 'k', unstyled: true })
    expect(wrapper.classes()).toHaveLength(0)
    expect(wrapper.get('kbd').classes()).toHaveLength(0)
  })
})
