import type { DropdownMenuEntry } from '../src'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { ContextMenu, DropdownMenu, HoverCard, Menubar, Popover, Toolbar } from '../src'

/** These portal their content into the body, so mounted trees must be torn down. */
enableAutoUnmount(afterEach)

const trigger = () => h('button', 'Open')

/** Portalled content lives outside the wrapper, so assertions go through the body. */
const body = () => document.body

describe('popover', () => {
  it('stays closed until asked', () => {
    mount(Popover, { props: { open: false }, slots: { trigger, default: 'Panel' } })
    expect(body().textContent).not.toContain('Panel')
  })

  it('renders its content when open', async () => {
    mount(Popover, { props: { open: true }, slots: { trigger, default: 'Panel' } })
    await nextTick()
    expect(body().textContent).toContain('Panel')
  })

  it('carries the panel chrome', async () => {
    mount(Popover, { props: { open: true }, slots: { trigger, default: 'Panel' } })
    await nextTick()
    const content = body().querySelector('[data-state="open"][role]')
    expect(content?.className).toContain('bg-background')
    expect(content?.className).toContain('w-72')
    expect(content?.className).toContain('p-4')
  })

  it('takes a width and a padding', async () => {
    mount(Popover, {
      props: { open: true, width: 'none', padding: 'none' },
      slots: { trigger, default: 'Panel' },
    })
    await nextTick()
    const content = body().querySelector('[data-state="open"][role]')
    expect(content?.className).not.toContain('w-72')
    expect(content?.className).toContain('p-0')
  })

  /*
   * Room for the close button used to be reserved on the panel, which indented
   * every row — a form inside stopped short of the right edge and could never
   * be full width. Only the title makes way for it now.
   */
  it('insets the title for the close button, not the panel', async () => {
    mount(Popover, {
      props: { open: true, showClose: true, title: 'Price range' },
      slots: { trigger, default: 'Panel' },
    })
    await nextTick()
    const content = body().querySelector('[data-state="open"][role]')
    expect(content?.className).toContain('relative')
    expect(content?.className).toContain('p-4')
    expect(content?.className).not.toContain('pr-10')

    const title = [...body().querySelectorAll('p')].find(p => p.textContent === 'Price range')
    expect(title?.className).toContain('pr-6')
    expect(body().querySelector('[data-popover-close]')?.getAttribute('aria-label')).toBe('Close')
  })

  it('leaves the title alone without a close button', async () => {
    mount(Popover, {
      props: { open: true, title: 'Price range' },
      slots: { trigger, default: 'Panel' },
    })
    await nextTick()
    const title = [...body().querySelectorAll('p')].find(p => p.textContent === 'Price range')
    expect(title?.className).not.toContain('pr-6')
  })

  it('renders no title row unless given one', async () => {
    mount(Popover, { props: { open: true }, slots: { trigger, default: 'Panel' } })
    await nextTick()
    const content = body().querySelector('[data-state="open"][role]')
    expect(content?.querySelector('p')).toBeNull()
  })

  it('leaves the close button out unless asked', async () => {
    mount(Popover, { props: { open: true }, slots: { trigger, default: 'Panel' } })
    await nextTick()
    expect(body().querySelector('[data-popover-close]')).toBeNull()
  })

  // A popover is a dialog to assistive technology; an unnamed one is a puzzle.
  it('names the panel', async () => {
    mount(Popover, {
      props: { open: true, ariaLabel: 'Filters' },
      slots: { trigger, default: 'Panel' },
    })
    await nextTick()
    expect(body().querySelector('[aria-label="Filters"]')).not.toBeNull()
  })

  it('hands the slot a way to close itself', async () => {
    const wrapper = mount(Popover, {
      props: { open: true },
      slots: {
        trigger,
        default: (props: { close: () => void }) => h('button', { onClick: props.close }, 'Done'),
      },
    })
    await nextTick()
    const done = [...body().querySelectorAll('button')].find(b => b.textContent === 'Done')
    done?.click()
    await nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })
})

const entries: DropdownMenuEntry[] = [
  { label: 'Rename', onSelect: () => {} },
  '-',
  { label: 'Delete', danger: true, onSelect: () => {} },
]

/**
 * A context menu opens where the pointer is, so there is no `open` prop to
 * set — Reka types the root as `Omit<MenuProps, 'open'>`. Every test here has
 * to open it the way a reader does.
 */
async function rightClick(wrapper: ReturnType<typeof mount>) {
  await wrapper.get('button').trigger('contextmenu')
  await nextTick()
}

