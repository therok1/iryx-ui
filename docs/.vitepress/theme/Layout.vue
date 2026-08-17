<script setup lang="ts">
import { Content, useData, useRoute, withBase } from 'vitepress'
import { computed, ref, watch } from 'vue'
import AppearanceToggle from './components/AppearanceToggle.vue'
import SidebarNav from './components/SidebarNav.vue'

const { frontmatter, theme, site } = useData()
const route = useRoute()

/** `layout: home` opts a page out of the sidebar and the content column. */
const isHome = computed(() => frontmatter.value.layout === 'home')

const mobileNavOpen = ref(false)
watch(() => route.path, () => {
  mobileNavOpen.value = false
})
</script>

<template>
  <IApp class="min-h-dvh bg-background text-foreground">
    <a
      href="#content"
      class="sr-only rounded-lg bg-background px-4 py-2 text-sm font-medium ring-2 ring-primary focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to content
    </a>

    <header class="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-[90rem] items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          class="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden"
          aria-label="Open navigation"
          @click="mobileNavOpen = true"
        >
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <a :href="withBase('/')" class="flex items-center gap-2 font-semibold tracking-tight">
          <span
            class="grid size-6 place-items-center rounded-md bg-primary text-[0.7rem] font-bold text-primary-foreground"
            aria-hidden="true"
          >I</span>
          {{ site.title }}
        </a>

        <nav class="ml-4 hidden items-center gap-1 text-sm sm:flex" aria-label="Main">
          <a
            v-for="item in theme.nav"
            :key="item.link"
            :href="withBase(item.link)"
            class="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >{{ item.text }}</a>
        </nav>

        <div class="ml-auto flex items-center gap-1">
          <AppearanceToggle />
          <a
            :href="theme.repo"
            target="_blank"
            rel="noreferrer"
            class="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="GitHub repository"
          >
            <svg class="size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>

    <!-- The mobile sidebar is the library's own drawer. If IDrawer regresses,
         these docs stop navigating on a phone — which is the point. -->
    <IDrawer v-model:open="mobileNavOpen" side="left" size="sm" title="Navigation">
      <SidebarNav />
    </IDrawer>

    <div v-if="isHome" id="content">
      <Content />
    </div>

    <div v-else class="mx-auto flex max-w-[90rem] gap-10 px-4 sm:px-6">
      <aside class="hidden w-56 shrink-0 lg:block">
        <div class="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto py-8 pr-2">
          <SidebarNav />
        </div>
      </aside>

      <main id="content" class="prose min-w-0 flex-1 py-10 lg:max-w-3xl">
        <Content />
      </main>
    </div>

    <footer class="mt-16 border-t border-border">
      <div class="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <span>Released under the MIT License.</span>
        <a :href="theme.repo" target="_blank" rel="noreferrer" class="hover:text-foreground">
          github.com/therok1/iryx-ui
        </a>
      </div>
    </footer>
  </IApp>
</template>
