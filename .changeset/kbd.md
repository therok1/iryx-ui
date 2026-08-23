---
"iryx-ui": minor
---

Add `IKbd` — a keyboard shortcut drawn as one chip per key.

`mod` renders as ⌘ on Apple platforms and Ctrl everywhere else, using the same vocabulary `matchesHotkey` reads, so the shortcut you bind and the shortcut you show cannot drift apart. The platform is resolved after mount rather than during render: there is no `navigator` on the server, so deciding earlier would print "Ctrl" into server markup and "⌘" on the client and mismatch hydration on every page carrying a shortcut.

The glyphs are hidden from assistive technology and the group carries the spoken form instead — `mod+shift+k` announces as "Command Shift K" — because ⌘ on its own announces as nothing useful.

`ICommandPalette` now renders its items' shortcuts with this component instead of its own inline markup, and `matchesHotkey` shares the platform check, so there is one answer to "which key is `mod`" in the library.
