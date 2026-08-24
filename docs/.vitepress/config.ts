import { readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

const pkgDir = resolve(import.meta.dirname, '../../packages/iryx-ui')

/**
 * Version and component count are read from the source of truth rather than
 * typed into a page. The home page said "42 components" for three releases
 * because it was a literal — a number in prose is a number that goes stale.
 */
const version = JSON.parse(readFileSync(resolve(pkgDir, 'package.json'), 'utf8')).version as string
const componentCount = (
  readFileSync(resolve(pkgDir, 'src/component-names.ts'), 'utf8').match(/'[A-Z]+'/gi) ?? []
).length

/**
 * The component categories and their sizes, counted off the overview page's
 * own tables. Same reasoning as the count above: a number typed into prose on
 * the landing page is a number that goes stale.
 */
const categories: { title: string, anchor: string, count: number }[] = []
for (const line of readFileSync(resolve(import.meta.dirname, '../components/index.md'), 'utf8').split(/\r?\n/)) {
  const heading = /^## (.+)$/.exec(line)
  if (heading) {
    const title = heading[1].trim()
    const anchor = title.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    categories.push({ title, anchor: `#${anchor}`, count: 0 })
    continue
  }
  // A component row: `| ICard |` or `| [`ICard`](…) |`.
  if (categories.length > 0 && /^\| \[?`I[A-Z]/.test(line))
    categories[categories.length - 1].count += 1
}

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
      { text: 'Accordion', link: '/components/accordion' },
      { text: 'Alert', link: '/components/alert' },
      { text: 'App', link: '/components/app' },
      { text: 'App shell', link: '/components/app-shell' },
      { text: 'Aspect ratio', link: '/components/aspect-ratio' },
      { text: 'Avatar', link: '/components/avatar' },
      { text: 'Avatar group', link: '/components/avatar-group' },
      { text: 'Badge', link: '/components/badge' },
      { text: 'Banner', link: '/components/banner' },
      { text: 'Bar chart', link: '/components/bar-chart' },
      { text: 'Breadcrumb', link: '/components/breadcrumb' },
      { text: 'Button', link: '/components/button' },
      { text: 'Button group', link: '/components/button-group' },
      { text: 'Card', link: '/components/card' },
      { text: 'Chart legend', link: '/components/chart-legend' },
      { text: 'Checkbox', link: '/components/checkbox' },
      { text: 'Collapsible', link: '/components/collapsible' },
      { text: 'Color picker', link: '/components/color-picker' },
      { text: 'Combobox', link: '/components/combobox' },
      { text: 'Command palette', link: '/components/command-palette' },
      { text: 'Confirm dialog', link: '/components/confirm-dialog' },
      { text: 'Container', link: '/components/container' },
      { text: 'Context menu', link: '/components/context-menu' },
      { text: 'Date picker', link: '/components/date-picker' },
      { text: 'Date range picker', link: '/components/date-range-picker' },
      { text: 'Dialog', link: '/components/dialog' },
      { text: 'Drawer', link: '/components/drawer' },
      { text: 'Dropdown menu', link: '/components/dropdown-menu' },
      { text: 'Empty state', link: '/components/empty-state' },
      { text: 'File upload', link: '/components/file-upload' },
      { text: 'Form', link: '/components/form' },
      { text: 'Form field', link: '/components/form-field' },
      { text: 'Input', link: '/components/input' },
      { text: 'Kbd', link: '/components/kbd' },
      { text: 'Label', link: '/components/label' },
      { text: 'Line chart', link: '/components/line-chart' },
      { text: 'Menubar', link: '/components/menubar' },
      { text: 'Navigation menu', link: '/components/navigation-menu' },
      { text: 'Number input', link: '/components/number-input' },
      { text: 'Page header', link: '/components/page-header' },
      { text: 'Pagination', link: '/components/pagination' },
      { text: 'Password input', link: '/components/password-input' },
      { text: 'Pin input', link: '/components/pin-input' },
      { text: 'Popover', link: '/components/popover' },
      { text: 'Progress', link: '/components/progress' },
      { text: 'Radio group', link: '/components/radio-group' },
      { text: 'Scroll area', link: '/components/scroll-area' },
      { text: 'Scroll fade', link: '/components/scroll-fade' },
      { text: 'Select', link: '/components/select' },
      { text: 'Separator', link: '/components/separator' },
      { text: 'Sidebar', link: '/components/sidebar' },
      { text: 'Signature pad', link: '/components/signature-pad' },
      { text: 'Skeleton', link: '/components/skeleton' },
      { text: 'Slider', link: '/components/slider' },
      { text: 'Sparkline', link: '/components/sparkline' },
      { text: 'Splitter', link: '/components/splitter' },
      { text: 'Stat', link: '/components/stat' },
      { text: 'Stepper', link: '/components/stepper' },
      { text: 'Switch', link: '/components/switch' },
      { text: 'Table', link: '/components/table' },
      { text: 'Tabs', link: '/components/tabs' },
      { text: 'Tags input', link: '/components/tags-input' },
      { text: 'Textarea', link: '/components/textarea' },
      { text: 'Time field', link: '/components/time-field' },
      { text: 'Timeline', link: '/components/timeline' },
      { text: 'Toast', link: '/components/toast' },
      { text: 'Toggle', link: '/components/toggle' },
      { text: 'Toggle group', link: '/components/toggle-group' },
      { text: 'Toolbar', link: '/components/toolbar' },
      { text: 'Tooltip', link: '/components/tooltip' },
      { text: 'Tree', link: '/components/tree' },
    ],
  },
  {
    title: 'Composables',
    items: [
      { text: 'Overview', link: '/composables/' },
      { text: 'useAppearance', link: '/composables/use-appearance' },
      { text: 'useConfirm', link: '/composables/use-confirm' },
      { text: 'useDataTable', link: '/composables/use-data-table' },
      { text: 'useElementSize', link: '/composables/use-element-size' },
      { text: 'useForm', link: '/composables/use-form' },
      { text: 'useToast', link: '/composables/use-toast' },
      { text: 'Decimal helpers', link: '/composables/decimals' },
      { text: 'Date helpers', link: '/composables/dates' },
    ],
  },
]

/*
 * The absolute origin, for the tags that cannot take a relative URL: `og:url`,
 * `og:image` and the sitemap. `DOCS_ORIGIN` overrides it, for a preview deploy.
 */
const origin = (process.env.DOCS_ORIGIN ?? 'https://iryx-ui.com').replace(/\/$/, '')
const description = 'A Vue 3 component library built on Reka UI and Tailwind CSS v4.'

export default defineConfig({
  title: 'Iryx UI',
  description,
  /*
   * `robots.txt` is written here rather than kept in `public/`, so the sitemap
   * line carries whatever `DOCS_ORIGIN` the deploy used.
   */
  async buildEnd({ outDir }) {
    await writeFile(
      resolve(outDir, 'robots.txt'),
      `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
    )
  },
  /*
   * A canonical URL per page. The site is reachable at `iryx-ui.pages.dev` as
   * well as its own domain, and without this both get indexed as duplicates.
   */
  transformPageData(pageData) {
    const path = pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: `${origin}/${path}` },
    ])
  },
  cleanUrls: true,
  sitemap: { hostname: `${origin}/` },
  // The default theme is never imported, so its appearance handling is not
  // in play either — `useAppearance()` from the library owns the `dark` class.
  appearance: false,
  head: [
    // `favicon.ico` is picked up from the root by browsers that ignore the rest.
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#9060fb' }],

    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Iryx UI' }],
    ['meta', { property: 'og:title', content: 'Iryx UI' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: `${origin}/` }],
    ['meta', { property: 'og:image', content: `${origin}/og.png` }],
    ['meta', { property: 'og:image:width', content: '256' }],
    ['meta', { property: 'og:image:height', content: '256' }],
    ['meta', { property: 'og:image:alt', content: 'The Iryx UI mark' }],
    // `summary`, not `summary_large_image`: the card image is square.
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'Iryx UI' }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: `${origin}/og.png` }],
    /*
     * Switzer, from Fontshare — the same face and the same source the
     * playground uses. `style.css` names it in `--iryx-font-sans`, but naming a
     * family does not load it: without these the docs silently rendered in the
     * system fallback while the playground rendered in Switzer, so the two
     * disagreed about metrics that the library itself has no say in.
     *
     * The library still ships no webfont. This is the docs site behaving like
     * any consuming app: load a face, point the token at it.
     */
    ['link', { rel: 'preconnect', href: 'https://api.fontshare.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap',
      },
    ],
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
      { text: 'Composables', link: '/composables/' },
    ],
    repo: 'https://github.com/therok1/iryx-ui',
    version,
    componentCount,
    categories,
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
