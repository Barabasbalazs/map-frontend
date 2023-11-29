import { createApp } from 'vue';
import './style.css';
import "leaflet/dist/leaflet.css";
import App from './App.vue'
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';

const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App);

app.use(pinia);

app.mount('#app')
