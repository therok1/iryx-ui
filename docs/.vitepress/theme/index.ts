import type { Theme } from 'vitepress'
import { createIryxUi } from 'iryx-ui'
import { marketingComponents } from 'iryx-ui/marketing'
import { defineAsyncComponent } from 'vue'
import ChartReplay from './components/ChartReplay.vue'
import Demo from './components/Demo.vue'
import InstallCommand from './components/InstallCommand.vue'
import Layout from './Layout.vue'
import './style.css'

/**
 * A theme is nothing but a Layout and an app hook. VitePress's own theme is
 * never imported, so none of its markup or CSS exists here — the page is
 * entirely `Layout.vue`.
 */
export default {
  Layout,
  enhanceApp({ app }) {
    // The library's own plugin, so every `I*` component is available in
    // markdown without an import — and the docs exercise the plugin the same
    // way a consumer does.
    app.use(createIryxUi({ components: marketingComponents }))
    app.component('ChartReplay', ChartReplay)
    /*
     * Async, unlike its neighbours: this one carries Shiki, and a static
     * import puts the highlighter in the theme chunk that every page loads
     * for the sake of a single demo on one page.
     */
    app.component('CodeHighlightDemo', defineAsyncComponent(
      () => import('./components/CodeHighlightDemo.vue'),
    ))
    app.component('Demo', Demo)
    app.component('InstallCommand', InstallCommand)
  },
} satisfies Theme
