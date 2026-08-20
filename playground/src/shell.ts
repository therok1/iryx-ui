import { IryxUi } from 'iryx-ui'
import { createApp } from 'vue'
import Shell from './Shell.vue'
import './style.css'

const app = createApp(Shell)

app.config.errorHandler = (err, instance, info) => {
  console.error(`[playground] ${info}`, instance?.$options.name ?? instance, err)
}

app.use(IryxUi).mount('#app')
