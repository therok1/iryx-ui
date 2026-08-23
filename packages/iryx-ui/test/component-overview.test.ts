import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { componentNames } from '../src'

/*
 * `IChartLegend` shipped without ever reaching the component table, and the
 * three charts sat under **Forms** for two releases. Both are the kind of
 * drift nobody notices while writing the code, so it is checked instead of
 * remembered.
 *
 * The table lives on the docs site's component overview; the package README
 * links to it rather than keeping a second copy.
 */
// Vitest's root is the package directory, and `import.meta.url` is not a
// file: URL under its transform.
const overview = readFileSync(
  resolve(process.cwd(), '../../docs/components/index.md'),
  'utf8',
)

/** Every `ICard` or [`ICard`](…) in the leading column of a table row. */
const listed = [...overview.matchAll(/^\| \[?`I(\w+)`/gm)].map(m => m[1])

function section(heading: string) {
  const start = overview.indexOf(`## ${heading}`)
  const next = overview.indexOf('\n## ', start + 1)
  return overview.slice(start, next === -1 ? undefined : next)
}

describe('component overview', () => {
  it.each(componentNames)('documents I%s', (name) => {
    expect(listed).toContain(name)
  })

  it('lists each component exactly once', () => {
    const duplicates = listed.filter((name, i) => listed.indexOf(name) !== i)
    expect(duplicates).toEqual([])
    expect(listed).toHaveLength(componentNames.length)
  })

  it('groups the charts under their own heading', () => {
    const charts = section('Charts')
    for (const name of ['ISparkline', 'IBarChart', 'ILineChart', 'IChartLegend'])
      expect(charts).toContain(`\`${name}\``)

    expect(section('Forms')).not.toContain('Chart')
    expect(section('Forms')).not.toContain('ISparkline')
  })
})
