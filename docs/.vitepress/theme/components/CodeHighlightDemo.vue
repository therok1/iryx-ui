<script setup lang="ts">
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { ref, watchEffect } from 'vue'

/**
 * The doc's own recipe for wiring `ICode` to a highlighter, run for real
 * rather than only shown as a snippet — Shiki does the work, `ICode` only
 * supplies the chrome and the copy button.
 *
 * Built from `shiki/core` with the two grammars this page actually uses, not
 * the `shiki` barrel the printed recipe imports. That barrel carries every
 * language Shiki ships: importing it here put 10MB of grammars into the docs
 * build and Shiki's engine into the theme chunk, which loads on every page.
 * An app highlighting a known set of languages wants this shape too.
 */
const props = defineProps<{ code: string, lang?: string }>()

const html = ref('')

const highlighter = createHighlighterCore({
  langs: [import('shiki/langs/ts.mjs'), import('shiki/langs/vue.mjs')],
  themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
  // The JavaScript engine rather than Oniguruma: no WASM to fetch, and these
  // two grammars are well within what it supports.
  engine: createJavaScriptRegexEngine(),
})

watchEffect(async () => {
  html.value = (await highlighter).codeToHtml(props.code, {
    lang: props.lang ?? 'vue',
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })
})
</script>

<template>
  <ICode block :ui="{ code: 'p-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent [&_pre]:p-4' }">
    <span v-if="html" v-html="html" />
  </ICode>
</template>
