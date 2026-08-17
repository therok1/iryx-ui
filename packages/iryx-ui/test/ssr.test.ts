// @vitest-environment node

import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
// The subpath of `vue` itself, not the standalone `@vue/server-renderer`
// package — depending on that separately resolved a second `@vue/runtime-core`
// and the two copies' `Component` types stopped being assignable.
import { renderToString } from 'vue/server-renderer'
import * as iryx from '../src'
import { componentNames } from '../src'

/**
 * Server-side rendering, with no DOM at all.
 *
 * The environment is deliberately `node` rather than the suite's happy-dom:
 * with happy-dom loaded, `document` and `window` exist, so a component that
 * reaches for either during setup renders happily here and only fails on a
 * real server. Removing the DOM is the whole point of the file.
 *
 * This covers the risk the Nuxt module carries — the toast and confirm stores
 * are module-level singletons, which is the shape that breaks under SSR —
 * without installing Nuxt itself. It does not boot Nuxt, so it proves nothing
 * about Nitro, hydration or the plugin template's runtime behaviour.
 */

/** Props needed for a component to render something rather than bail early. */
const props: Record<string, Record<string, unknown>> = {
  Alert: { title: 'Heads up' },
  Banner: { title: 'Maintenance' },
  BarChart: { data: [{ label: 'Jan', value: 3 }] },
  Breadcrumb: { items: [{ label: 'Home' }] },
  ChartLegend: { series: [{ name: 'Revenue', slot: 0 }] },
  Combobox: { items: ['One'] },
  Dialog: { open: true, title: 'Edit' },
  Drawer: { open: true, title: 'Filters' },
  DropdownMenu: { items: [{ label: 'Rename' }] },
  EmptyState: { title: 'Nothing here' },
  LineChart: { data: [{ label: 'Jan', value: 3 }] },
  Pagination: { total: 100 },
  Progress: { modelValue: 40, label: 'Uploading' },
  RadioGroup: { items: [{ label: 'A', value: 'a' }] },
  Select: { items: ['One'] },
  Sparkline: { data: [1, 2, 3] },
  Stat: { label: 'Revenue', value: '12,400' },
  Stepper: { items: [{ title: 'One' }] },
  Table: { columns: [{ key: 'name', label: 'Name' }], rows: [{ name: 'Row' }] },
  Tabs: { items: [{ label: 'One', value: 'a' }] },
  Tooltip: { text: 'Explain' },
}

describe('server-side rendering', () => {
  it('has no DOM, so a component reaching for one would throw', () => {
    expect(typeof document).toBe('undefined')
    expect(typeof window).toBe('undefined')
  })

  /*
   * Proof the sweep can fail. Without it, a harness that silently stopped
   * rendering would report a clean bill of health for all 42 components.
   */
  it('fails a component that reaches for the DOM during setup', async () => {
    const app = createSSRApp({
      setup: () => {
        document.createElement('div')
        return () => h('div')
      },
    })
    await expect(renderToString(app)).rejects.toThrow(/document is not defined/)
  })

  it.each(componentNames)('renders I%s without a DOM', async (name) => {
    const component = (iryx as Record<string, unknown>)[name] as Component
    const app = createSSRApp({
      render: () => h(component, props[name] ?? {}),
    })

    await expect(renderToString(app)).resolves.toBeTypeOf('string')
  })

  /*
   * The toast and confirm stores are module-level singletons — deliberately,
   * and matching vue-sonner — but on a server that means one queue shared by
   * every concurrent request. Nothing here can enforce per-request isolation;
   * what it can do is pin that the modules import and run without a DOM, and
   * record the constraint where the next person will find it.
   */
  it('exposes the imperative APIs without touching the DOM', () => {
    expect(() => iryx.useToast()).not.toThrow()
    expect(() => iryx.useConfirm()).not.toThrow()
  })
})
