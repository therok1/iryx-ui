import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { AppShell, Container, PageHeader, Sidebar, toSidebarSections } from '../src'

enableAutoUnmount(afterEach)

/** Stand-in for a component icon, e.g. from Lucide. */
const Home = () => h('svg')

describe('container', () => {
  it('centres and caps the width', () => {
    const cls = mount(Container).attributes('class')!
    expect(cls).toContain('mx-auto')
    expect(cls).toContain('max-w-7xl')
  })

  /*
   * `max-w-screen-*` was removed in Tailwind v4 and generates nothing at all,
   * silently — a container that reads right in the source and is full-bleed on
   * the page. Pinned to the v4 scale so a revert is loud.
   */
  it('uses the Tailwind v4 width scale, not the removed v3 screen utilities', () => {
    for (const size of ['sm', 'md', 'lg', 'xl'] as const) {
      const cls = mount(Container, { props: { size } }).attributes('class')!
      expect(cls).not.toContain('max-w-screen')
      expect(cls).toMatch(/max-w-\dxl/)
    }
  })

  it('drops the cap but keeps the gutter when full', () => {
    const cls = mount(Container, { props: { size: 'full' } }).attributes('class')!
    expect(cls).toContain('max-w-none')
    expect(cls).toContain('px-6')
  })

  it('drops built-in classes when unstyled', () => {
    expect(mount(Container, { props: { unstyled: true, class: 'mine' } }).attributes('class')).toBe('mine')
  })
})

describe('pageHeader', () => {
  it('renders the title as an h1 by default', () => {
    expect(mount(PageHeader, { props: { title: 'Invoices' } }).get('h1').text()).toBe('Invoices')
  })

  it('lets a nested view sit lower in the heading outline', () => {
    const wrapper = mount(PageHeader, { props: { title: 'Details', level: 2 } })
    expect(wrapper.find('h1').exists()).toBe(false)
    expect(wrapper.get('h2').text()).toBe('Details')
  })

  it('renders as a header landmark', () => {
    expect(mount(PageHeader, { props: { title: 'Invoices' } }).element.tagName).toBe('HEADER')
  })

  it('omits the heading and action blocks when there is nothing for them', () => {
    const wrapper = mount(PageHeader)
    expect(wrapper.find('h1').exists()).toBe(false)
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('renders actions and the breadcrumb slot when given', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'Invoices' },
      slots: { actions: '<button>New</button>', breadcrumb: '<nav>trail</nav>' },
    })
    expect(wrapper.get('button').text()).toBe('New')
    expect(wrapper.get('nav').text()).toBe('trail')
  })

  it('adds a rule under the header when bordered', () => {
    expect(mount(PageHeader, { props: { title: 'X', bordered: true } }).attributes('class')).toContain('border-b')
    expect(mount(PageHeader, { props: { title: 'X' } }).attributes('class')).not.toContain('border-b')
  })
})

describe('sidebar', () => {
  const items = [
    {
      section: 'Workspace',
      items: [
        { label: 'Overview', href: '/', icon: Home, active: true },
        { label: 'Inbox', href: '/inbox', badge: 12 },
      ],
    },
    {
      section: 'Billing',
      items: [
        {
          label: 'Invoices',
          icon: Home,
          defaultOpen: true,
          items: [
            { label: 'Drafts', href: '/invoices/drafts' },
            { label: 'Sent', href: '/invoices/sent' },
          ],
        },
      ],
    },
  ]

  it('renders a navigation landmark with an overridable name', () => {
    const wrapper = mount(Sidebar, { props: { items, label: 'Stranska' } })
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('Stranska')
  })

  it('renders section headings and their links', () => {
    const wrapper = mount(Sidebar, { props: { items } })
    expect(wrapper.text()).toContain('Workspace')
    expect(wrapper.get('a[href="/"]').attributes('aria-current')).toBe('page')
    expect(wrapper.get('a[href="/inbox"]').text()).toContain('12')
  })

  it('opens a group marked defaultOpen and renders its children', () => {
    const wrapper = mount(Sidebar, { props: { items } })
    expect(wrapper.get('a[href="/invoices/drafts"]').text()).toContain('Drafts')
  })

  it('keeps a group closed unless asked', () => {
    const wrapper = mount(Sidebar, {
      props: { items: [{ label: 'Invoices', items: [{ label: 'Drafts', href: '/d' }] }] },
    })
    expect(wrapper.find('a[href="/d"]').exists()).toBe(false)
  })

  it('renders a link without href as a button so it stays focusable', () => {
    const wrapper = mount(Sidebar, { props: { items: [{ label: 'Settings' }] } })
    expect(wrapper.get('button').attributes('type')).toBe('button')
  })

  it('calls onSelect, and never on a disabled link', async () => {
    const onSelect = vi.fn()
    const skipped = vi.fn()
    const wrapper = mount(Sidebar, {
      props: { items: [{ label: 'A', onSelect }, { label: 'B', onSelect: skipped, disabled: true }] },
      attachTo: document.body,
    })
    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    expect(onSelect).toHaveBeenCalledOnce()
    expect(skipped).not.toHaveBeenCalled()
    expect(buttons[1]!.attributes('aria-disabled')).toBe('true')
  })

  /*
   * The whole point of collapsing to icons is that the icon centres. A label
   * that is only visually hidden still occupies its width and defeats that, so
   * the accessible name has to come from `aria-label` instead.
   */
  it('hides labels outright when collapsed, and keeps an accessible name', async () => {
    const wrapper = mount(Sidebar, { props: { items, collapsed: true } })
    expect(wrapper.attributes('class')).toContain('w-16')
    expect(wrapper.get('a[href="/"]').attributes('aria-label')).toBe('Overview')

    const label = wrapper.get('a[href="/"] span')
    expect(label.attributes('class')).toContain('hidden')
    expect(label.attributes('class')).not.toContain('sr-only')

    await wrapper.setProps({ collapsed: false })
    expect(wrapper.attributes('class')).toContain('w-64')
    expect(wrapper.get('a[href="/"] span').attributes('class')).not.toContain('hidden')
  })

  it('exposes the collapsed state to the footer slot', () => {
    const wrapper = mount(Sidebar, {
      props: { items, collapsed: true },
      slots: { footer: '<template #footer="{ collapsed }">{{ collapsed ? "icons" : "full" }}</template>' },
    })
    expect(wrapper.text()).toContain('icons')
  })

  it('drops built-in classes when unstyled', () => {
    expect(mount(Sidebar, { props: { items, unstyled: true, class: 'mine' } }).attributes('class')).toBe('mine')
  })
})

