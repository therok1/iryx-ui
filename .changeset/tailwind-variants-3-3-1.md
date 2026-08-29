---
'iryx-ui': patch
---

Requires `tailwind-variants` `^3.3.1`. In 3.3.0 a slot `tv()` call reused one
shared slots object, so interleaved calls cross-contaminated: a card asking for
`padding="sm"` could resolve with the variants of whichever call came last and
render `p-6`. The published range allowed 3.3.0, so consumers hit this while the
repository itself resolved 3.2.2 and never reproduced it. Upstream fixed it in
3.3.1 (heroui-inc/tailwind-variants#305); this raises the floor above the broken
release and adds a test that fails on 3.3.0.
