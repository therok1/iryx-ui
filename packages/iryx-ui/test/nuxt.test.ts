// Vite 8 parses with Oxc; `transformWithEsbuild` is deprecated and now needs
// esbuild installed separately. Either way this saves a dependency added only
// to parse a string.
import { transformWithOxc } from 'vite'
import { describe, expect, it, vi } from 'vitest'

/**
 * The Nuxt module's wiring, with `@nuxt/kit` stubbed.
 *
 * Booting a real Nuxt app would prove more, at the cost of installing Nuxt and
 * a much slower CI run. What breaks here in practice is not Nitro — it is the
 * registration loop drifting from `componentNames`, or the plugin template
 * emitting something that does not parse. Both are checkable without Nuxt.
 * `test/ssr.test.ts` covers the DOM-free rendering the module implies.
 */
const added: { name: string, export: string, filePath: string }[] = []
const templates: { filename: string, getContents: () => string }[] = []

vi.mock('@nuxt/kit', () => ({
  addComponent: (component: any) => added.push(component),
  addPluginTemplate: (template: any) => templates.push(template),
  defineNuxtModule: (module: any) => module,
}))

const module_ = (await import('../src/nuxt')).default as any
const { componentNames } = await import('../src/component-names')
// Imported up here, not inside a test: pulling in the whole library takes
// longer than the default 5s case timeout.
const iryx = await import('../src')

function setup(options: Record<string, unknown> = {}) {
  added.length = 0
  templates.length = 0
  module_.setup({ ...module_.defaults, ...options })
}

/** The single plugin the module registers. Asserted, so a miss reads clearly. */
function plugin() {
  expect(templates).toHaveLength(1)
  return templates[0]!
}

describe('nuxt module', () => {
  it('registers every exported component under the prefix', () => {
    setup()
    expect(added.map(c => c.name)).toEqual(componentNames.map(n => `I${n}`))
    expect(added.every(c => c.filePath === 'iryx-ui')).toBe(true)
  })

  it('honours a custom prefix', () => {
    setup({ prefix: 'Ui' })
    expect(added[0]?.name).toBe(`Ui${componentNames[0]}`)
  })

  it('declares a config key and a Nuxt 3 floor', () => {
    expect(module_.meta.configKey).toBe('iryxUi')
    expect(module_.meta.compatibility.nuxt).toBe('>=3.0.0')
  })

  /*
   * The plugin is emitted as a source string, so a mistake in it is a syntax
   * error at the consumer's build rather than ours. Parse it here instead.
   */
  it('emits a plugin that parses and carries the options through', async () => {
    setup({ unstyled: true, theme: 'violet', appearance: 'dark' })
    const template = plugin()
    expect(template.filename).toBe('iryx-ui.config.mjs')

    const contents = template.getContents()
    // Parsed, not executed. `new Function` is no use here: the template is a
    // module, and `import` / `export default` / `import.meta` are all syntax
    // errors inside a function body.
    await expect(transformWithOxc(contents, 'iryx-ui.config.mjs')).resolves.toBeTruthy()

    expect(contents).toContain('"unstyled":true')
    expect(contents).toContain('applyTheme("violet")')
    expect(contents).toContain('initAppearance("dark")')
  })

  it('omits the theme and appearance calls when they are not configured', () => {
    setup()
    const contents = plugin().getContents()
    // The import is unconditional; it is the *call* that must be absent.
    expect(contents).not.toContain('applyTheme(')
    expect(contents).not.toContain('initAppearance(')
  })

  /*
   * Everything the plugin template imports has to actually be exported, or the
   * consumer's build fails on a name that only ever existed in a string.
   */
  it('only imports names the package exports', () => {
    setup()
    const imported = plugin()
      .getContents()
      .match(/import \{([^}]+)\} from 'iryx-ui'/)![1]!
      .split(',')
      .map(name => name.trim())

    expect(imported.length).toBeGreaterThan(0)
    for (const name of imported)
      expect(iryx).toHaveProperty(name)
  })
})
