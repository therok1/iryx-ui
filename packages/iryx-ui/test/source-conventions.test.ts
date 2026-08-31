import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Conventions that hold across every component, checked against the source
 * rather than by mounting.
 *
 * `test/config.test.ts` mounts components to prove the global `unstyled`
 * option reaches them, but it can only cover the ones someone remembered to
 * add to its list — `ChartLegend` declared `unstyled` for months with no
 * `withDefaults`, so Vue cast the absent prop to `false`, the option silently
 * did nothing, and no test noticed. A source check covers all of them and
 * costs nothing to keep current.
 */
const roots = ['components', 'marketing'].map(dir => resolve(import.meta.dirname, '../src', dir))

const files = roots.flatMap(dir =>
  readdirSync(dir)
    .filter(name => name.endsWith('.vue'))
    .map(name => ({ name, source: readFileSync(join(dir, name), 'utf8') })),
)

describe('component source conventions', () => {
  it('finds the components', () => {
    expect(files.length).toBeGreaterThan(80)
  })

  /*
   * Vue casts an absent boolean prop to `false`, so `props.unstyled ??
   * config.unstyled` resolves to `false` unless the default is explicitly
   * `undefined`. The same trap applies to any prop resolved against the config.
   */
  it('gives every unstyled prop an explicit undefined default', () => {
    const missing = files
      .filter(({ source }) => source.includes('unstyled?: boolean'))
      .filter(({ source }) => !source.includes('unstyled: undefined'))
      .map(({ name }) => name)

    expect(missing).toEqual([])
  })

  /*
   * `class` has to be `ClassValue`, not `string`: templates pass arrays, and a
   * `string` type rejects the array syntax that Vue itself encourages.
   */
  it('types every class prop as ClassValue', () => {
    const wrong = files
      .filter(({ source }) => /^\s*class\?: string$/m.test(source))
      .map(({ name }) => name)

    expect(wrong).toEqual([])
  })
})
