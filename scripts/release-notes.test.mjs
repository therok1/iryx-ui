import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vitest'

const dir = mkdtempSync(join(tmpdir(), 'release-notes-'))

function run(version, changelog) {
  const changelogPath = join(dir, 'CHANGELOG.md')
  const outPath = join(dir, 'OUT.md')
  writeFileSync(changelogPath, changelog)
  execFileSync('node', ['scripts/release-notes.mjs', version, changelogPath, outPath])
  return readFileSync(outPath, 'utf8')
}

// The section used to be matched with a `(?=^## |\z)` lookahead. `\z` is not a
// JavaScript escape, so it read as a literal `z` and cut the notes at the first
// one — which on 0.13.0 was the `z` in a name partway through the second entry.
it('keeps everything up to the next version heading', () => {
  const notes = run(
    '1.0.0',
    ['# pkg', '', '## 1.0.0', '', '- Ana María Ruiz Vega', '- last line', '', '## 0.9.0', '', '- old'].join('\n'),
  )

  expect(notes).toBe('- Ana María Ruiz Vega\n- last line')
})

it('falls back to the bare version when the section is missing', () => {
  expect(run('2.0.0', '# pkg\n\n## 1.0.0\n\n- something\n')).toBe('iryx-ui@2.0.0')
})
