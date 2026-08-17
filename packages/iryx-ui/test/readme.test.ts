import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { componentNames } from '../src'

/**
 * `IChartLegend` shipped without ever reaching the README's component table,
 * and the three charts sat under **Forms** for two releases. Both are the kind
 * of drift nobody notices while writing the code, so it is checked instead of
 * remembered.
 */
// Vitest's root is the package directory, and `import.meta.url` is not a
// file: URL under its transform.
const readme = readFileSync(resolve(process.cwd(), 'README.md'), 'utf8')

/** The `## Components` section, up to whatever heading follows it. */
const componentsSection = readme.slice(
  readme.indexOf('## Components'),
  readme.indexOf('###', readme.indexOf('## Components')),
)

describe('readme', () => {
  it.each(componentNames)('documents I%s in the component table', (name) => {
    expect(componentsSection).toContain(`| \`I${name}\` |`)
  })

  it('lists each component exactly once', () => {
    const listed = [...componentsSection.matchAll(/^\| `I(\w+)` \|/gm)].map(m => m[1])
    const duplicates = listed.filter((name, i) => listed.indexOf(name) !== i)
    expect(duplicates).toEqual([])
    expect(listed).toHaveLength(componentNames.length)
  })

  /*
   * Charts belong with the other data-display components, not among the form
   * controls — which is where they were filed, table and prose alike.
   */
  it('groups the charts under their own heading', () => {
    const charts = componentsSection.slice(componentsSection.indexOf('**Charts**'))
    for (const name of ['ISparkline', 'IBarChart', 'ILineChart', 'IChartLegend'])
      expect(charts).toContain(`| \`${name}\` |`)

    const forms = componentsSection.slice(
      componentsSection.indexOf('**Forms**'),
      componentsSection.indexOf('**Actions**'),
    )
    expect(forms).not.toContain('Chart')
    expect(forms).not.toContain('ISparkline')
  })
})
