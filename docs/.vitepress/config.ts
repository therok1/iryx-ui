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
      { text: 'Auth providers', link: '/components/auth-providers' },
      { text: 'Avatar', link: '/components/avatar' },
      { text: 'Avatar group', link: '/components/avatar-group' },
      { text: 'Badge', link: '/components/badge' },
      { text: 'Banner', link: '/components/banner' },
      { text: 'Bar chart', link: '/components/bar-chart' },
      { text: 'Breadcrumb', link: '/components/breadcrumb' },
      { text: 'Button', link: '/components/button' },
      { text: 'Button group', link: '/components/button-group' },
      { text: 'Calendar', link: '/components/calendar' },
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
      { text: 'Date field', link: '/components/date-field' },
      { text: 'Date picker', link: '/components/date-picker' },
      { text: 'Date range picker', link: '/components/date-range-picker' },
      { text: 'Dialog', link: '/components/dialog' },
      { text: 'Donut chart', link: '/components/donut-chart' },
      { text: 'Drawer', link: '/components/drawer' },
      { text: 'Dropdown menu', link: '/components/dropdown-menu' },
      { text: 'Editable', link: '/components/editable' },
      { text: 'Empty state', link: '/components/empty-state' },
      { text: 'File upload', link: '/components/file-upload' },
      { text: 'Form', link: '/components/form' },
      { text: 'Form field', link: '/components/form-field' },
      { text: 'Hover card', link: '/components/hover-card' },
      { text: 'Icon', link: '/components/icon' },
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
    title: 'Blocks',
    items: [
      { text: 'Overview', link: '/blocks/' },
      { text: 'Browser frame', link: '/blocks/browser-frame' },
      { text: 'Feature card', link: '/blocks/feature-card' },
      { text: 'Hero', link: '/blocks/hero' },
      { text: 'Pricing card', link: '/blocks/pricing-card' },
      { text: 'Pricing table', link: '/blocks/pricing-table' },
      { text: 'Section', link: '/blocks/section' },
      { text: 'Site footer', link: '/blocks/site-footer' },
      { text: 'Site header', link: '/blocks/site-header' },
      { text: 'Testimonial card', link: '/blocks/testimonial-card' },
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
  {
    title: 'Examples',
    items: [
      { text: 'Dashboard', link: '/examples/#dashboard' },
      { text: 'Marketing', link: '/examples/#marketing' },
    ],
  },
]

/*
 * The absolute origin, for the tags that cannot take a relative URL: `og:url`,
 * `og:image` and the sitemap. `DOCS_ORIGIN` overrides it, for a preview deploy.
 */
const origin = (process.env.DOCS_ORIGIN ?? 'https://iryx-ui.com').replace(/\/$/, '')
const description = 'A Vue 3 component library built on Reka UI and Tailwind CSS v4.'

/* The card image carries no words, so its alt describes the mark itself. */
const imageAlt = 'The Iryx UI mark, white on violet'

/** A page's public path, with `index.md` and the `.md` suffix taken off. */
function pagePath(relativePath: string): string {
  return relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
}

/*
 * A page's own summary, taken from the first paragraph of its source.
 *
 * Read from the markdown rather than the rendered HTML so it can be set in
 * `transformPageData`, which is the only hook whose result reaches the client.
 * A description produced in `transformHead` is server-side only: VitePress
 * rebuilds the head on hydration from the page data it shipped, so the meta
 * reverted to the site-wide description the moment the page became
 * interactive — invisible to a link scraper, which reads the raw HTML, but
 * not to a crawler that renders first.
 */