describe('dropdownMenu', () => {
  // An entry with no `onSelect` renders as a group label, not a menu item.
  const items: DropdownMenuEntry[] = [
    { label: 'Account settings', onSelect: () => {} },
    { label: 'Sign out', onSelect: () => {} },
  ]

  it('renders a header above the items', async () => {
    mount(DropdownMenu, {
      props: { open: true, items },
      slots: { trigger, header: '<p>rae@northwind.example</p>' },
    })
    await nextTick()
    expect(body().textContent).toContain('rae@northwind.example')
  })

  /** A header is read, not chosen: it must not take a stop in the menu order. */
  it('keeps the header out of the item list', async () => {
    mount(DropdownMenu, {
      props: { open: true, items },
      slots: { trigger, header: '<p>rae@northwind.example</p>' },
    })
    await nextTick()
    const rows = body().querySelectorAll('[role="menuitem"]')
    expect(rows).toHaveLength(2)
    expect([...rows].map(row => row.textContent?.trim())).not.toContain('rae@northwind.example')
  })

  it('renders nothing for it when the slot is absent', async () => {
    mount(DropdownMenu, { props: { open: true, items }, slots: { trigger } })
    await nextTick()
    expect(body().querySelector('.border-b')).toBeNull()
  })
})

describe('contextMenu', () => {
  it('stays closed until the region is right-clicked', () => {
    mount(ContextMenu, { props: { items: entries }, slots: { trigger } })
    expect(body().textContent).not.toContain('Rename')
  })

  it('opens on right-click and renders its entries', async () => {
    const wrapper = mount(ContextMenu, { props: { items: entries }, slots: { trigger } })
    await rightClick(wrapper)
    expect(body().textContent).toContain('Rename')
    expect(body().textContent).toContain('Delete')
  })

  it('reports opening', async () => {
    const wrapper = mount(ContextMenu, { props: { items: entries }, slots: { trigger } })
    await rightClick(wrapper)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
  })

  /*
   * Reka's context and dropdown parts are both thin wrappers over the same
   * `Menu` primitives, which is what lets one renderer and one theme serve
   * both — this asserts that reuse rather than trusting it.
   */
  it('shares the dropdown menu chrome', async () => {
    const wrapper = mount(ContextMenu, { props: { items: entries }, slots: { trigger } })
    await rightClick(wrapper)
    const item = body().querySelector('[role="menuitem"]')
    expect(item?.className).toContain('data-[highlighted]:bg-accent')
    expect(body().querySelector('[role="separator"]')).not.toBeNull()
  })

  it('styles a destructive entry in the danger colour', async () => {
    const wrapper = mount(ContextMenu, { props: { items: entries }, slots: { trigger } })
    await rightClick(wrapper)
    const items = [...body().querySelectorAll('[role="menuitem"]')]
    expect(items.at(-1)?.className).toContain('text-danger')
  })

  it('runs the entry callback when chosen', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(ContextMenu, {
      props: { items: [{ label: 'Rename', onSelect }] },
      slots: { trigger },
    })
    await rightClick(wrapper)
    body().querySelector<HTMLElement>('[role="menuitem"]')?.click()
    expect(onSelect).toHaveBeenCalledOnce()
  })
})

const menus = [
  { label: 'File', items: [{ label: 'New', onSelect: () => {} }] as DropdownMenuEntry[] },
  { label: 'Edit', items: [{ label: 'Undo', onSelect: () => {} }] as DropdownMenuEntry[] },
]

describe('menubar', () => {
  it('renders a trigger per menu', () => {
    const wrapper = mount(Menubar, { props: { menus } })
    const triggers = wrapper.findAll('[role="menuitem"]')
    expect(triggers).toHaveLength(2)
    expect(wrapper.text()).toContain('File')
    expect(wrapper.text()).toContain('Edit')
  })

  it('keeps the menus closed until one is opened', () => {
    mount(Menubar, { props: { menus } })
    expect(body().textContent).not.toContain('Undo')
  })

  it('opens the menu named by the model', async () => {
    mount(Menubar, { props: { menus, modelValue: 'Edit' } })
    await nextTick()
    expect(body().textContent).toContain('Undo')
    expect(body().textContent).not.toContain('New')
  })

  it('prefers an explicit value over the label', async () => {
    mount(Menubar, {
      props: {
        menus: [{ label: 'File', value: 'file', items: [{ label: 'New' }] as DropdownMenuEntry[] }],
        modelValue: 'file',
      },
    })
    await nextTick()
    expect(body().textContent).toContain('New')
  })

  it('disables a single menu', () => {
    const wrapper = mount(Menubar, {
      props: { menus: [{ label: 'File', disabled: true, items: [] }] },
    })
    expect(wrapper.get('[role="menuitem"]').attributes('data-disabled')).toBeDefined()
  })

  it('drops the container when bare', () => {
    expect(mount(Menubar, { props: { menus, bare: true } }).classes()).toContain('bg-transparent')
    expect(mount(Menubar, { props: { menus } }).classes()).toContain('border-border')
  })

  it('drops every built-in class when unstyled', () => {
    expect(mount(Menubar, { props: { menus, unstyled: true } }).classes()).toHaveLength(0)
  })
})

