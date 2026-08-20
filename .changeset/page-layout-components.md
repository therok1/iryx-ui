---
"iryx-ui": minor
---

Add the page layout set: `IAppShell`, `ISidebar`, `IPageHeader` and `IContainer`.

`IAppShell` is a frame and nothing more — every region is a slot, so the top bar, sidebar and footer stay yours. Its `scroll` prop picks between two genuinely different layouts: `"main"` pins the shell to the viewport and scrolls only the content column, while `"page"` scrolls the document with a sticky header and sidebar, which is the one anchor links and scroll restoration work with. In `page` mode the shell measures its own header and publishes the height as `--iryx-shell-header-height`, because a sticky sidebar would otherwise park behind a sticky header and CSS has no way to say "below the header" on its own.

`ISidebar` takes links, optionally grouped into sections, with collapsible groups, badges and a `v-model:collapsed` icons-only mode. Section headings live under a `section` key rather than `label`: a collapsible group carries `items` too, so one shared key would mean guessing which of the two an entry is, and an icon-less group would quietly render as a heading.

`IPageHeader` puts the title and action row on one line from `sm` up and stacks them below it, and `IContainer` is the shared reading measure.
