---
"iryx-ui": minor
---

New component: `ICommandPalette` — every command in the app behind one shortcut, grouped, filtered as you type, and driven entirely by keyboard.

It opens on `mod+k` by default, where `mod` is Command on Apple platforms and Control everywhere else. The listener sits on the window rather than on the palette, because the palette is not in the DOM until it opens — a listener on it could never be what opens it.

Commands carry `keywords`, which are search terms that never appear on screen: synonyms, the old name of a renamed page, the word a reader would guess before learning yours. A `shortcut` is display only — the palette never binds it, because a shortcut belongs to the command and has to work whether or not the palette is open. An `href` renders the row as an `<a>`, so middle-click and open-in-new-tab behave.

Built on Reka's `Listbox` primitives inside a dialog, so arrow keys, typeahead, focus return and `Escape` come from the same place every other overlay gets them.
