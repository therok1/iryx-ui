import { resolve } from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

/**
 * The sidebar, as data. `Layout.vue` reads it through `useData().theme`.
 *
 * Deliberately not VitePress's `themeConfig.sidebar` shape — this theme
 * imports none of the default theme, so nothing downstream expects it.
 */
const sidebar = [
  {
    title: 'Getting started',
    items: [
      { text: 'Introduction', link: '/guide/' },
      { text: 'Installation', link: '/guide/installation' },
      { text: 'Theming', link: '/guide/theming' },
    ],
  },
  {
    title: 'Components',
    items: [
      { text: 'Overview', link: '/components/' },
      { text: 'Button', link: '/components/button' },
      { text: 'Input', link: '/components/input' },
      { text: 'Dialog', link: '/components/dialog' },
      { text: 'Drawer', link: '/components/drawer' },
      { text: 'Table', link: '/components/table' },
    ],
  },
]

export default defineConfig({
  title: 'Iryx UI',
  description: 'A Vue 3 component library built on Reka UI and Tailwind CSS v4.',
  cleanUrls: true,
  /*
   * A GitHub project site is served from `/<repo>/`, so the deploy workflow
   * sets `DOCS_BASE=/iryx-ui/`. Local dev keeps `/`. Every internal link goes
   * through `withBase()` for this reason — a hard-coded `href="/guide"` works
   * in dev and 404s in production, which is a mistake you only find after
   * deploying.
   */
  base: process.env.DOCS_BASE ?? '/',
  // The default theme is never imported, so its appearance handling is not
  // in play either — `useAppearance()` from the library owns the `dark` class.
  appearance: false,
  head: [
    /*
     * Set the theme before first paint. `useAppearance()` applies the class in
     * a watcher, which runs after hydration — long enough for a dark-mode
     * reader to get a full white flash on every navigation. Reads the same
     * storage key the composable writes, so the two cannot disagree.
     */
    [
      'script',
      {},
      `(() => {
        try {
          const stored = localStorage.getItem('iryx-ui:appearance') ?? 'system'
          const dark = stored === 'dark' || (stored === 'system'
            && window.matchMedia('(prefers-color-scheme: dark)').matches)
          document.documentElement.classList.toggle('dark', dark)
        } catch {}
      })()`,
    ],
  ],
  themeConfig: {
    sidebar,
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Components', link: '/components/' },
    ],
    repo: 'https://github.com/therok1/iryx-ui',
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Same trick as the playground: build against the library source, so
        // a component change shows up here without a rebuild.
        'iryx-ui': resolve(import.meta.dirname, '../../packages/iryx-ui/src/index.ts'),
      },
    },
  },
})
