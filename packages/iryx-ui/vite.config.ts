import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

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
      external: [
        /^vue($|\/)/,
        /^reka-ui($|\/)/,
        /^lucide-vue-next($|\/)/,
        'tailwind-variants',
        /^@nuxt\/kit($|\/)/,
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
