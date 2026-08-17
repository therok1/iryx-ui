<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  /** Sits above the preview when the example needs a word of setup. */
  title?: string
  /** Lay the preview out as a column rather than a wrapping row. */
  stack?: boolean
}>()

/**
 * The source is the page's own fenced code block, passed as the default slot,
 * so the code shown is markdown the author wrote rather than a stringified
 * render — there is no way for the two to drift apart *silently*, which is
 * what every "extract the source automatically" approach ends up doing.
 */
const open = ref(false)
</script>

<template>
  <figure class="not-prose my-6 overflow-hidden rounded-xl border border-border">
    <figcaption v-if="title" class="border-b border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
      {{ title }}
    </figcaption>

    <div
      class="flex gap-3 p-6"
      :class="stack ? 'flex-col items-stretch' : 'flex-wrap items-center'"
    >
      <slot name="demo" />
    </div>

    <div class="border-t border-border">
      <button
        type="button"
        class="flex w-full items-center gap-1.5 px-4 py-2 text-xs text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
        :aria-expanded="open"
        @click="open = !open"
      >
        <svg
          class="size-3.5 transition-transform"
          :class="open && 'rotate-90'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
        {{ open ? 'Hide code' : 'Show code' }}
      </button>

      <!-- The fenced block keeps its own frame from style.css; strip the
           outer radius and border so it sits flush inside the figure. -->
      <div v-show="open" class="demo-source border-t border-border">
        <slot />
      </div>
    </div>
  </figure>
</template>

<style>
.demo-source div[class*="language-"] {
  border: 0;
  border-radius: 0;
  background: transparent;
}
</style>
