import antfu from '@antfu/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

export default antfu(
  {
    vue: true,
    typescript: true,
  },
  {
    files: ['**/*.vue', '**/*.{ts,tsx,js,jsx,mjs}'],
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'playground/src/style.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-class-order': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
    },
  },
  {
    /*
     * VitePress markdown is a Vue template with prose around it, so a page is
     * full of `<template #demo>` and component tags at the top level. The SFC
     * block rules read those as malformed single-file-component blocks and
     * demand blank lines and line breaks inside what is really body copy.
     *
     * The code *samples* in these files are fenced blocks, which antfu's config
     * still lints as their own virtual files — so the code readers copy is
     * checked, while the page around it is left as prose.
     */
    files: ['docs/**/*.md', 'docs/**/*.md/**'],
    rules: {
      'vue/block-tag-newline': 'off',
      'vue/padding-line-between-blocks': 'off',
    },
  },
)
