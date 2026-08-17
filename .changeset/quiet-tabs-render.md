---
"iryx-ui": patch
---

Fix `ITabs` throwing on the server. Its internal helper was named `valueOf`, and a template resolves an identifier against the render context — whose prototype chain includes `Object.prototype`. Under SSR the lookup found `Object.prototype.valueOf` rather than the component's own binding and called it with no receiver, so every tab list failed with "Cannot convert undefined or null to object" on the server while working perfectly in the browser.

Narrow `reka-ui` to `~2.10.3`. `IDrawer` is built on Reka's drawer primitive, which is marked Alpha, so its API can still change in a minor release. A patch range keeps upstream fixes flowing without letting an Alpha API change reach consumers unannounced.
