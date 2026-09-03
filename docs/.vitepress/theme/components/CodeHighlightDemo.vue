<script setup lang="ts">
import { codeToHtml } from 'shiki'
import { ref, watchEffect } from 'vue'

/**
 * The doc's own recipe for wiring `ICode` to a highlighter, run for real
 * rather than only shown as a snippet — Shiki does the work, `ICode` only
 * supplies the chrome and the copy button.
 */
const props = defineProps<{ code: string, lang?: string }>()

const html = ref('')

watchEffect(async () => {
  html.value = await codeToHtml(props.code, {
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
