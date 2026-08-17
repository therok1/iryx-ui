<script setup lang="ts">
import { useAppearance } from 'iryx-ui'
import { onMounted, ref } from 'vue'

const { isDark, toggleAppearance } = useAppearance()

/**
 * The prerendered HTML cannot know the reader's theme, so the icon is held
 * back until the client says which one is right. Rendering the sun during
 * SSR and swapping it on hydration is a visible flicker and a hydration
 * mismatch warning.
 */
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <button
    type="button"
    class="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleAppearance()"
  >
    <svg v-if="!mounted" class="size-4" viewBox="0 0 24 24" aria-hidden="true" />
    <svg
      v-else-if="isDark"
      class="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
    <svg
      v-else
      class="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  </button>
</template>
