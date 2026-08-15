import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

/**
 * Pull one version's section out of the changelog, for the tag message and the
 * GitHub release body.
 *
 * Without this a release shows whatever commit the tag happens to point at —
 * which, since releases land through a merged version PR, reads as
 * "Merge pull request #2 from therok1/changeset-release/main".
 */
const version = process.argv[2]
if (!version) {
  console.error('usage: release-notes.mjs <version> [changelog] [out]')
  process.exit(1)
}

const changelogPath = process.argv[3] ?? 'packages/iryx-ui/CHANGELOG.md'
const outPath = process.argv[4] ?? 'RELEASE_NOTES.md'

const changelog = readFileSync(changelogPath, 'utf8')

// Everything between this version's heading and the next one.
const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const section = changelog.match(new RegExp(`^## ${escaped}\\s*$([\\s\\S]*?)(?=^## |\\z)`, 'm'))

const notes = section?.[1]?.trim()
if (!notes) {
  // Better a bare version than a release body quoting an unrelated commit.
  console.error(`no changelog section for ${version}; falling back to the version alone`)
  writeFileSync(outPath, `iryx-ui@${version}`)
  process.exit(0)
}

writeFileSync(outPath, notes)
console.error(`wrote ${notes.length} chars of notes for ${version}`)
