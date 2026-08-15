import { IryxUi } from 'iryx-ui'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// Surface the component trace for errors Vue would otherwise swallow into a
// bare stack, so playground regressions are diagnosable at a glance.
app.config.errorHandler = (err, instance, info) => {
  console.error(`[playground] ${info}`, instance?.$options.name ?? instance, err)
}

app.use(IryxUi).mount('#app')
