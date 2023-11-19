import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.css"
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { createRouter, createWebHistory } from 'vue-router';
import GraphPage from './components/GraphPage.vue';
import LiveGraph from './components/LiveGraph.vue';

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === "production" ? "/~xmuzslay/becnkhchag/" : "/"),
  routes: [
    { path: '/', redirect: '/graph-page' },
    { path: '/graph-page', component: GraphPage },
    { path: '/live-graph', component: LiveGraph },
  ],
});
const app = createApp(App);

app.use(bootstrap).use(router);

app.mount('#app');