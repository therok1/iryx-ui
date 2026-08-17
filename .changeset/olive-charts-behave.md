---
"iryx-ui": patch
---

Stop importing `node:process` in the charting code. `cartesian.ts` used it for a dev-only `NODE_ENV` check, which put a Node builtin into a browser bundle — every browser bundler externalises it, so `process` was undefined at runtime and any chart with more than eight series threw instead of warning. It now reads `process.env.NODE_ENV` as a bare global, which bundlers replace statically and can drop entirely from a production build.