describe('toolbar', () => {
  const items = [
    { label: 'Undo', onSelect: () => {} },
    '-' as const,
    { label: 'Link', href: '/docs' },
  ]

  it('renders a control per entry, with separators between', () => {
    const wrapper = mount(Toolbar, { props: { items } })
    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(wrapper.findAll('a')).toHaveLength(1)
    expect(wrapper.find('[role="separator"]').exists()).toBe(true)
  })

  it('runs the entry callback when pressed', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(Toolbar, { props: { items: [{ label: 'Undo', onSelect }] } })
    await wrapper.get('button').trigger('click')
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('renders a link when given an href', () => {
    const wrapper = mount(Toolbar, { props: { items: [{ label: 'Docs', href: '/docs' }] } })
    expect(wrapper.get('a').attributes('href')).toBe('/docs')
  })

  // Shared with IButton so a toolbar button and a button elsewhere cannot drift.
  it('dresses its controls as ghost buttons', () => {
    const wrapper = mount(Toolbar, { props: { items: [{ label: 'Undo' }], size: 'sm' } })
    expect(wrapper.get('button').classes()).toContain('h-8')
    expect(wrapper.get('button').classes()).toContain('hover:bg-accent')
  })

  it('names an icon-only control after its hidden label', () => {
    const wrapper = mount(Toolbar, { props: { items: [{ label: 'Undo', iconOnly: true }] } })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Undo')
    expect(wrapper.text()).not.toContain('Undo')
  })

  it('prefers an explicit ariaLabel', () => {
    const wrapper = mount(Toolbar, {
      props: { items: [{ label: 'Undo', iconOnly: true, ariaLabel: 'Undo last change' }] },
    })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Undo last change')
  })

  // A toolbar is unlabelled chrome without one.
  it('names the bar', () => {
    const wrapper = mount(Toolbar, { props: { items, ariaLabel: 'Formatting' } })
    expect(wrapper.attributes('aria-label')).toBe('Formatting')
  })

  it('stacks and turns its separators when vertical', () => {
    const wrapper = mount(Toolbar, { props: { items, orientation: 'vertical' } })
    expect(wrapper.classes()).toContain('flex-col')
    expect(wrapper.get('[role="separator"]').classes()).toContain('h-px')
  })

  it('prefers the default slot over the items', () => {
    const wrapper = mount(Toolbar, {
      props: { items },
      slots: { default: () => h('span', 'Custom') },
    })
    expect(wrapper.text()).toContain('Custom')
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('drops the container when bare', () => {
    expect(mount(Toolbar, { props: { items, bare: true } }).classes()).toContain('bg-transparent')
  })

  it('drops every built-in class when unstyled', () => {
    expect(mount(Toolbar, { props: { items, unstyled: true } }).classes()).toHaveLength(0)
  })
})

describe('hoverCard', () => {
  it('stays closed until asked', () => {
    mount(HoverCard, { props: { open: false }, slots: { trigger, default: 'Preview' } })
    expect(body().textContent).not.toContain('Preview')
  })

  it('renders its content when open', async () => {
    mount(HoverCard, { props: { open: true }, slots: { trigger, default: 'Preview' } })
    await nextTick()
    expect(body().textContent).toContain('Preview')
  })

  /** The same chrome as the popover: to a reader they are the same object. */
  it('carries the panel chrome', async () => {
    mount(HoverCard, { props: { open: true }, slots: { trigger, default: 'Preview' } })
    await nextTick()
    const content = body().querySelector('[data-state="open"][data-side]')
    expect(content?.className).toContain('bg-background')
    expect(content?.className).toContain('w-72')
    expect(content?.className).toContain('p-4')
  })

  it('takes a width and a padding', async () => {
    mount(HoverCard, {
      props: { open: true, width: 'none', padding: 'none' },
      slots: { trigger, default: 'Preview' },
    })
    await nextTick()
    const content = body().querySelector('[data-state="open"][data-side]')
    expect(content?.className).not.toContain('w-72')
    expect(content?.className).toContain('p-0')
  })

  /** Focus opens it too, or a keyboard user could never reach the preview. */
  it('opens on the trigger taking focus', async () => {
    const wrapper = mount(HoverCard, {
      props: { openDelay: 0 },
      slots: { trigger, default: 'Preview' },
      attachTo: document.body,
    })
    await wrapper.get('button').trigger('focus')
    // The open is scheduled on a timer even at zero delay.
    await new Promise(resolve => setTimeout(resolve, 20))
    await nextTick()
    expect(body().textContent).toContain('Preview')
  })

  it('drops every built-in class when unstyled', async () => {
    mount(HoverCard, {
      props: { open: true, unstyled: true },
      slots: { trigger, default: 'Preview' },
    })
    await nextTick()
    const content = body().querySelector('[data-state="open"][data-side]')
    expect(content?.className).toBe('')
  })
})
