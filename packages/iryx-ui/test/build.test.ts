import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

/**
 * Guards what actually ships.
 *
 * `@hugeicons/core-free-icons`, `@hugeicons/vue` and `@internationalized/date`
 * were all declared as dependencies *and* inlined into `dist`, because the
 * external list in `vite.config.ts` was maintained by hand and had drifted
 * (it still named `lucide-vue-next`, which is not a dependency at all). A
 * consumer therefore installed those packages and then received a second
 * private copy: ~38 kB of duplicate code, and — worse — two module instances
 * of `@internationalized/date`, which is enough to make an `instanceof
 * CalendarDate` check fail across the boundary.
 *
 * The config now derives its externals from package.json. These tests check
 * the result rather than the intent.
 */
const root = process.cwd()
const dist = resolve(root, 'dist')
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

/*
 * The suite runs before `pnpm build` locally. CI builds first (see
 * .github/workflows/ci.yml), which is where this has to hold.
 */
const built = existsSync(join(dist, 'index.js'))

/**
 * Module specifiers imported by name rather than by path.
 *
 * Matched per line and anchored to the statement keyword: a loose search for
 * `from "…"` also hits the phrase inside ordinary string literals, and the
 * bundled chart and icon data contain plenty of those.
 */
function bareImports(): string[] {
  const pattern = /^\s*(?:import|export)\s[^'"]*?\sfrom\s*["']([^."'][^"']*)["']|^\s*import\s*["']([^."'][^"']*)["']/
  return jsFiles(dist).flatMap(file =>
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map(line => pattern.exec(line))
      .flatMap((match) => {
        const specifier = match?.[1] ?? match?.[2]
        return specifier ? [specifier] : []
      }),
  )
}

function jsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory())
      return jsFiles(path)
    return path.endsWith('.js') ? [path] : []
  })
}

describe.skipIf(!built)('build output', () => {
  it('bundles nothing out of node_modules', () => {
    expect(existsSync(join(dist, 'node_modules'))).toBe(false)
  })

  /*
   * The mirror of the test above: nothing inlined, and nothing imported that
   * a consumer was never told to install. `#app` is Nuxt's own alias, resolved
   * by the Nuxt build rather than by us, and `iryx-ui` is the module importing
   * itself from the Nuxt entry.
   */
  it('imports nothing a consumer has not been told to install', () => {
    const allowed = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
      '#app',
      pkg.name,
    ])

    const found = new Set(bareImports())
    // Without this the filter below passes vacuously whenever the scanner
    // stops matching anything — which it silently did once already.
    expect([...found]).toEqual(expect.arrayContaining(['vue', 'reka-ui']))

    const undeclared = [...found].filter((name) => {
      // Deep imports belong to whichever package they start with.
      return ![...allowed].some(dep => name === dep || name.startsWith(`${dep}/`))
    })

    expect(undeclared).toEqual([])
  })

  /*
   * This is a browser library. A Node builtin in the bundle is externalised by
   * every browser bundler, so the import resolves to nothing and the first line
   * to touch it throws.
   *
   * It happened: `cartesian.ts` imported `node:process` for a dev-only
   * `NODE_ENV` check, which meant any chart with more than eight series threw
   * in the browser. An earlier version of the test above skipped `node:`
   * specifiers outright, so it shipped. Read as a bare global instead —
   * bundlers replace it statically.
   */
  it('imports no Node builtins', () => {
    const builtins = [...new Set(bareImports())].filter(name => name.startsWith('node:'))
    expect(builtins).toEqual([])
  })

  it('keeps each component in its own module so consumers can tree-shake', () => {
    // `preserveModules` is what makes an unused component droppable. If the
    // build ever collapses to a single chunk, importing one component pulls
    // in all 42.
    const components = join(dist, 'components')
    expect(existsSync(components)).toBe(true)
    expect(readdirSync(components).length).toBeGreaterThan(40)
  })

  it('ships the theme stylesheet the exports map promises', () => {
    expect(existsSync(resolve(root, pkg.exports['./theme.css']))).toBe(true)
  })
})