function summarise(filePath: string): string | undefined {
  if (!filePath)
    return undefined

  let source: string
  try {
    source = readFileSync(filePath, 'utf8')
  }
  catch {
    return undefined
  }

  const body = source
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    // Fenced code is not prose either, and the samples are full of sentences.
    .replace(/^```[\s\S]+?^```/gm, '')

  /*
   * The first line that is prose: not a heading, not a fence, not a table or
   * a container, and not a component. `<InstallCommand />` opens the
   * installation page, and a demo opens several others.
   *
   * A line of markup is not prose either. The landing page is one long
   * template, and its `Accessible by default.<br>` reached the card with the
   * tags still in it — a scraper renders the description as written. An
   * inline tag inside a sentence is fine; it is stripped from the text below.
   */
  const isProse = (line: string): boolean => {
    const trimmed = line.trim()
    // A bare `attr="value"` is a wrapped tag, not a sentence that mentions one.
    return /^[A-Z0-9`[]/i.test(trimmed) && !/^(?:[#>|]|```)/.test(trimmed) && !/^[\w-]+="/.test(trimmed)
  }

  const lines = body.split(/\r?\n/)
  const startIndex = lines.findIndex(isProse)
  if (startIndex === -1)
    return undefined

  const paragraph: string[] = []
  for (const line of lines.slice(startIndex)) {
    if (!line.trim() || !isProse(line))
      break
    paragraph.push(line.trim())
  }

  const text = paragraph
    .join(' ')
    // Inline tags go; a tag inside a code span is prose about a tag, so it stays.
    .replace(/`[^`]*`|<[^>]*>/g, match => match.startsWith('`') ? match : '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text)
    return undefined
  if (text.length <= 160)
    return text

  // Cut at a word, not mid-syllable.
  const clipped = text.slice(0, 160)
  return `${clipped.slice(0, clipped.lastIndexOf(' '))}…`
}

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
  transformPageData(pageData, { siteConfig }) {
    const site = siteConfig.site
    // Assigned here, not in the head tags below, so it survives hydration.
    pageData.description = pageData.frontmatter.description
      ?? summarise(pageData.filePath)
      ?? description

    const url = `${origin}/${pagePath(pageData.relativePath)}`
    const title = pageData.frontmatter.title || pageData.title || site.title
    const summary = pageData.description

    /*
     * The share tags that differ per page. They used to sit in `head` as
     * constants, so every page in the site carried the home page's title, the
     * one site-wide description and an `og:url` of `/` — a link to any
     * component page previewed as the home page, and told crawlers as much.
     *
     * They live in `frontmatter.head` rather than `transformHead` because
     * `transformHead` only runs at build time: on a client-side navigation
     * VitePress re-applies `head` plus `frontmatter.head` and nothing else,
     * so tags written in `transformHead` kept the first page's values until a
     * reload. `mergeHead` keys a tag on its first attribute, so what is
     * pushed here replaces the matching `property`/`name` in `head` rather
     * than doubling it. The `description` meta is left out: VitePress patches
     * that one itself from `pageData.description`.
     */
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: summary }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: summary }],
      // Kept in step with `<html lang>` rather than written out twice.
      ['meta', { property: 'og:locale', content: (site.lang || 'en-US').replace('-', '_') }],
    )
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

    /*
     * Only the tags that are the same on every page live here. Title,
     * description and URL are per-page, in `transformHead` above.
     */
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Iryx UI' }],
    ['meta', { property: 'og:image', content: `${origin}/og.png` }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    /*
     * These four move together. Scrapers trust the declared dimensions over
     * the file, so a card type that disagrees with them crops the image rather
     * than fixing it: `og.png` was the 256px square mark and `summary`, and is
     * now 1200×630 and `summary_large_image`.
     */
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: imageAlt }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${origin}/og.png` }],
    ['meta', { name: 'twitter:image:alt', content: imageAlt }],
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
      { text: 'Blocks', link: '/blocks/' },
      { text: 'Composables', link: '/composables/' },
      { text: 'Examples', link: '/examples/' },
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
        // Ahead of the bare specifier below: an object alias matches by prefix,
        // so `iryx-ui` alone would rewrite this to `…/index.ts/marketing`.
        'iryx-ui/marketing': resolve(import.meta.dirname, '../../packages/iryx-ui/src/marketing.ts'),
        // Same trick as the playground: build against the library source, so
        // a component change shows up here without a rebuild.
        'iryx-ui': resolve(import.meta.dirname, '../../packages/iryx-ui/src/index.ts'),
      },
    },
  },
})
