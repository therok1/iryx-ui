import { resolve } from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // Honor the PORT env so external tooling can pin the dev server.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      /*
       * Develop against the library source, so a change to a component shows
       * up here without a rebuild. Copying this example out of the repo means
       * deleting this alias — `iryx-ui` then resolves to the published package,
       * which is the point.
       */
      // Ahead of the bare specifier: an object alias matches by prefix.
      'iryx-ui/marketing': resolve(import.meta.dirname, '../../packages/iryx-ui/src/marketing.ts'),
      'iryx-ui': resolve(import.meta.dirname, '../../packages/iryx-ui/src/index.ts'),
    },
  },
})
