import { resolve } from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // Honor the PORT env so external tooling (e.g. the preview runner) can
    // pin the dev server to an assigned port. Falls back to Vite's default.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  build: {
    rollupOptions: {
      // The app shell owns the viewport, so it gets its own page rather than
      // living inside the scrolling component playground.
      input: {
        main: resolve(__dirname, 'index.html'),
        shell: resolve(__dirname, 'shell.html'),
      },
    },
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // Develop against the library source for instant HMR — no rebuild needed.
      'iryx-ui': resolve(__dirname, '../packages/iryx-ui/src/index.ts'),
    },
  },
})
