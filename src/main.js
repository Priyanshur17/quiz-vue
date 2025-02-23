import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/styles'
import '@/index.css'
import { AgGridVue } from 'ag-grid-vue3'

const vuetify = createVuetify()

const app = createApp(App)
app.component('AgGridVue', AgGridVue)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
