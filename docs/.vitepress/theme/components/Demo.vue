<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title?: string
  /** Lays the preview out as a column rather than a wrapping row. */
  stack?: boolean
}>()

// The code shown is the page's own fenced block, passed as the default slot.
const open = ref(false)
</script>

<template>
  <figure class="not-prose my-7 overflow-hidden rounded-xl border border-border">
    <figcaption v-if="title" class="border-b border-border px-4 py-2 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">
      {{ title }}
    </figcaption>

    <!--
      The specimen stage. A faint dot grid rather than a flat fill: it reads as
      a surface the component is set *on*, which is what stops a bordered
      component from looking like a second card inside a card.
    -->
    <!--
      Centred on both axes, stacked or not. A stacked demo centres its children
      rather than stretching them, so a narrow control sits in the middle of the
      canvas instead of pinned to the left edge; anything that should span the
      stage says so with `w-full`.
    -->
    <div
      class="demo-stage flex justify-center gap-3 px-6 py-10"
      :class="stack ? 'flex-col items-center' : 'flex-wrap items-center'"
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
/*
 * Dot grid, drawn from the token so it follows the theme. Note `--iryx-border`
 * and not `--color-border`: theme.css declares the Tailwind bridge as
 * `@theme inline`, which substitutes values at build time instead of emitting
 * `--color-*` custom properties, so the Tailwind name does not exist at runtime
 * and this would silently paint nothing.
 */
.demo-stage {
  background-image: radial-gradient(circle at 1px 1px, var(--iryx-border) 1px, transparent 0);
  background-size: 16px 16px;
}

.demo-source div[class*="language-"] {
  border: 0;
  border-radius: 0;
  background: transparent;
}
</style>
