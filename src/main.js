import { createApp } from 'vue'

import '@/css/index.css'
import App from './App.vue'
import osd from '@unrest/vue-openseadragon'

createApp(App).use(osd).mount('#app')
