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

<!--
  A margin index, not a sidebar. The current page is marked by weight and
  colour alone — no pill, no rule in the gutter. Any marker here competes with
  the specimen it sits beside, and a left rule also reads inconsistently
  between the drawer and the desktop gutter, where it has no column to align to.
-->
<template>
  <nav aria-label="Documentation">
    <div v-for="group in groups" :key="group.title" class="mb-9">
      <h2 class="mb-3 font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {{ group.title }}
      </h2>
      <ul class="flex flex-col text-base">
        <li v-for="item in group.items" :key="item.link">
          <a
            :href="withBase(item.link)"
            :aria-current="normalise(item.link) === current ? 'page' : undefined"
            class="block py-1 text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
