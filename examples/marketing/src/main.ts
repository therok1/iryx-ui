import { createIryxUi } from 'iryx-ui'
import { marketingComponents } from 'iryx-ui/marketing'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).use(createIryxUi({ components: marketingComponents })).mount('#app')
