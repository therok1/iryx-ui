import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const pkg = createRequire(import.meta.url)('./package.json') as {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

/**
 * Anything declared as a runtime or peer dependency must stay an import, never
 * get inlined. The list is derived from package.json rather than written out,
 * because a hand-maintained one drifts: `@hugeicons/*` and
 * `@internationalized/date` were both declared dependencies *and* bundled into
 * dist, so a consumer installed them and then got a second private copy —
 * about 38 kB of duplicate code, and two module instances of
 * `@internationalized/date`, which is enough to break an `instanceof
 * CalendarDate` check across the boundary. `test/build.test.ts` guards this.
 */
const externalDeps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        nuxt: resolve(__dirname, 'src/nuxt.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Match the package itself and any deep import within it.
      external: [
        ...externalDeps.map(name => new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|/)`)),
        /^node:/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
})
