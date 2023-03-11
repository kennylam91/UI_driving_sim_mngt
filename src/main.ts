/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueApexCharts from "vue3-apexcharts";


// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)
app.use(VueAxios, axios)
app.use(VueApexCharts)

app.mount('#app')
