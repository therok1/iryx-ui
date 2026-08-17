<script setup lang="ts">
import { useData, useRoute, withBase } from 'vitepress'
import { computed } from 'vue'

interface NavItem { text: string, link: string }
interface NavGroup { title: string, items: NavItem[] }

const { theme } = useData()
const route = useRoute()

const groups = computed(() => (theme.value.sidebar ?? []) as NavGroup[])

/**
 * `route.path` keeps a trailing slash on index routes and, with `cleanUrls`,
 * drops the extension elsewhere. Normalising both sides means a link only has
 * to match what is written in the config.
 */
function normalise(path: string) {
  return path.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/'
}

const current = computed(() => normalise(route.path))
</script>

<template>
  <nav aria-label="Documentation">
    <div v-for="group in groups" :key="group.title" class="mb-7">
      <h2 class="mb-2 text-xs font-semibold tracking-wide text-foreground uppercase">
        {{ group.title }}
      </h2>
      <ul class="flex flex-col gap-0.5 text-sm">
        <li v-for="item in group.items" :key="item.link">
          <a
            :href="withBase(item.link)"
            :aria-current="normalise(item.link) === current ? 'page' : undefined"
            class="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-accent-foreground"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
