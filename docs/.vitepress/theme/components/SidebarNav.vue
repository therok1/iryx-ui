<script setup lang="ts">
import { useData, useRoute, withBase } from 'vitepress'
import { computed, nextTick, onMounted, useTemplateRef, watch } from 'vue'

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

const root = useTemplateRef<HTMLElement>('root')

/**
 * Bring the current page's entry into view inside the index's own scroller.
 *
 * `scrollIntoView` is the obvious call and the wrong one: it walks every
 * scrollable ancestor, so on a deep page it also scrolls the document and the
 * reader lands halfway down the article they just opened. Setting `scrollTop`
 * on the scroller alone moves the index and nothing else.
 *
 * Nothing happens when the entry is already visible, so an ordinary click near
 * the top of the list does not shunt the index under the reader's cursor.
 */
function scrollerOf(element: HTMLElement): HTMLElement | undefined {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight)
      return node
  }
}

function revealCurrent() {
  const link = root.value?.querySelector<HTMLElement>('[aria-current="page"]')
  const scroller = link && scrollerOf(link)
  if (!link || !scroller)
    return

  // Measured against the scroller rather than via `offsetTop`, which is
  // relative to the offset parent — not necessarily the element that scrolls.
  const top = link.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
  const above = top < scroller.scrollTop
  const below = top + link.offsetHeight > scroller.scrollTop + scroller.clientHeight
  if (!above && !below)
    return

  // Centred rather than flush to an edge: an entry pinned to the top reads as
  // the start of the list, and the group heading above it is the context.
  scroller.scrollTop = top - scroller.clientHeight / 2 + link.offsetHeight / 2
}

// After paint: the drawer mounts this while still animating open, and the
// scroller has no height until it has finished.
onMounted(() => nextTick(revealCurrent))
watch(current, () => nextTick(revealCurrent))
</script>

<!--
  A margin index, not a sidebar. The current page is marked by weight and
  colour alone — no pill, no rule in the gutter. Any marker here competes with
  the specimen it sits beside, and a left rule also reads inconsistently
  between the drawer and the desktop gutter, where it has no column to align to.
-->
<template>
  <nav ref="root" aria-label="Documentation">
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
