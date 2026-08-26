<script setup lang="ts">
import { Content, useData, useRoute, useRouter, withBase } from 'vitepress'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import AppearanceToggle from './components/AppearanceToggle.vue'
import SidebarNav from './components/SidebarNav.vue'

const { frontmatter, theme, site } = useData()
const route = useRoute()

const isHome = computed(() => frontmatter.value.layout === 'home')

const router = useRouter()

/*
 * VitePress scrolls one tick after the route changes, before this theme's
 * async page component has rendered the heading — hence `route.component`,
 * which is assigned when the module resolves. `hashchange` catches the rest:
 * anchors on the page already open, and back or forward between two hashes.
 */
function scrollToHash() {
  if (!location.hash)
    return

  nextTick(() => {
    document.getElementById(decodeURIComponent(location.hash).slice(1))?.scrollIntoView({ block: 'start' })
  })
}

watch(() => route.component, scrollToHash)

onMounted(() => window.addEventListener('hashchange', scrollToHash))
onUnmounted(() => window.removeEventListener('hashchange', scrollToHash))

// Titles only, sourced from the sidebar so there is no second index to keep in step.
const searchOpen = ref(false)

const searchItems = computed(() =>
  (theme.value.sidebar ?? []).map((section: any) => ({
    label: section.title,
    items: section.items.map((item: any) => ({
      label: item.text,
      href: withBase(item.link),
      // The component name is what a reader knows: someone hunting ISwitch
      // types "iswitch", not "switch".
      keywords: [`I${item.text.replace(/\s+/g, '')}`, section.title],
      onSelect: () => router.go(withBase(item.link)),
    })),
  })),
)

const mobileNavOpen = ref(false)
watch(() => route.path, () => {
  mobileNavOpen.value = false
})
</script>

<template>
  <!--
    A column, so the footer can be pushed to the bottom of the viewport: on a
    short page it otherwise sat directly under the content with the rest of the
    screen left blank beneath it.

    `as="div"` is load-bearing. `IApp` renders `as="template"` by default —
    no element at all — so a `class` on it falls through to whatever the first
    child happens to be, which here was the visually-hidden skip link. Every
    layout class written here was silently landing on that anchor.
  -->
  <IApp as="div" class="flex min-h-dvh flex-col bg-background text-foreground">
    <a
      href="#content"
      class="sr-only rounded-lg bg-background px-4 py-2 text-sm font-medium ring-2 ring-primary focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to content
    </a>

    <!--
      The masthead of a specimen book, not an app bar: a hairline rule, no
      filled surface, no shadow. The apparatus stays small so the components
      below are the largest thing on the page.
    -->
    <header class="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <IContainer class="flex h-16 items-center gap-6">
        <button
          type="button"
          class="-ml-2 grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden"
          aria-label="Open navigation"
          @click="mobileNavOpen = true"
        >
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <a
          :href="withBase('/')"
          class="flex shrink-0 items-center gap-2.5 text-[1.0625rem] font-semibold tracking-[-0.03em] whitespace-nowrap transition-opacity hover:opacity-70"
        >
          <img :src="withBase('/logo.svg')" alt="" class="h-4 w-auto">
          {{ site.title }}
        </a>

        <!-- The wordmark never wraps, so the links are what stand down when the bar runs out of room. -->
        <nav class="hidden items-center gap-5 lg:flex" aria-label="Main">
          <a
            v-for="item in theme.nav"
            :key="item.link"
            :href="withBase(item.link)"
            class="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >{{ item.text }}</a>
        </nav>

        <div class="ml-auto flex items-center gap-1">
          <span class="mr-2 hidden font-mono text-xs tracking-[0.06em] text-muted-foreground sm:inline">
            v{{ theme.version }}
          </span>
          <button
            type="button"
            class="mr-1 hidden items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50 sm:flex"
            @click="searchOpen = true"
          >
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            Search
            <!-- `mod`, not a hard-coded ⌘: most readers here are not on a Mac. -->
            <IKbd keys="mod+k" size="xs" />
          </button>

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
      </IContainer>
    </header>

    <!-- The mobile sidebar is the library's own drawer. If IDrawer regresses,
         these docs stop navigating on a phone — which is the point. -->
    <IDrawer v-model:open="mobileNavOpen" side="left" size="sm" title="Navigation">
      <SidebarNav />
    </IDrawer>

    <!--
      `overflow-x-clip` belongs here, on the full-width wrapper, and nowhere
      higher: the hero's grid is a 100vw child of a centred column, so it
      overhangs the viewport by a scrollbar's width. Clipping on `html` or
      `body` also works — and breaks `position: sticky` for every descendant,
      which silently killed the sticky header site-wide.
    -->
    <div v-if="isHome" id="content" class="flex-1 overflow-x-clip">
      <Content />
    </div>

    <!--
      Inner pages: a margin index rather than a sidebar. It sits in the gutter
      at the same optical weight as a running head, so the specimen sheet keeps
      the page.
    -->
    <IContainer v-else class="flex flex-1 gap-12">
      <aside class="hidden w-52 shrink-0 lg:block">
        <!-- The library's own fade, so the index shows when it has more to scroll. -->
        <IScrollFade size="3rem" class="sticky top-16 max-h-[calc(100dvh-4rem)] py-12 pr-2">
          <SidebarNav />
        </IScrollFade>
      </aside>

      <main id="content" class="prose min-w-0 flex-1 py-14 lg:max-w-[46rem]">
        <!--
          The running head of a specimen sheet. It has to live outside
          `<Content>` because markdown always emits the `h1` first, and this
          sits above it.
        -->
        <p
          v-if="frontmatter.eyebrow"
          class="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase"
        >
          {{ frontmatter.eyebrow }}
        </p>
        <Content />
      </main>
    </IContainer>

    <footer class="border-t border-border">
      <IContainer class="flex flex-wrap items-center justify-between gap-3 py-8 font-mono text-xs tracking-[0.06em] text-muted-foreground">
        <span>MIT · {{ theme.componentCount }} components · v{{ theme.version }}</span>
        <a :href="theme.repo" target="_blank" rel="noreferrer" class="transition-colors hover:text-foreground">
          github.com/therok1/iryx-ui
        </a>
      </IContainer>
    </footer>

    <!--
      The hosts for `useToast()` and `useConfirm()`, mounted once for the whole
      site exactly as a consuming app mounts them. Without these the demos on
      the toast and confirm pages call into a store nothing is rendering, and
      nothing appears.
    -->
    <ICommandPalette
      v-model:open="searchOpen"
      :items="searchItems"
      placeholder="Search the documentation…"
      empty-text="Nothing here by that name."
      label="Search"
    />

    <IToaster />
    <IConfirmDialog />
  </IApp>
</template>