describe('toSidebarSections', () => {
  it('wraps a flat list in a single unlabelled section', () => {
    expect(toSidebarSections([{ label: 'A' }])).toEqual([{ section: '', items: [{ label: 'A' }] }])
  })

  /*
   * Loose links keep their position rather than being hoisted, so the order the
   * caller wrote is the order that renders.
   */
  it('keeps loose links in place around sections', () => {
    const result = toSidebarSections([
      { label: 'Top' },
      { section: 'Group', items: [{ label: 'Inner' }] },
      { label: 'Bottom' },
    ])
    expect(result.map(section => [section.section, section.items.map(item => item.label)]))
      .toEqual([['', ['Top']], ['Group', ['Inner']], ['', ['Bottom']]])
  })

  it('returns nothing for no items', () => {
    expect(toSidebarSections(undefined)).toEqual([])
  })
})

describe('appShell', () => {
  const slots = {
    header: '<div id="hdr">bar</div>',
    sidebar: '<div id="side">nav</div>',
    default: '<p>content</p>',
  }

  it('renders every region it is given, and a main landmark', () => {
    const wrapper = mount(AppShell, { slots })
    expect(wrapper.find('#hdr').exists()).toBe(true)
    expect(wrapper.find('#side').exists()).toBe(true)
    expect(wrapper.get('main').text()).toContain('content')
  })

  it('omits the regions it is not given', () => {
    const wrapper = mount(AppShell, { slots: { default: '<p>content</p>' } })
    expect(wrapper.find('#side').exists()).toBe(false)
    expect(wrapper.get('main').text()).toContain('content')
  })

  /*
   * A flex child defaults to `min-height: auto`, so without `min-h-0` the
   * content column refuses to shrink below its content and the page grows a
   * second scrollbar instead of scrolling inside the shell.
   */
  it('scrolls only the main column by default, and constrains it to the viewport', () => {
    const wrapper = mount(AppShell, { slots })
    expect(wrapper.attributes('class')).toContain('h-svh')

    const main = wrapper.get('main')
    expect(main.attributes('class')).toContain('overflow-y-auto')
    expect(main.attributes('class')).toContain('min-w-0')
    expect(main.element.parentElement!.className).toContain('min-h-0')
  })

  it('scrolls the page and sticks the header when asked', () => {
    const wrapper = mount(AppShell, { props: { scroll: 'page' }, slots })
    expect(wrapper.attributes('class')).toContain('min-h-svh')
    expect(wrapper.attributes('class')).not.toContain('overflow-hidden')
    expect(wrapper.get('#hdr').element.parentElement!.className).toContain('sticky')
  })

  /*
   * There is no way to say "below the header" in CSS without knowing how tall
   * it is, so a sticky sidebar would park behind a sticky header. The shell
   * measures the header and publishes the offset as a variable.
   */
  it('publishes the header height so the sticky sidebar clears it', async () => {
    const wrapper = mount(AppShell, { props: { scroll: 'page' }, slots, attachTo: document.body })
    await nextTick()
    expect(wrapper.attributes('style')).toContain('--iryx-shell-header-height')
    expect(wrapper.get('#side').element.parentElement!.className)
      .toContain('top-[var(--iryx-shell-header-height,0px)]')
  })

  it('does not publish an offset in main-scroll mode, where nothing is sticky', () => {
    expect(mount(AppShell, { slots }).attributes('style')).toBeUndefined()
  })

  it('flips the columns without touching slot order', () => {
    const wrapper = mount(AppShell, { props: { sidebarPosition: 'right' }, slots })
    expect(wrapper.get('#side').element.parentElement!.parentElement!.className)
      .toContain('flex-row-reverse')
  })

  it('drops built-in classes when unstyled', () => {
    expect(mount(AppShell, { props: { unstyled: true, class: 'mine' }, slots }).attributes('class')).toBe('mine')
  })
})
