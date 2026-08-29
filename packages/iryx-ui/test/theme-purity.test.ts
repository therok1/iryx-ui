import { describe, expect, it } from 'vitest'
import { cardTheme } from '../src/theme/card'

describe('theme purity', () => {
  // tailwind-variants 3.3.0 returned one memoised slot object for every call,
  // so a card resolved with the variants of whichever call came last: a
  // `padding="sm"` card rendered `p-6`. The dependency is pinned below 3.3.0;
  // this fails if that pin is ever loosened.
  it('resolves each variant independently', () => {
    const lg = cardTheme({ padding: 'lg' })
    const fallback = cardTheme({ padding: undefined })
    const sm = cardTheme({ padding: 'sm' })

    expect(String(lg.root())).toContain('p-8')
    expect(String(fallback.root())).toContain('p-6')
    expect(String(sm.root())).toContain('p-4')
  })

  it('keeps an earlier result stable after a later call', () => {
    const sm = cardTheme({ padding: 'sm' })
    const before = String(sm.root({ class: 'bg-muted/10' }))
    cardTheme({ padding: 'lg' }).root({ class: 'bg-muted/10' })

    expect(String(sm.root({ class: 'bg-muted/10' }))).toBe(before)
  })
})
