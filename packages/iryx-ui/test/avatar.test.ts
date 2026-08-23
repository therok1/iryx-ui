import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { AspectRatio, Avatar, AvatarGroup } from '../src'

const people = [
  { name: 'Ana Ruiz' },
  { name: 'Bo Lindqvist' },
  { name: 'Cai Wen' },
  { name: 'Dara Okoye' },
]

describe('avatar', () => {
  /*
   * Initials are the normal state, not a failure state — most people in most
   * apps have no photo.
   */
  it('derives initials from a full name', () => {
    expect(mount(Avatar, { props: { name: 'Ana Ruiz' } }).text()).toBe('AR')
  })

  it('takes one letter from a single name', () => {
    expect(mount(Avatar, { props: { name: 'Ana' } }).text()).toBe('A')
  })

  // "Ana María Ruiz Vega" is AV, not AMRV — four letters are unreadable at 24px.
  it('uses the first and last words, not every word', () => {
    expect(mount(Avatar, { props: { name: 'Ana María Ruiz Vega' } }).text()).toBe('AV')
  })

  it('ignores stray whitespace', () => {
    expect(mount(Avatar, { props: { name: '  Ana   Ruiz  ' } }).text()).toBe('AR')
  })

  it('prefers explicit initials', () => {
    expect(mount(Avatar, { props: { name: 'Ana Ruiz', initials: 'ANA' } }).text()).toBe('ANA')
  })

  it('renders nothing rather than guessing without a name', () => {
    expect(mount(Avatar).text()).toBe('')
  })

  it('renders the image when given a src', () => {
    const wrapper = mount(Avatar, { props: { src: 'https://example.com/a.jpg', alt: 'Ana Ruiz' } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Ana Ruiz')
  })

  /*
   * An avatar beside the same person's name would otherwise be announced
   * twice, so an empty alt is the right default rather than an oversight.
   */
  it('defaults the image alt to empty', () => {
    const wrapper = mount(Avatar, { props: { src: 'https://example.com/a.jpg' } })
    expect(wrapper.find('img').attributes('alt')).toBe('')
  })

  it('sizes and shapes itself', () => {
    expect(mount(Avatar, { props: { size: 'xs' } }).classes()).toContain('size-6')
    expect(mount(Avatar, { props: { size: 'xl' } }).classes()).toContain('size-16')
    expect(mount(Avatar, { props: { shape: 'square' } }).classes()).toContain('rounded-xl')
    expect(mount(Avatar).classes()).toContain('rounded-full')
  })

  // A colour alone says nothing to a screen reader.
  it('names the status dot', () => {
    const wrapper = mount(Avatar, { props: { name: 'Ana', status: 'online' } })
    const dot = wrapper.get('[role="img"]')
    expect(dot.attributes('aria-label')).toBe('online')
    expect(dot.classes()).toContain('bg-success')
  })

  it('takes a custom status label', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Ana', status: 'busy', statusLabel: 'In a meeting' },
    })
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('In a meeting')
  })

  it('renders no dot without a status', () => {
    expect(mount(Avatar, { props: { name: 'Ana' } }).find('[role="img"]').exists()).toBe(false)
  })

  /*
   * The dot sits on the avatar's edge, so a clip on the root cropped it.
   * The image and fallback inherit the radius and clip themselves instead.
   */
  it('does not clip the status dot', () => {
    const wrapper = mount(Avatar, { props: { name: 'Ana', status: 'online' } })
    expect(wrapper.classes()).not.toContain('overflow-hidden')
  })

  it('still clips the image to the avatar shape', () => {
    const wrapper = mount(Avatar, { props: { src: 'https://example.com/a.jpg' } })
    expect(wrapper.get('img').classes()).toContain('rounded-[inherit]')
  })

  it('drops every built-in class when unstyled', () => {
    expect(mount(Avatar, { props: { name: 'Ana', unstyled: true } }).classes()).toHaveLength(0)
  })
})

describe('avatarGroup', () => {
  it('renders one avatar per item', () => {
    const wrapper = mount(AvatarGroup, { props: { items: people } })
    expect(wrapper.findAll('span[class*="rounded-full"]').length).toBeGreaterThanOrEqual(4)
    expect(wrapper.text()).toContain('AR')
    expect(wrapper.text()).toContain('DO')
  })

  it('caps the stack and counts the rest', () => {
    const wrapper = mount(AvatarGroup, { props: { items: people, max: 2 } })
    expect(wrapper.text()).toContain('+2')
    expect(wrapper.text()).toContain('AR')
    expect(wrapper.text()).not.toContain('DO')
  })

  it('shows no chip when everyone fits', () => {
    const wrapper = mount(AvatarGroup, { props: { items: people, max: 4 } })
    expect(wrapper.text()).not.toContain('+')
  })

  /*
   * The row is reversed so the first person paints on top without a z-index
   * per child; the visible order is still the order given.
   */
  it('reverses the row so earlier avatars sit on top', () => {
    const wrapper = mount(AvatarGroup, { props: { items: people } })
    expect(wrapper.classes()).toContain('flex-row-reverse')
    expect(wrapper.classes()).toContain('space-x-reverse')
  })

  it('rings each avatar so the overlap reads as depth', () => {
    const wrapper = mount(AvatarGroup, { props: { items: people } })
    expect(wrapper.html()).toContain('ring-background')
  })

  it('passes its size down to every avatar', () => {
    const wrapper = mount(AvatarGroup, { props: { items: people, size: 'sm' } })
    expect(wrapper.html()).toContain('size-8')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(AvatarGroup, { props: { items: people, unstyled: true } })
    expect(wrapper.classes()).toHaveLength(0)
  })
})

describe('aspectRatio', () => {
  it('holds a square by default', () => {
    const wrapper = mount(AspectRatio, { slots: { default: 'Content' } })
    expect(wrapper.html()).toContain('padding-bottom: 100%')
  })

  it('takes a ratio', () => {
    const wrapper = mount(AspectRatio, { props: { ratio: 16 / 9 }, slots: { default: 'x' } })
    expect(wrapper.html()).toContain('padding-bottom: 56.25%')
  })

  it('clips its content to the box', () => {
    expect(mount(AspectRatio, { slots: { default: 'x' } }).html()).toContain('overflow-hidden')
  })

  it('drops every built-in class when unstyled', () => {
    const wrapper = mount(AspectRatio, { props: { unstyled: true }, slots: { default: 'x' } })
    expect(wrapper.html()).not.toContain('overflow-hidden')
  })
})
